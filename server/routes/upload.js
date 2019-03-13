const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/productos');

const fs = require('fs');
const path = require('path');

app.use(fileUpload({useTempFiles: true}));

app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    let tiposValidos = ['products', 'users'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos validos son ' + tiposValidos.join(', ')
            }
        })
    }

    if (!req.files)
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Se existen archivos para subir.'
            }
        });

    let archivos = req.files.archivo;
    let nombreArchivo = archivos.name.split('.');
    let extencion = nombreArchivo[nombreArchivo.length - 1];

    //Extenciones Permitidas
    let extencionesValidas = ['png', 'jpg', 'png', 'jpeg'];

    if (extencionesValidas.indexOf(extencion) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extenciones validas son ' + extencionesValidas.join(', '),
                ext: extencion
            }
        })
    }

    //Cambiar Nombre archivo
    let nombre = `${id}-${new Date().getMilliseconds()}.${extencion}`;

    archivos.mv(`uploads/${tipo}/${nombre}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        //Actualizo el usuario 0 el producto dependiendo del tipo
        tipo === 'users' ? imagenUsuario(id, res, nombre) : imagenProducto(id, res, nombre);
    });
});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuariodb) => {
        if (err) {
            borraArchivo('users', nombreArchivo);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuariodb) {
            borraArchivo('users', nombreArchivo);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borraArchivo('users', usuariodb.img);

        usuariodb.img = nombreArchivo;

        usuariodb.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: productoGuardado,
                img: nombreArchivo
            })
        })
    })
}
function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productodb) => {
        if (err) {
            borraArchivo('products', nombreArchivo);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productodb) {
            borraArchivo('products', nombreArchivo);
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        borraArchivo('products', productodb.img);

        productodb.img = nombreArchivo;

        productodb.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        })
    })
}

function borraArchivo(tipo, nombreArchivo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreArchivo}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;

