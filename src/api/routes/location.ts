import * as l10n from 'jm-ez-l10n';
import { Router, Request, Response } from 'express';
import Logger from '../../common/loaders/logger';
import status_code from '../../common/utils/StatusCodes';
import { ILocation } from '../interfaces/ILocation';
import { isAuth } from '../middlewares/authorization';
import { LOCATION_SCHEMA } from '../schema/location';

const route = Router();

export default (app: Router) => {
    app.use('/location', route);

    route.post('/create', LOCATION_SCHEMA.CREATE_LOCATION, isAuth, addLocation);
    route.get('/get', LOCATION_SCHEMA.GET_LOCATION, isAuth, getLocation);
    route.put('/update', LOCATION_SCHEMA.UPDATE_LOCATION, isAuth, updateLocation);
    route.delete('/delete', LOCATION_SCHEMA.DELETE_LOCATION, isAuth, deleteLocation);
};

async function addLocation(req: Request, res: Response) {
    const data = req.body;
    ILocation.addLocation(data)
        .then(response => {
            res.status(response.status).json(response);
        })
        .catch(e => {
            Logger.error(e);
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({ status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') });
        });
}

async function updateLocation(req: Request, res: Response) {
    const data = req.body;
    ILocation.updateLocation(data)
        .then(response => {
            res.status(response.status).json(response);
        })
        .catch(e => {
            Logger.error(e);
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({ status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') });
        });
}

async function getLocation(req: Request, res: Response) {
    const data = req.query;
    ILocation.getLocation(data)
        .then(response => {
            res.status(response.status).json(response);
        })
        .catch(e => {
            Logger.error(e);
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({ status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') });
        });
}

async function deleteLocation(req: any, res: Response) {
    const { id } = req.query;
    ILocation.deleteLocation(id)
        .then(response => {
            res.status(response.status).json(response);
        })
        .catch(e => {
            Logger.error(e);
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({ status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') });
        });
}

