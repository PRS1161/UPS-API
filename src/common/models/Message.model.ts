import { Schema, model } from 'mongoose';

export interface MessageAttributes {
    title: string,
    description: string,
    deviceId: any,
    type: number,
    createdAt?: Date,
    updatedAt?: Date
}

const MessageSchema = new Schema<MessageAttributes>(
    {
        title: {
            type: String,
            default: ''
        },
        description: {
            type: String,
            default: ''
        },
        deviceId: {
            type: Schema.Types.ObjectId,
            ref: "device"
        },
        type: {
            type: Number,
            enum: [0, 1], // 0 - Error, 1 - Info
            required: true
        }
    },
    {
        collection: 'message',
        versionKey: false,
        timestamps: true
    }
);

const MessageModel = model<MessageAttributes>('message', MessageSchema);

export default MessageModel;