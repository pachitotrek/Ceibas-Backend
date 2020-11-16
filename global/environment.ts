
export const SERVER_PORT:number = 3100;
// export const DBURL:string = 'mongodb://localhost:27017/ceibas';
export const DBURL:string = 'mongodb://ceibasAdmin:0laXWXRdq0t2V3Nap9ZV@178.128.235.187:27017/ceibas';
export const CADUCIDAD_TOKEN:number=Number(process.env.CADUCIDAD_TOKEN) ||60*60*24*30;
export const SEED:string='este-es-el-seed-desarrollo';
export const CLIENT_ID:string='416899597802-5nf0egipotbr8argtcqok3mpdk2ref2d.apps.googleusercontent.com'; 


//========================
//entorno
//========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; 


