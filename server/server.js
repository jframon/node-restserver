require('./config/config');

const mongoose = require('mongoose');
const express = require('express');
const path = require('path');

const app = express();

//Habilitar carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

//Configuracion Global de Rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.urlDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err;

    console.log('Base de datos Online');
});
app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto ${process.env.PORT}`);
});