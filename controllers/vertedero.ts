import {Request,Response} from 'express';
import vertedero from '../models/point';
import { Socket } from 'socket.io';
import PuntoController from './punto';
require('../models/actuador');

export default class VertederoController{

    static getOne(req:Request,res:Response){

        vertedero.find().sort({'_id':-1}).limit(1).populate('actuador').exec((error:any,data:any)=>{
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

        vertedero.find().sort({'_id':-1}).limit(120).exec((error:any,data:any)=>{
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
            let location ="vertedero";
            let numero="1";
            let caudal = await PuntoController.getPunto(location,"caudal",numero);
            let nivel = await PuntoController.getPunto(location,"nivel",numero);
            let temperatura= await PuntoController.getPunto(location,"temperatura",numero);
            let conductividad =await PuntoController.getPunto(location,"conductividad",numero);
            let ph=await PuntoController.getPunto(location,"ph",numero);
            let turbiedad=await PuntoController.getPunto(location,"turbiedad-alta",numero);
            let actuador=await PuntoController.getActuador(location,"entrada",numero);


            let datos =[{
                caudal,
                nivel,
                temperatura,
                conductividad,
                ph,
                turbiedad,
                actuador
            }]; 


            resolve (datos);          
            
        });
    }

    static SendDatos(cliente :Socket, io : SocketIO.Server){
        setInterval(async () => {            
            let datos = await VertederoController.getDatos().then((data:any)=>{
                return data;
            }).catch((error:any)=>{
                return false;    
            });     
            io.emit('vert-datos',datos);            
        }, 30000);
    }




}