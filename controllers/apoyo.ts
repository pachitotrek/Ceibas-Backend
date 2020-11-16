import PuntoController from "./punto";
import Server from "../classes/server";


export default class ApoyoController{

    static async getDatos(query:any,id:any){

        const server = Server.Instance;

        let location = "tanque-exterior";

        let actuador = await PuntoController.getActuador(location,"actuador","0");
        let bomba = await PuntoController.getPunto(location,"bomba-out","1");
        let bomba_dos = await PuntoController.getPunto(location,"bomba-out","2");
        let reset = await PuntoController.getPunto(location,"reset","0");
        let set = await PuntoController.getPunto(location,"set","0");
        let nivel = await PuntoController.getPunto(location,"nivel","0");
        let location2="aire";
        let aire_actuador = await PuntoController.getActuador(location2,"actuador","0");
        let aire_control_uno = await PuntoController.getPunto(location2,"control","1");
        let aire_control_dos = await PuntoController.getPunto(location2,"control","2");
        let aire_control_tres = await PuntoController.getPunto(location2,"control","3");
  
        let data={

            actuador,
            bomba,
            bomba_dos,
            reset,
            set,
            nivel,
            aire_actuador,
            aire_control_uno,
            aire_control_dos,
            aire_control_tres
        }

        server.io.in(id).emit('apoyo-datos', data);



    }



}