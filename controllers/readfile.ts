import path from 'path';
import fs from 'fs';
import {Request,Response } from "express";

export default class ReadFileController{

    static getFile(req:Request,res:Response){
        let tipo = req.params.tipo;
        let img = req.params.img;        

        var pathFile = path.resolve(__dirname,`../../uploads/${tipo}/${img}`);    

        if(fs.existsSync(pathFile)){
            res.sendFile(pathFile);
        }else{
            var pathFile = path.resolve(__dirname,'../../assets/noimage.jpg');
            res.sendFile(pathFile);
        }

    }


}