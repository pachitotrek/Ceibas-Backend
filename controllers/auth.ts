import jwt from 'jsonwebtoken';
import { SEED } from '../global/environment';
import Server from '../classes/server';


export default class TokenController {

    static verificar(token: string, idcliente: any) {
        const server = Server.Instance;

        return new Promise((resolve, reject) => {

            jwt.verify(token, SEED, (error: any, decode: any) => {
                if (error) {
                    server.io.in(idcliente).emit('desconectar');
                    resolve(false);
                }
                if (decode) {
                    let usuario = decode;
                    resolve(usuario);
                }
            });
        });
    }



}

