//Puerto
process.env.PORT = process.env.PORT || 8080;

//Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//DB


let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://jframon:EuIFKloj3v9KDOou@cluster0-szs1p.mongodb.net/cafe?retryWrites=true';
}

process.env.urlDB = urlDB;