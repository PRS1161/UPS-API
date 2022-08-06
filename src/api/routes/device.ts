import * as l10n from 'jm-ez-l10n';
import { Router, Request, Response } from 'express';
import Logger from '../../common/loaders/logger';
import status_code from '../../common/utils/StatusCodes';
import { IDevice } from '../interfaces/IDevice';
import { isAuth } from '../middlewares/authorization';
import { DEVICE_SCHEMA } from '../schema/device';

const route = Router();

export default (app: Router) => {
    app.use('/device', route);

    route.post('/', DEVICE_SCHEMA.CREATE_DEVICE, isAuth, addDevice);
    route.get('/', DEVICE_SCHEMA.GET_DEVICE, isAuth, getDevice);
    route.put('/', DEVICE_SCHEMA.UPDATE_DEVICE, isAuth, updateDevice);
};

async function addDevice(req: Request, res: Response) {
    const data = req.body;
    IDevice.addDevice(data)
        .then(response => {
            res.status(response.status).json(response);
        })
        .catch(e => {
            Logger.error(e);
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({ status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') });
        });
}

async function getDevice(req: Request, res: Response) {
    const data = req.query;
    IDevice.getDevice(data)
        .then(response => {
            res.status(response.status).json(response);
        })
        .catch(e => {
            Logger.error(e);
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({ status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') });
        });
}

async function updateDevice(req: Request, res: Response) {
    const data = req.body;
    IDevice.updateDevice(data)
        .then(response => {
            res.status(response.status).json(response);
        })
        .catch(e => {
            Logger.error(e);
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({ status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') });
        });
}