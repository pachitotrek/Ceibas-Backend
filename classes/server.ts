import express from 'express';
import { SERVER_PORT } from '../global/environment';
import socketIO from 'socket.io';
import http from 'http';
import * as sk from '../sockets/socket';


export default class Server {
    private static _instance:Server;
    public app:express.Application;
    public port :Number;

    public io : socketIO.Server;
    private httpServer:http.Server;

    private constructor(){
        this.app = express();
        this.port=SERVER_PORT;
        this.httpServer = new http.Server ( this.app );
        this.io = socketIO( this.httpServer );
        this.escucharSockets();
    }

    public static get Instance(){
        return this._instance || (this._instance = new this() );
    }

    private escucharSockets() {

        console.log('Escuchando conexiones - sockets');

        this.io.on('connection', cliente => {

            console.log('Cliente conectado');
            // Conectar cliente
            sk.conectarCliente( cliente );
            // Configurar usuario
            sk.configurandoUser( cliente, this.io );
            // Mensajes
            sk.mensaje( cliente, this.io );
            // Desconectar
            sk.desconectar( cliente );              
            
            
            sk.floculador(cliente,this.io);
            sk.sedimentador(cliente,this.io);
            sk.vertedero(cliente,this.io);
            sk.interiores(cliente,this.io);
            // sk.exteriores(cliente,this.io);
            sk.tanques(cliente,this.io);
            sk.graphica(cliente,this.io);
            sk.tanquesunit(cliente,this.io);
            sk.interior(cliente,this.io);
            sk.apoyo(cliente,this.io);
            // sk.filtroInterior(cliente,this.io);
        });

    }


    start( callback: Function ){
        this.httpServer.listen(this.port, callback() );
    }

}