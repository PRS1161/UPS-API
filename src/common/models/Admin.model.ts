import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface AdminAttributes {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    createdAt?: Date,
    updatedAt?: Date
};

const AdminSchema = new Schema<AdminAttributes>(
    {
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        email: {
            type: String
        },
        password: {
            type: String
        }
    },
    {
        collection: 'admins',
        versionKey: false,
        timestamps: true
    }
);

AdminSchema.pre('save', async function (next) {
    var admin = this;
    if (admin.password) {
        const salt = await bcrypt.genSalt(10);
        const encryptPassword = await bcrypt.hash(admin.password, salt);
        admin.password = encryptPassword;
        next();
    } else return next();
});

AdminSchema.pre('updateOne', async function (next) {
    if (this._update.password) {
        const salt = await bcrypt.genSalt(10);
        const encryptPassword = await bcrypt.hash(this._update.password, salt);
        this._update.password = encryptPassword;
        next();
    } else return next();
});

AdminSchema.methods.comparePassword = async (password, userPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, userPassword, (err, result) => {
            if (err) {
                resolve(false);
            }
            if (result == true) {
                resolve(true);
            } else {
                resolve(false);
            }
        })
    });
}

const AdminModel = model<AdminAttributes>('admins', AdminSchema);

export default AdminModel;