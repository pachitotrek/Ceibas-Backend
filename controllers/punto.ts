import modelPunto from '../models/point';
import modelActuador from '../models/actuador';
import {Request,Response} from 'express';


export default class PuntoController{

    static async getPunto(location: any, categoria: any, numero: any) {
        return new Promise((resolve, reject) => {

            let query = { location: location, categoria: categoria, numero: numero };

            modelPunto.find(query).limit(1).sort({"_id":-1}).sort({"time":-1}).exec((error: any, data: any) => {
                if (error) {
                    console.log("error");
                    reject(false);
                }
                if (!data) {
                    resolve(false);
                }
                if (data) {
                    resolve(data[0])
                }
            });
        });
    }

    static async getActuador(location: any, categoria: any, numero: any) {
        return new Promise((resolve, reject) => {

            let query = { location: location, categoria: categoria, numero: numero };

            modelActuador.find(query).limit(1).exec((error: any, data: any) => {
                if (error) {
                    console.log("error");
                    reject(false);
                }
                if (!data) {
                    resolve(false);
                }
                if (data) {
                    resolve(data[0])
                }
            });
        });
    }

    static async getpuntoPost(req:Request,res:Response){

            let location =req.params.location;
            let categoria= req.params.categoria;
            let numero = req.params.numero;

            let query = { location: location, categoria: categoria, numero: numero };

            modelPunto.find(query).limit(1).sort({"_id":-1}).sort({"time":-1}).exec((error: any, data: any) => {
                if (error) {
                    console.log("error");
                    return res.status(500).json({
                        ok:false,
                        error
                    })
                }
                if (!data) {
                    return res.status(401).json({
                        ok:false,
                        message:"Error"
                    })
                }
                if (data) {
                    return res.status(201).json({
                        ok:true,
                        data
                    })
                }
            })

    }
}