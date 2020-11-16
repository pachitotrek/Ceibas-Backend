import fs from 'fs';
import path from 'path';
import {Request,Response } from "express";
import modelusuario from '../models/user';




export default class  uploadService{   
    
    
static uploadImage(req:Request,res:Response){
    
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha subido archivo'
            }
        });
    } 
    const _id=req.params.id;
    const key = req.params.tipo;   
    const archivo:any = req.files.archivo;
    const fileExt = archivo.mimetype;    
    const ext = archivo.mimetype.split('/')[1];
    const fileName = `${_id}${key}${new Date().getMilliseconds()}.${ext}`;  
    let extensionesvalidas = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif','video/mp4'];
    let keysValors = ['categoria', 'lugar','cupon','perfil','publicidad','seriesfile'];

    if (extensionesvalidas.indexOf(fileExt) > -1) {

        if (keysValors.includes(key, 0)) {
            archivo.mv(`uploads/${key}/${fileName}`, (err:any) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'error al mover el archivo'
                    });
                }
            });
        } else {
            return res.status(401).json({
                ok: false,
                message: 'Funcion aun no construida'
            });
        }
        
        if (key === "categoria") {  
            
        
                            
        }
        
        if(key === "lugar"){            

       
            
            
        }

        if(key === "cupon"){            
       
        }
        
        if(key === "publicidad"){            
        
        }
        if(key === "servidor"){            

        }
        if(key === "seriesfile"){            

         
        }

       

    } else {
        return res.status(500).json({
            
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesvalidas.join(', '),
                ext: ext
            }
        });
    }


    
}
static borraArchivo(fileName:any, key:any) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${key}/${fileName}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

}

  


}

