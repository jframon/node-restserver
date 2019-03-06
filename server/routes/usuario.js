const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();
const bodyParser = require('body-parser');
const Usuario = require('../models/usuario');
const { verificaToken, verificaRole } = require('../middleware/autenticacion')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/usuario', [verificaToken], function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img').limit(limite).skip(desde).exec((err, usuarios) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }

        Usuario.countDocuments({ estado: true }, (err, conteo) => {
            res.json({
                ok: true,
                total: conteo,
                usuarios
            });
        })
    })
});

app.post('/usuario', [verificaToken, verificaRole], function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuariodb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }


        res.json({
            ok: true,
            usuario: usuariodb
        })

    });
});

app.put('/usuario/:id', [verificaToken, verificaRole], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'img', 'email', 'role', 'estado']);



    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true },
        (err, usuariodb) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: err
                });
            }

            res.json({
                ok: true,
                usuario: usuariodb
            });
        })
});

app.delete('/usuario/:id', verificaToken, function(req, res) {
    let id = req.params.id;


    // Borra Fisicamente de la Base de datos.
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true },
        (err, usuarioBorrado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: err
                });
            }

            if (usuarioBorrado === null) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Usuario no encontrado'
                    }
                });
            }

            res.json({
                ok: true,
                usuario: usuarioBorrado
            })

        })
});

module.exports = app;