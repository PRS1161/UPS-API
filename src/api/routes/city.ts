import * as l10n from 'jm-ez-l10n';
import { Router, Request, Response } from 'express';
import Logger from '../../common/loaders/logger';
import status_code from '../../common/utils/StatusCodes';
import { ICity } from '../interfaces/ICity';
import { isAuth } from '../middlewares/authorization';
import { CITY_SCHEMA } from '../schema/city';

const route = Router();

export default (app: Router) => {
    app.use('/city', route);

    route.post('/create', CITY_SCHEMA.CREATE_CITY, isAuth, addCity);
    route.get('/get', CITY_SCHEMA.GET_CITY, isAuth, getCity);
    route.put('/update', CITY_SCHEMA.UPDATE_CITY, isAuth, updateCity);
    route.delete('/delete',CITY_SCHEMA.DELETE_CITY, isAuth, deleteCity);
};

async function addCity(req: Request, res: Response) {
    const data = req.body;
    ICity.addCity(data)
        .then(response => {
            res.status(response.status).json(response);
        })
        .catch(e => {
            Logger.error(e);
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({ status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') });
        });
}

async function updateCity(req: Request, res: Response) {
    const data = req.body;
    ICity.updateCity(data)
        .then(response => {
            res.status(response.status).json(response);
        })
        .catch(e => {
            Logger.error(e);
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({ status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') });
        });
}

async function getCity(req: Request, res: Response) {
    const data = req.query;
    ICity.getCity(data)
        .then(response => {
            res.status(response.status).json(response);
        })
        .catch(e => {
            Logger.error(e);
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({ status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') });
        });
}

async function deleteCity(req: any, res: Response) {
    const { id } = req.query;
    ICity.deleteCity(id)
        .then(response => {
            res.status(response.status).json(response);
        })
        .catch(e => {
            Logger.error(e);
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({ status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') });
        });
}

