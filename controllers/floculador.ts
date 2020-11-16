import {Request,Response} from 'express';
import modelFlopculador from '../models/floculador';
import { Socket } from 'socket.io';
import PuntoController from './punto';

export default class FloculadorController{

    static getOne(req:Request,res:Response){

        modelFlopculador.find().sort({'_id':-1}).limit(1).populate('numero_uno').populate('numero_dos').populate('numero_tres').populate('numero_cuatro').exec((error:any,data:any)=>{
            if(error){
                return res.status(501).json({
                    ok:false,
                    error
                })
            }
            if(!data){
                return res.status(401).json({
                    ok:false
                }) 
            }
            if(data){
                return res.status(200).json({
                    ok:true,
                    data
                })
            }
        });
    }
    
    static getAll(req:Request,res:Response){

        modelFlopculador.find().sort({'_id':-1}).limit(120).exec((error:any,data:any)=>{
            if(error){
                return res.status(501).json({
                    ok:false,
                    error
                })
            }
            if(!data){
                return res.status(401).json({
                    ok:false
                }) 
            }
            if(data){
                return res.status(200).json({
                    ok:true,
                    data
                })
            }
        });
    }

    static getDatos(){
        return new Promise(async (resolve,reject)=>{
            let location="floculador";

            let turbiedad= await PuntoController.getPunto(location,"turbiedad","0");
            let uno= await PuntoController.getActuador(location,"entrada","1");
            let dos= await PuntoController.getActuador(location,"entrada","2");
            let tres= await PuntoController.getActuador(location,"entrada","3");
            let cuatro= await PuntoController.getActuador(location,"entrada","4");

            let datos ={
                uno,
                dos,
                tres,
                cuatro,
                turbiedad
            }
            resolve(datos);

       
        });
    }

    static SendDatos(cliente :Socket, io : SocketIO.Server){
        setInterval(async () => {            
            let datos = await FloculadorController.getDatos().then((data:any)=>{
                return data;
            }).catch((error:any)=>{
                return false;    
            });     
            io.emit('flo-act',datos);            
        }, 31000);
    }







}
