import {Request,Response} from 'express';
import modelSedimentador from '../models/sedimentaror';
import { Socket } from 'socket.io';
import PuntoController from './punto';

export default class SedimentadorController{

    static getOne(req:Request,res:Response){

        modelSedimentador.find().sort({'_id':-1}).limit(1).populate('numero_uno').populate('numero_dos').populate('numero_tres').exec((error:any,data:any)=>{
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

        modelSedimentador.find().sort({'_id':-1}).limit(120).exec((error:any,data:any)=>{
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

            let location="sedimentador";           
            let uno= await PuntoController.getActuador(location,"entrada","1");
            let dos= await PuntoController.getActuador(location,"entrada","2");
            let tres= await PuntoController.getActuador(location,"entrada","3");   
            
            let datos ={
                uno,
                dos,
                tres            
            }
            resolve(datos);
           
        });
    }

    static SendDatos(cliente :Socket, io : SocketIO.Server){
        setInterval(async () => {            
            let datos = await SedimentadorController.getDatos().then((data:any)=>{
                return data;
            }).catch((error:any)=>{
                return false;    
            });     
            io.emit('sedi-act',datos);            
        }, 31000);
    }





}
