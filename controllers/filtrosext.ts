import {Request,Response} from 'express';
import modelFiltroext from '../models/filtros_ext';
import { Socket } from 'socket.io';

export default class FiltroExtController{

    static getOne(req:Request,res:Response){

        modelFiltroext.find().sort({'_id':-1}).populate('numero_uno.efluente')
        .populate('numero_uno.entrada').populate('numero_dos.entrada').populate('numero_dos.efluente')
        .populate('numero_tres.efluente').populate('numero_tres.entrada').populate('numero_cuatro.efluente').populate('numero_cuatro.entrada')
        .populate('numero_cinco.entrada').populate('numero_cinco.efluente')
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

        modelFiltroext.find().sort({'_id':-1}).limit(120).exec((error:any,data:any)=>{
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
        return new Promise((resolve,reject)=>{
            modelFiltroext.find().sort({'_id':-1}).limit(1)
            .populate('numero_uno.entrada').populate('numero_dos.entrada').populate('numero_dos.efluente')
            .populate('numero_tres.efluente').populate('numero_tres.entrada').populate('numero_cuatro.efluente').populate('numero_cuatro.entrada')
            .populate('numero_cinco.entrada').populate('numero_cinco.efluente')            
            .exec((error:any,data:any)=>{
                if(error){
                 reject(false);
                }
                if(!data){
                    reject(false);
                }
                if(data){
                    resolve(data); 
                }
            });
        });
    }

    static SendDatos(cliente :Socket, io : SocketIO.Server){
        setInterval(async () => {            
            let datos = await FiltroExtController.getDatos().then((data:any)=>{
                return data;
            }).catch((error:any)=>{
                return false;    
            });     
            io.emit('ext-act',datos);            
        }, 31000);
    }







}
