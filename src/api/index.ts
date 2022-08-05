import { Router } from 'express';
import admin from './routes/admin';
import device from './routes/device';
import configuration from './routes/configuration';

export default () => {
    const app = Router();
    admin(app);
    device(app);
    configuration(app);
    return app;
};