import {Request,Response} from 'express';
import modelTanques from '../models/tanques';
import { Socket } from 'socket.io';
import PuntoController from './punto';

export default class TanquesController{

    static getOne(req:Request,res:Response){

        modelTanques.find().sort({'_id':-1})
        .populate('uno.salida')
        .populate('dos.salida')
        .populate('tres.salida')
        .populate('cuatro.salida')
        .populate('cinco.salida')              
        .limit(1).exec((error:any,data:any)=>{
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

        modelTanques.find().sort({'_id':-1}).limit(120).exec((error:any,data:any)=>{
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
    static getDatos(numero:string){
        return new Promise(async (resolve,reject)=>{
            let location ="tanques";
            let nivel = await PuntoController.getPunto(location,"nivel",numero);
            let ph=await PuntoController.getPunto(location,"ph",numero);
            let cloro=await PuntoController.getPunto(location,"cloro",numero);

            let datos ={
                nivel,
                ph,
                cloro
            }
            resolve(datos);
        });
    }

    static SendDatos(cliente :Socket, io : SocketIO.Server){
        setInterval(async () => {            
            let uno = await TanquesController.getDatos("1"); 
            let dos = await TanquesController.getDatos("2");
            let tres = await TanquesController.getDatos("3");   
            let cuatro = await TanquesController.getDatos("4");
            let cinco = await TanquesController.getDatos("5");
            let actuador_uno= await PuntoController.getActuador("tanques","actuador","1");
            let actuador_dos= await PuntoController.getActuador("tanques","actuador","2");
            let actuador_tres= await PuntoController.getActuador("tanques","actuador","3");


            let datos ={
                uno,
                dos,
                tres,
                cuatro,
                cinco,
                actuador_uno,
                actuador_dos,
                actuador_tres
            }
            
            io.emit('tanques-datos',datos);            
        }, 31000);
    }





}
