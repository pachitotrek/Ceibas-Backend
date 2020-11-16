import {Request,Response} from 'express';
import modelFiltroint from '../models/filtros_int';
import { Socket } from 'socket.io';
import PuntoController from './punto';

export default class FiltroIntController{

    static getOne(req:Request,res:Response){

        modelFiltroint.find({},{dos:false,tres:false}).sort({'_id':-1})
        .populate('uno.entrada')
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

        modelFiltroint.find().sort({'_id':-1}).limit(120).exec((error:any,data:any)=>{
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
    static getFiltro(numero:string){
        return new Promise(async (resolve,reject)=>{
            let location="interior";                         
            let eflder= await PuntoController.getActuador(location,"efluente.der",numero);
            let eflizq= await PuntoController.getActuador(location,"efluente.izq",numero);
            let entrada= await PuntoController.getActuador(location,"entrada",numero);
            let turbiedad =await PuntoController.getPunto(location,"turbiedad",numero);
            let nivel =await PuntoController.getPunto(location,"nivel",numero);

            let data ={
                eflder,
                eflizq,
                entrada,
                turbiedad,
                nivel
            };

            resolve(data);
        });
    }

    static SendDatos(cliente :Socket, io : SocketIO.Server){
        setInterval(async () => {            
            let uno = await FiltroIntController.getFiltro("1");
            let dos = await FiltroIntController.getFiltro("2");
            let tres = await FiltroIntController.getFiltro("3");
            let cuatro = await FiltroIntController.getFiltro("4");
            let cinco = await FiltroIntController.getFiltro("5");
            let seis = await FiltroIntController.getFiltro("6");

            

            let datos ={
                uno,
                dos,
                tres,
                cuatro,
                cinco,
                seis
            }
           
            io.emit('int-act',datos);            
        }, 31000);
    }
    

    





}
