import express from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import common_routes from '../../api';
import config from '../config';
import { isCelebrateError } from 'celebrate';
import { iotConsumer } from '../services/mqtt';

export default ({ app }: { app: express.Application }) => {

	// Middleware that transforms the raw string of req.body into json
	app.use(bodyParser.json());
	//support parsing of application/x-www-form-urlencoded post data
	app.use(bodyParser.urlencoded({ extended: true }));

	//support cors
	app.use(cors());

	//connect AWS IOT client
	iotConsumer();

	// Load API routes
	app.use(config.api.prefix, common_routes());

	app.use((err, req, res, next) => {
		if (isCelebrateError) { //if joi produces an error, it's likely a client-side problem
			if (err.details.get('body')) {
				const { details: [details] } = err.details.get('body'); // 'details' is a Map()
				return res.status(400).json({ status: '400', message: details.message, type: 'body' });
			}
			if (err.details.get('query')) {
				const { details: [details] } = err.details.get('query'); // 'details' is a Map()
				return res.status(400).json({ status: '400', message: details.message, type: 'query' });
			}
		}
		next(err);
	});
	// / catch 404 and forward to error handler
	app.use((req, res, next) => {
		const err = new Error('Route Not Found');
		err['status'] = 404;
		next(err);
	});

	// / error handlers
	app.use((err, req, res, next) => {
		/**
		 * Handle 401 thrown by express-jwt library
		 */
		if (err.name === 'UnauthorizedError') {
			return res
				.status(err.status)
				.send({ message: err.message })
				.end();
		}
		return next(err);
	});
	app.use((err, req, res, next) => {
		res.status(err.status || 500);
		res.json({
			errors: {
				message: err.message
			}
		});
	});
};
