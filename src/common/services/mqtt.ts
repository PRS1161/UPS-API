import { device } from "aws-iot-device-sdk";
import ConfigurationModel from "../../common/models/Configuration.model";
import DeviceModel from "../../common/models/Device.model";
import DeviceDataModel, { calculateValue } from "../../common/models/DeviceData.model";
import MessageModel from '../../common/models/Message.model';
import config from "../config";
import Logger from '../loaders/logger';
import { deviceData } from '../sockets/device';

export const iotConsumer = async () => {
    try {
        const iotDevice = new device({
            keyPath: config.KEY_PATH,
            certPath: config.CERT_PATH,
            caPath: config.CA_PATH,
            clientId: "basicPubSub",
            host: "abwq094u5vcv9-ats.iot.ap-south-1.amazonaws.com",
            autoResubscribe: true
        });

        iotDevice.on('connect', function () {
            console.log('Device connected...');
            iotDevice.subscribe('UPS/Info');
            iotDevice.subscribe('UPS/Error');
        });

        iotDevice.on('message', async function (topic, payload) {
            let data: any = JSON.parse(Buffer.from(payload).toString('utf8'));
            const { settings, _id } = await ConfigurationModel.findOne({ attribute: config.CONFIGURATION }, { settings: 1 });
            let device = await DeviceModel.findOne({ deviceId: data.deviceID });
            if (!device) device = await DeviceModel.create({ deviceId: data.deviceID, configuration: _id });

            data.deviceID = device._id;

            if (data["Error"]) {
                const messageData = {
                    title: `Check Device ${device.deviceId}`,
                    description: data["Error"],
                    deviceId: data["deviceID"],
                    type: 0
                }
                await MessageModel.create(messageData);
                deviceData(data.deviceID, { error: data["Error"] });
            } else {
                const saveData = {
                    deviceId: data["deviceID"],
                    dateTime: data["Date-Time"],
                    outputVoltage: data["Parameter1"],
                    currentLoad: data["Parameter2"],
                    batteryVoltage: data["Parameter3"],
                    currentBattery: data["Parameter4"],
                    dischargeBattery: data["Parameter5"],
                    mainVoltage: data["Parameter6"],
                    mainCurrent: data["Parameter7"],
                    frequency: data["Parameter8"],
                    restart: data["Restart-Count"]
                }
                let newDeviceData: any = await DeviceDataModel.create(saveData);

                newDeviceData = newDeviceData.toJSON();
                newDeviceData.outputVoltage = calculateValue(newDeviceData.outputVoltage, settings[0].key);
                newDeviceData.currentLoad = calculateValue(newDeviceData.currentLoad, settings[1].key);
                newDeviceData.mainVoltage = calculateValue(newDeviceData.mainVoltage, settings[2].key);
                newDeviceData.frequency = newDeviceData.mainVoltage != 0 ? config.FREQUENCY : 0;
                newDeviceData.batteryVoltage = calculateValue(newDeviceData.batteryVoltage, settings[4].key);
                newDeviceData.currentBattery = calculateValue(newDeviceData.currentBattery, settings[5].key);
                newDeviceData.dischargeBattery = calculateValue(newDeviceData.dischargeBattery, settings[6].key);

                deviceData(data.deviceID, newDeviceData);
            }
        });

        iotDevice.on("error", function (err) {
            console.log('err', err);
        });

        iotDevice.on("reconnect", function () {
            console.log('reconnect');
        });

    } catch (error) {
        console.log("ERR:", error)
        Logger.error(`Error in IOT consumer: ${error.toString()}`);
    }

}