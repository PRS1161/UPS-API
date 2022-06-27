import * as l10n from 'jm-ez-l10n';
import { Router, Request, Response } from 'express';
import Logger from '../../common/loaders/logger';
import status_code from '../../common/utils/StatusCodes';
import { IAdmin } from '../interfaces/IAdmin';
import { isAuth } from '../middlewares/authorization';
import { ADMIN_SCHEMA } from '../schema/admin';

const route = Router();

export default (app: Router) => {
    app.use('/', route);

    route.post('/register',ADMIN_SCHEMA.REGISTER, register);
    route.post('/login',ADMIN_SCHEMA.LOGIN, login);
    route.get('/dashboard', isAuth, dashboard);
    route.get('/profile', isAuth, getProfile);
    route.put('/profile', ADMIN_SCHEMA.UPDATE_PROFILE, isAuth, updateProfile);
    route.put('/change-password', ADMIN_SCHEMA.CHANGE_PASSWORD, isAuth, changePassword);
};

async function register(req: Request, res: Response) {
    const data = req.body;
    IAdmin.register(data)
        .then(response => {
            res.status(response.status).json(response);
        })
        .catch(e => {
            Logger.error(e);
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({ status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') });
        });
}

async function login(req: Request, res: Response) {
    const data = req.body;
    IAdmin.login(data)
        .then(response => {
            res.status(response.status).json(response);
        })
        .catch(e => {
            Logger.error(e);
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({ status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') });
        });
}

async function dashboard(req: Request, res: Response) {
    IAdmin.dashboard()
        .then(response => {
            res.status(response.status).json(response);
        })
        .catch(e => {
            Logger.error(e);
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({ status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') });
        });
}

async function getProfile(req: Request, res: Response) {
    IAdmin.getProfile()
        .then(response => {
            res.status(response.status).json(response);
        })
        .catch(e => {
            Logger.error(e);
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({ status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') });
        });
}

async function updateProfile(req: Request, res: Response) {
    const data = req.body;
    IAdmin.updateProfile(data)
        .then(response => {
            res.status(response.status).json(response);
        })
        .catch(e => {
            Logger.error(e);
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({ status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') });
        });
}

async function changePassword(req: Request, res: Response) {
    const data = req.body;
    IAdmin.changePassword(data)
        .then(response => {
            res.status(response.status).json(response);
        })
        .catch(e => {
            Logger.error(e);
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({ status: status_code.INTERNAL_SERVER_ERROR, message: l10n.t('SOMETHING_WENT_WRONG') });
        });
}



