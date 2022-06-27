import * as l10n from 'jm-ez-l10n';
import { Router, Request, Response } from 'express';
import Logger from '../../common/loaders/logger';
import status_code from '../../common/utils/StatusCodes';
import { IState } from '../interfaces/IState';
import { isAuth } from '../middlewares/authorization';
import { STATE_SCHEMA } from '../schema/state';

const route = Router();

export default (app: Router) => {
    app.use('/state', route);

    route.post('/create', STATE_SCHEMA.CREATE_STATE, isAuth, addState);
    route.get('/get', STATE_SCHEMA.GET_STATE, isAuth, getState);
    route.put('/update', STATE_SCHEMA.UPDATE_STATE, isAuth, updateState);
    route.delete('/delete',STATE_SCHEMA.DELETE_STATE, isAuth, deleteState);
};

async function addState(req: Request, res: Response) {
    const data = req.body;
    IState.addState(data)
        .then(response => {
            res.status(response.status).json(response);
        })
        .catch(e => {
            Logger.error(e);
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({ status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') });
        });
}

async function updateState(req: Request, res: Response) {
    const data = req.body;
    IState.updateState(data)
        .then(response => {
            res.status(response.status).json(response);
        })
        .catch(e => {
            Logger.error(e);
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({ status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') });
        });
}

async function getState(req: Request, res: Response) {
    const data = req.query;
    IState.getState(data)
        .then(response => {
            res.status(response.status).json(response);
        })
        .catch(e => {
            Logger.error(e);
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({ status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') });
        });
}

async function deleteState(req: any, res: Response) {
    const { id } = req.query;
    IState.deleteState(id)
        .then(response => {
            res.status(response.status).json(response);
        })
        .catch(e => {
            Logger.error(e);
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({ status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') });
        });
}

