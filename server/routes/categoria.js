const express = require('express');
const _ = require('underscore');
const {verificaToken, verificaRole} = require('../middleware/autenticacion');

const bodyParser = require('body-parser');

let app = express();

let Categoria = require('../models/categorias');

//Mostrar todas las categorias
app.get('/categoria', [verificaToken], (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Categoria.find({}).populate('usuario','nombre email')
        .sort('descripcion').limit(limite).skip(desde).exec((err, categorias) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }

        Categoria.countDocuments({}, (err, conteo) => {
            res.json({
                ok: true,
                total: conteo,
                categorias
            });
        })
    })
});

//Mostrar una categoria por id
app.get('/categoria/:id', (req, res) => {
    let id = req.params.id;

    Categoria.find({_id: id}).exec((err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }

        res.json({
            ok: true,
            categoria
        })
    })
});

//Crear Nueva Categoria
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDb) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: err
                });
            }

            if(!categoriaDb){
                return res.status(400).json({
                    ok:false,
                    err
                });
            }

            res.json({
                ok: true,
                categoria: categoriaDb
            })

        }
    )

});

//actualizar Categoria
app.put('/categoria/:id', [verificaToken, verificaRole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(id, body, {new: true, runValidators: true},
        (err, categoriadb) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: err
                });
            }

            res.json({
                ok: true,
                categoria: categoriadb
            });
        })
});

//Borrar  Categoria
app.delete('/categoria/:id', [verificaToken, verificaRole], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndUpdate(id, {estado: false}, {new: true},
        (err, categoriaBorrada) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: err
                });
            }

            if (categoriaBorrada === null) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Categoria no encontrada.'
                    }
                });
            }

            res.json({
                ok: true,
                categoria: categoriaBorrada
            })

        })

});

module.exports = app;