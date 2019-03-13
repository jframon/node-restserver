const express = require('express');
const _ = require('underscore');
const {verificaToken} = require('../middleware/autenticacion');
let app = express();

let Producto = require('../models/productos');

//Obetener todos los productos.
app.get('/productos', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({disponible: true})
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .sort('nombre')
        .limit(limite)
        .skip(desde)
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: err
                });
            }

            Producto.countDocuments({disponible: true}, (err, conteo) => {
                res.json({
                    ok: true,
                    total: conteo,
                    productos
                });
            })
        })

});

//Obtener un producto
app.get('/productos/:id', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    let id = req.params.id;

    Producto.find({_id: id})
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .limit(limite)
        .skip(desde)
        .exec((err, productodb) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: err
                });
            }

            res.json({
                ok: true,
                productodb
            })
        })

});


//Buscar Productos
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre:regex })
        .populate('categoria', 'descripcion')
        .exec((err,productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: err
                });
            }

            Producto.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    total: conteo,
                    productos
                });
            })
        })

});


//Crear un nuevo Producto
app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDb) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: err
                });
            }

            if (!productoDb) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                Producto: productoDb
            })

        }
    )
});

//Actualizar Producto
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion', 'precioUni', 'categoria', 'disponible', 'nombre']);

    Producto.findByIdAndUpdate(id, body, {new: true, runValidators: true},
        (err, productoDb) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: err
                });
            }

            res.json({
                ok: true,
                producto: productoDb
            });
        })
});

//Borrar Producto
app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findByIdAndUpdate(id, {disponible: false}, {new: true},
        (err, productoBorrado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: err
                });
            }

            if (productoBorrado === null) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Categoria no encontrada.'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado
            })

        })
});

module.exports = app;