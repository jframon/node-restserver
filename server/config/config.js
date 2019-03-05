//Puerto
process.env.PORT = process.env.PORT || 8080;

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//DB
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.Mongo_Url;
}
process.env.urlDB = urlDB;