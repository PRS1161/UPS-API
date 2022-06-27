import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto-js';
import config from '../../common/config';
import status_code from '../../common/utils/StatusCodes';

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = <string>req.headers['authorization'];
    jwt.verify(token, config.JWT_SECRET, function (err: any, decode: any) {
        if (err) return res.status(status_code.UNAUTHORISED).json({ status: status_code.UNAUTHORISED, message: 'Invalid auth token' });

        res.locals.jwtTTL = { exp: decode.exp, jwt: token };
        const bytes = crypto.AES.decrypt(decode.sub, config.CIPHER_SECRET);
        const decryptedData = bytes.toString(crypto.enc.Utf8);

        res.locals.jwtPayload = JSON.parse(decryptedData);
        Container.set('auth-token', res.locals.jwtPayload);
        Container.set('token-string', token);
        next();
    });
};