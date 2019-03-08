const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.ClientId);

const app = express();
const Usuario = require('../models/usuario');

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorectos.'
                }
            })
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario o (contraseña) incorectos."
                }
            })
        }
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.Seed, { expiresIn: process.env.Caducidad_Token });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    })

});

//Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.ClientId,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre:payload.name,
        email: payload.email,
        img:payload.picture,
        google:true
    }
}

app.post('/google', async (req,res) => {
let token = req.body.idtoken;

    let googleUser = await verify(token) .catch(err => {
       return res.status(403).json({
           ok:false,
           err
       })
    });

    Usuario.findOne({email:googleUser.email}, (err,usuarioDb) => {
        if (err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(usuarioDb){
            if(usuarioDb.google === false){
                return res.status(400).json({
                    ok:false,
                    err:{
                        message:"Debe de usar su autentucacion normal."
                    }
                })
            }
            else{
                let token = jwt.sign({
                    usuario:usuarioDb
                },process.env.Seed, {expiresIn: process.env.Caducidad_Token});

                return res.json({
                    ok:true,
                    usuario:usuarioDb,
                    token
                });
            }

        } else {
            //Si el usuario no existe en la base de datos.

            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err,usuarioDb) => {
              if(err){
                  return res.status(500).json({
                      ok:false,
                      err
                  });
              }

                let token = jwt.sign({
                    usuario:usuarioDb
                },process.env.Seed, {expiresIn: process.env.Caducidad_Token});

                return res.json({
                    ok:true,
                    usuario:usuarioDb,
                    token
                });
            })
        }
    })
});

module.exports = app;