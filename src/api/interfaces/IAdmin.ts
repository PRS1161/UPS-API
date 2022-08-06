import * as l10n from 'jm-ez-l10n';
import { Container } from 'typedi';
import bcrypt from 'bcryptjs';
import AdminModel from '../../common/models/Admin.model';
import DeviceModel from '../../common/models/Device.model';
import MessageModel from '../../common/models/Message.model';
import status_code from '../../common/utils/StatusCodes';
import { generateJWTToken } from '../../common/utils/JWTToken';
import Logger from '../../common/loaders/logger';

export class IAdmin {
    static async register(data: any) {
        try {
            const admin = await AdminModel.findOne({ email: data.email.toLowerCase() });
            if (admin) return { status: status_code.ALREADY_EXIST, message: l10n.t('ALREADY_EXISTS', { key: 'Email' }) };

            const saveData = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email.toLowerCase(),
                password: data.password
            };

            await AdminModel.create(saveData);
            return { status: status_code.OK, message: l10n.t('COMMON_SUCCESS', { key: "Admin", method: "registered" }) };
        } catch (error) {
            Logger.error(error);
            return { status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') };
        }
    }

    static async login(data: any) {
        try {
            let admin: any = await AdminModel.findOne({ email: data.email.toLowerCase() });
            if (!admin) return { status: status_code.NOT_FOUND, message: l10n.t('NOT_FOUND', { key: 'Admin' }) };
            const verifyPassword = await admin.comparePassword(data.password, admin.password);
            if (!verifyPassword) return { status: status_code.BAD_REQUEST, message: l10n.t('INVALID_CREDENTIALS') };

            let token_data = { id: admin._id, firsName: admin.firstName, lastName: admin.lastName, email: admin.email };
            const token = await generateJWTToken(token_data);
            admin = admin.toJSON();
            admin.token = token;
            delete admin.password;

            return { status: status_code.OK, message: l10n.t('COMMON_SUCCESS', { key: 'Admin', method: 'logged in' }), data: admin };

        } catch (error) {
            Logger.error(error);
            return { status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') };
        }
    }

    static async dashboard() {
        try {
            const [{ active = 0, inActive = 0 } = []] = await DeviceModel.aggregate([
                {
                    $group: {
                        _id: null,
                        active: { $sum: { $cond: ["$status", 1, 0] } },
                        inActive: { $sum: { $cond: ["$status", 0, 1] } }
                    }
                }
            ]);

            const devices = await DeviceModel.aggregate([
                {
                    $lookup: {
                        localField: 'configuration',
                        foreignField: '_id',
                        from: 'configuration',
                        as: 'config',
                        pipeline: [{ $project: { attribute: 1 } }]
                    },
                },
                {
                    $unwind: {
                        path: "$config",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        deviceId: 1,
                        name: 1,
                        location: 1,
                        configuration: "$config.attribute",
                        status: 1
                    }
                },
                { $limit: 5 },
                { $sort: { createdAt: -1 } }
            ]);
            const messages = await MessageModel.find().limit(5).sort({ createdAt: -1 });
            return { status: status_code.OK, message: l10n.t('COMMON_SUCCESS', { key: 'Dashboard data', method: 'get' }), data: { active, inActive, messages, devices } };
        } catch (error) {
            Logger.error(error);
            return { status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') };
        }
    }

    static async getProfile() {
        try {
            const token_data: any = Container.get('auth-token');

            const admin = await AdminModel.findOne({ _id: token_data.id }, { firstName: 1, lastName: 1, email: 1 });
            if (!admin) return { status: status_code.NOT_FOUND, message: l10n.t('NOT_FOUND', { key: 'Admin' }) };

            return { status: status_code.OK, message: l10n.t('GET_SUCCESS', { key: 'Admin' }), data: admin };

        } catch (error) {
            Logger.error(error);
            return { status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') };
        }
    }

    static async updateProfile(data: any) {
        try {
            const token_data: any = Container.get('auth-token');

            const admin = await AdminModel.findOne({ _id: token_data.id });
            if (!admin) return { status: status_code.NOT_FOUND, message: l10n.t('NOT_FOUND', { key: 'Admin' }) };

            if (data.email) {
                const emailExists = await AdminModel.findOne({ email: data.email.toLowerCase() });
                if (emailExists) return { status: status_code.ALREADY_EXIST, message: l10n.t('ALREADY_EXISTS', { key: 'email' }) };

                data.email = data.email.toLowerCase();
            }

            await AdminModel.updateOne({ _id: token_data.id }, data);
            return { status: status_code.OK, message: l10n.t('UPDATE_RESOURCE', { key: 'Your profile has been' }) };

        } catch (error) {
            Logger.error(error);
            return { status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') };
        }
    }

    static async changePassword(data: any) {
        try {
            const token_data: any = Container.get('auth-token');

            let admin: any = await AdminModel.findOne({ _id: token_data.id });
            if (!admin) return { status: status_code.NOT_FOUND, message: l10n.t('NOT_FOUND', { key: 'Admin' }) };

            const verifyOldPassword = await admin.comparePassword(data.oldPassword, admin.password);
            if (!verifyOldPassword) return { status: status_code.BAD_REQUEST, message: l10n.t('MISSMATCH_PASSWORD') };

            const salt = await bcrypt.genSalt(10);
            const encryptPassword = await bcrypt.hash(data.newPassword, salt);

            await AdminModel.updateOne({ _id: token_data.id }, { password: encryptPassword });
            return { status: status_code.OK, message: l10n.t('RESET_PASSWORD') };

        } catch (error) {
            Logger.error(error);
            return { status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') };
        }
    }
}