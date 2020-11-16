import { interval, timer } from 'rxjs';
import vertedero from '../models/vertedero';
import puntos from '../models/point';
import moment from 'moment';
import tanques from '../models/tanques';
import Server from '../classes/server';
import PuntoController from './punto';


export interface property{

    id:any,
    categoria:any,
    numero:any,
    Idcliente:any
}



export default class GraphicaController {

    static sendDatos(id: any, value: any, numero: any, Idcliente: any) {       
        const Observer:any = {
             next: (data:any) => {
                 const propiedad:property = {
                         id,
                         categoria:value,
                         numero,
                         Idcliente
                 }                 
                 GraphicaController.GetDatos(propiedad.id,propiedad.categoria,propiedad.numero,propiedad.Idcliente); 
             },
             error:(error:any)=>console.log(error),            
             complete:()=>console.log("complete")       
        }
        
        const timer$= timer(0);
        // const interval$=interval(30000);
        timer$.subscribe(Observer);
        // interval$.subscribe(Observer);       
    }

    static async GetDatos(id: any, value: any, numero: any, Idcliente: any) {


        const server = Server.Instance;

        let fecha1 = '2019-12-22';
        let fecha_busqueda=moment().format('YYYY MM DD h:mm:ss');
        // let Resta = moment(fecha1).subtract('2','hours').format();
        
        let query = { location: id, categoria: value, numero: numero};
       
        let data: any = await new Promise((resolve, reject) => {
            puntos.find(query).limit(30).exec((error: any, data: any) => {
                if (error) {
                    console.log(error);
                }
                if (data) {
                    resolve(data);
                }
            });
        });

        let lineChartData: Array<any> = [];
        let lineChartLabels: Array<any> = [];

        let name = value;
   
        data.forEach((e: any) => {         
          
            let x= new Date(e.time);
            let now = moment(x).format();
          
            
            let f = now.split("T");
            let f1= f[0].split("-");
            let f2= f[1].split("-");
            let f3=f2[0].split(":");

            let fecha ={
                a:f1[0],
                m:f1[1],
                d:f1[2],
                h:f3[0],
                mm:f3[1],
                ss:f3[2]
            }         
                    
            lineChartLabels.push(
                now
            )

            let point = { fecha, "y":e.value}
            lineChartData.push(
               point
            )
            
        });     

        let send = {
            lineChartData,
            lineChartLabels,
            name
        }

        server.io.in(Idcliente).emit(id, send);
    }

    static async sendTanque(id:any,numero:any,Idcliente:any){

        const server = Server.Instance;

        let query1 = {location: id,categoria:"nivel", numero: numero}; 
        let query2 = {location: id,categoria:"ph", numero: numero};  
        let query3 = {location: id,categoria:"cloro", numero: numero};   

        //nivel 
        let nivel = await this.getLabels(query1).then((data:any)=>{
            return data;
        }).catch((error:any)=>{
            return false;
        });

        let ph = await this.getLabels(query2).then((data:any)=>{
            return data;
        }).catch((error:any)=>{
            return false;
        });

        let cloro = await this.getLabels(query3).then((data:any)=>{
            return data;
        }).catch((error:any)=>{
            return false;
        });

        let send ={
            nivel,
            ph,
            cloro,
            numero
        }
        server.io.in(Idcliente).emit('sendtanque', send);
        
    }

    static async getLabels(query:any){

        return new Promise(async (resolve,reject)=>{            
           
            let data: any = await new Promise((resolve, reject) => {
                puntos.find(query).limit(60).exec((error: any, data: any) => {
                    if (error) {
                        console.log(error);
                    }
                    if (data) {
                        resolve(data);
                    }
                });
            });
            let lineChartData: Array<any> = [];
            let lineChartLabels: Array<any> = [];
    
            data.forEach((e: any) => {         
          
                let x= new Date(e.time);
                let now = moment(x).format();
              
                
                let f = now.split("T");
                let f1= f[0].split("-");
                let f2= f[1].split("-");
                let f3=f2[0].split(":");
    
                let fecha ={
                    a:f1[0],
                    m:f1[1],
                    d:f1[2],
                    h:f3[0],
                    mm:f3[1],
                    ss:f3[2]
                }         
                        
                lineChartLabels.push(
                    now
                )
    
                let point = { fecha, "y":e.value}
                lineChartData.push(
                   point
                )
                
            });     
    
            let send = {
                lineChartData,
                lineChartLabels
            }

            resolve(send); 


        });

    }

    static getVertedero() {
        return new Promise((resolve, reject) => {
            vertedero.find().limit(120).sort({ '_id': -1 })
                .exec((error: any, data: any) => {
                    if (error) {
                        reject(false);
                    }
                    if (!data) {
                        reject(false);
                    }
                    if (data) {
                        resolve(data);
                    }
                });
        });
    }
    static async getInteriores(id:any,numero:any,Idcliente:any) {

        const server = Server.Instance;

        let query1 = {location: id,categoria:"turbiedad", numero: numero}; 
        let query2 = {location: id,categoria:"nivel", numero: numero};  

        let nivel = await this.getLabels(query1).then((data:any)=>{
            return data;
        }).catch((error:any)=>{
            return false;
        });

        let turbiedad = await this.getLabels(query2).then((data:any)=>{
            return data;
        }).catch((error:any)=>{
            return false;
        });

        let entrada= await PuntoController.getActuador(id,"entrada",numero);
        let desague= await PuntoController.getActuador(id,"desague",numero);
        let efluente_der= await PuntoController.getActuador(id,"efluente.der",numero);
        let efluente_izq= await PuntoController.getActuador(id,"efluente.izq",numero);
        let lavadoder= await PuntoController.getActuador(id,"lavado.der",numero);
        let lavadoizq= await PuntoController.getActuador(id,"lavado.izq",numero);
        let soplader= await PuntoController.getActuador(id,"lavado.der",numero);
        let soplaizq= await PuntoController.getActuador(id,"lavado.izq",numero);

        let data ={

            nivel,
            turbiedad,
            entrada,
            desague,
            efluente_der,
            efluente_izq,
            lavadoder,
            lavadoizq,
            soplader,
            soplaizq
        }

        server.io.in(Idcliente).emit('interior', data);
      
    }












}