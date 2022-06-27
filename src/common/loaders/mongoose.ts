import mongoose from 'mongoose';
import Logger from '../loaders/logger';
import config from '../config';

mongoose.Promise = global.Promise;

mongoose.connection.on('connected', () => {
    Logger.info('MongoDB Connected...');
});

const connectMongo = () => {
    const options: any = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };

    mongoose.set('debug', true);
    mongoose.connect(config.MONGO_URI,options);
    return mongoose.connection;
};

export default connectMongo;