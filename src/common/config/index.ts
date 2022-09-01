import dotenv from 'dotenv';

if (!dotenv) {
	throw new Error('Unable to use dot env lib');
}
// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();

if (!envFound) {
	// This error should crash whole process
	throw new Error("⚠️ Couldn't find .env file ⚠️");
}

export default {
	/**
	 * Prod or development server
	 */
	ENV: process.env.NODE_ENV,

	/**
	 * Your favorite port
	 */
	PORT: parseInt(process.env.PORT, 10),

	/* Encryption keys */
	ENC_KEY: process.env.ENC_KEY,
	ENC_IV: process.env.ENC_IV,

	/* JWT */
	JWT_SECRET: process.env.JWT_SECRET,
	CIPHER_SECRET: process.env.CIPHER_SECRET,
	JWT_TTL: process.env.JWT_TTL,

	/* MongoDB */
	MONGO_URI: process.env.MONGO_URI,

	/* AWS MQTT Crendentials */

	KEY_PATH: process.env.KEY_PATH,
	CERT_PATH: process.env.CERT_PATH,
	CA_PATH: process.env.CA_PATH,
	HOST: process.env.HOST,

	/* Configuration */
	CONFIGURATION: 5,
	OUTPUT_VOLTAGE: 0.1125,
	CURRENT_LOAD: 0.0083,
	MAIN_VOLTAGE: 0.1125,
	FREQUENCY: 50,
	BATTERY_VOLTAGE: 0.0937,
	CURRENT_BATTERY: 0.0025,
	DISCHARGE_BATTERY: 0,

	/**
	 * Used by winston logger
	 */
	logs: {
		level: process.env.LOG_LEVEL || 'silly',
		path: process.env.LOG_PATH || './'
	},

	/**
	 * API configs
	 */
	api: {
		prefix: '/'
	},

};
