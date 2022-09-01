import config from "../../common/config";
import ConfigurationModel from "../../common/models/Configuration.model";

export const defaultConfiguration = async () => {
    const configuration = await ConfigurationModel.findOne({ attribute: config.CONFIGURATION });
    if (!configuration) {
        const saveData = {
            attribute: config.CONFIGURATION,
            settings: [
                { key: config.OUTPUT_VOLTAGE },
                { key: config.CURRENT_LOAD },
                { key: config.MAIN_VOLTAGE },
                { key: config.FREQUENCY },
                { key: config.BATTERY_VOLTAGE },
                { key: config.CURRENT_BATTERY },
                { key: config.DISCHARGE_BATTERY },
            ]
        }
        await ConfigurationModel.create(saveData);
    }
};