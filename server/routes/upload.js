const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');



app.use(fileUpload());


app.put('/upload/:tipo/:id', function(req,res){

    let tipo = req.params.tipo;
    let id = req.params.id;

    if(!req.files){
        return res.status(400)
        .json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }

    //validar tipo
    let tiposValido = ['productos', 'usuarios'];
    if(tiposValido.indexOf(tipo) < 0){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitido son ' + tiposValido.join(', ')
            }

        })
    }


    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length -1];
    
  

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg',]

    if(extensionesValidas.indexOf(extension) < 0){
        return res.status(400).json({
            ok: false,
            err:{
                message: ' Las extensiones permitidas son' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }

    //Cambiar el nombre del archivo
    let nombreArchivo = `${ id }-${ new Date().getTime() }.${ extension}`;


    

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {

        if(err)
            return res.status(500).json({
                ok: false,
                err
            });

         // Aqui, imagen cargada
        if(tipo === 'usuarios'){
            
            imagenUsuario(id, res, nombreArchivo);
        }else{

            imagenProducto(id, res, nombreArchivo);
        } 
       
    });
});

function imagenUsuario(id, res, nombreArchivo){

    Usuario.findById(id, (err, usuarioDB) => {

        if(err){
            borrarArchivo(nombreArchivo, 'usuario');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!usuarioDB){
            borrarArchivo(nombreArchivo, 'usuario');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usaurio no existe wee (lpm)'
                }
            });
        }

     
        borrarArchivo(usuarioDB.img, 'usuarios')

        usuarioDB.img = nombreArchivo;

        usuarioDB.save( (err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });

    });
}

function imagenProducto(id, res, nombreArchivo){

    Producto.findById(id, (err, productoDB) => {

        if(err){
            borrarArchivo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            borrarArchivo(nombreArchivo, 'productos');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe wee (lpm)'
                }
            });
        }

     
        borrarArchivo(productoDB.img, 'productos')

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {

            res.json({
                ok: true,
                usuario: productoGuardado,
                img: nombreArchivo
            });
        });

    });
}

function borrarArchivo(nombreImagen, tipo){

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${nombreImagen}`);

    if(fs.existsSync(pathImagen) ){
       fs.unlinkSync(pathImagen);
    }


}





module.exports = app;