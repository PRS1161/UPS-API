import { Router } from 'express';
import admin from './routes/admin';
import state from './routes/state';
import city from './routes/city';
import location from './routes/location';
import device from './routes/device';
import configuration from './routes/configuration';

export default () => {
    const app = Router();
    admin(app);
    state(app);
    city(app);
    location(app);
    device(app);
    configuration(app);
    return app;
};