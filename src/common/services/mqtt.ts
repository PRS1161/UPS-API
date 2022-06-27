import { device } from "aws-iot-device-sdk";
import DeviceModel from "../../common/models/Device.model";
import DeviceDataModel from "../../common/models/DeviceData.model";
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
            let device = await DeviceModel.findOne({ deviceId: data.deviceID });
            if (!device) device = await DeviceModel.create({ deviceId: data.deviceID });

            data.deviceID = device._id;

            if (data["Error"]) {
                const messageData = {
                    title: `Check Device ${device.deviceId}`,
                    description: data["Error"],
                    deviceId: data["deviceID"],
                    type: 0
                }
                const message = await MessageModel.create(messageData);
                deviceData(data.deviceID, { error: data["Error"] });
            } else {
                const saveData = {
                    deviceId: data["deviceID"],
                    dateTime: data["Date-Time"],
                    outputVoltage: data["Parameter1"],
                    currnetLoad: data["Parameter2"],
                    batteryVoltage: data["Parameter3"],
                    currentBattery: data["Parameter4"],
                    dischargeBattery: data["Parameter5"],
                    mainVoltage: data["Parameter6"],
                    mainCurrent: data["Parameter7"],
                    frequency: data["Parameter8"],
                    restart: data["Restart-Count"]
                }
                const newDeviceData = await DeviceDataModel.create(saveData);
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