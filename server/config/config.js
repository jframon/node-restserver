//Puerto
process.env.PORT = process.env.PORT || 8080;

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//Vencimiento Token 60 Seg * 60 Min * 24 Horas * 30 Dias
process.env.Caducidad_Token = 60 * 60 * 24 * 30;

//Seed Para los Tokens
process.env.Seed = process.env.Seed || 'este-es-el-seed-desarrollo';

//DB
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.Mongo_Url;
}
process.env.urlDB = urlDB;

//Google ClientId
process.env.ClientId = process.env.ClientId || "255719687166-a28os1og0v0luo48mi8lqqf42tan3a0s.apps.googleusercontent.com";