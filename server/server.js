require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(require('./routes/usuario'))

mongoose.connect(process.env.urlDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err;

    console.log('Base de datos Online');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando el puerto ${process.env.PORT}`);
});