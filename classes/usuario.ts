
export class Usuario{

    public id: string;
    public nombre:string;
    public email:string;
    public apellido:string;
    public sala:string;
    public token:string;

    constructor(id:string){
        this.id= id;
        this.nombre='Sin-nombre';
        this.email="";
        this.apellido="";
        this.sala='Sin-sala';
        this.token="";
        
    }





}