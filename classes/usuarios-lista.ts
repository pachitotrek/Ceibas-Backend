import { Usuario } from "./usuario";


export class UsuariosLista{

    private lista:Usuario[]=[];

    constructor() {
    }

    //agregar un usuario

    public agregar( usuario:Usuario){

        this.lista.push(usuario);
        console.log(this.lista);

        return usuario;
    }

    public actualizarNombre( id:string,nombre:string,apellido:string,email:string,token:string){

        for (let usuario of this.lista ){
            if(usuario.id===id){
                usuario.email=email;
                usuario.apellido=apellido;
                usuario.nombre=nombre;
                usuario.token=token
                break;
            }
        } 

        console.log('===== Actualizando Usuario =====');
        console.log(this.lista);
    } 

    public getLista(){
        return this.lista;
    }

    public getUsuario (id:String){

        return this.lista.find( usuario=> usuario.id ===id);
    }

    public getUsuariosEnSala ( sala:string){

        return this.lista.filter( usuario => usuario.sala ===sala);
    }

    public borrarUsuario (id:string){

        const tempUsuario= this.getUsuario(id);

        this.lista= this.lista.filter( usuario =>{
            return usuario.id !== id;
        })

        return tempUsuario;
    }






}      