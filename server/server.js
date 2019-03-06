require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

//Configuracion Global de Rutas
app.use(require('./routes/index'))

mongoose.connect(process.env.urlDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err;

    console.log('Base de datos Online');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto ${process.env.PORT}`);
});