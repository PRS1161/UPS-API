import * as l10n from 'jm-ez-l10n';
import { Router, Request, Response } from 'express';
import Logger from '../../common/loaders/logger';
import status_code from '../../common/utils/StatusCodes';
import { IConfiguration } from '../interfaces/IConfiguration';
import { isAuth } from '../middlewares/authorization';
import { CONFIGURATION_SCHEMA } from '../schema/configuration';

const route = Router();

export default (app: Router) => {
    app.use('/configuration', route);

    route.post('/', CONFIGURATION_SCHEMA.CREATE_CONFIGURATION, isAuth, addCounfiguration);
    route.get('/', CONFIGURATION_SCHEMA.GET_CONFIGURATION, isAuth, getConfiguration);
    route.put('/', CONFIGURATION_SCHEMA.UPDATE_CONFIGURATION, isAuth, updateConfiguration);
    route.delete('/:id', CONFIGURATION_SCHEMA.DELETE_CONFIGURATION, isAuth, deleteConfiguration);
};

async function addCounfiguration(req: Request, res: Response) {
    const data = req.body;
    IConfiguration.addCounfiguration(data)
        .then(response => {
            res.status(response.status).json(response);
        })
        .catch(e => {
            Logger.error(e);
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({ status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') });
        });
}

async function updateConfiguration(req: Request, res: Response) {
    const data = req.body;
    IConfiguration.updateConfiguration(data)
        .then(response => {
            res.status(response.status).json(response);
        })
        .catch(e => {
            Logger.error(e);
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({ status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') });
        });
}

async function getConfiguration(req: Request, res: Response) {
    const data = req.query;
    IConfiguration.getConfiguration(data)
        .then(response => {
            res.status(response.status).json(response);
        })
        .catch(e => {
            Logger.error(e);
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({ status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') });
        });
}

async function deleteConfiguration(req: Request, res: Response) {
    const { id } = req.params;
    IConfiguration.deleteConfiguration(id)
        .then(response => {
            res.status(response.status).json(response);
        })
        .catch(e => {
            Logger.error(e);
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({ status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') });
        });
}

