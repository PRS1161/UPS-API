import expressLoader from './express';
import Logger from './logger';
import connectMongo from './mongoose';

export default async ({ expressApp }) => {

	await connectMongo();

	// Load dependencies
	Logger.info('✌️ Express loaded');
	await expressLoader({ app: expressApp });
};
