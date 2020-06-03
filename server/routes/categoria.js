const express = require('express');

let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');


//=============================
// Mostrasr todas las categorias 
//=============================

app.get('/categoria', verificaToken, (req, res)=>{


    Categoria.find({})
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, categorias)=>{
        
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categorias
        });

    });

});

//=============================
// Mostrasr todas las categorias por ID 
//=============================

app.get('/categoria/:id', verificaToken, (req, res)=>{

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) =>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
        
    })

   

});


//=============================
// Crear nueva  categorias 
//=============================

app.post('/categoria', verificaToken, (req, res)=>{

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body. descripcion,
        usuario: req.usuario._id
    });

    categoria.save( (err, categoriaDB) =>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

        
    });

});

//=============================
// Actualizar las categorias 
//=============================

app.put('/categoria/:id', verificaToken, (req, res)=>{

    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate( id, descCategoria, { new: true, runValidators: true}, (err, categoriaDB) =>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

//=============================
// Borra las categorias 
//=============================

app.delete('/categoria/:id', [verificaToken, verificaAdminRole ], (req, res) => {

    let id = req.params.id;

    Categoria.findOneAndRemove(id, (err, categoriaDB) => {


      if(err){
          return res.status(500).json({
             ok: false,
              err
          });
      }

      if(!categoriaDB){
          return res.status(400).json({
              ok: false,
              err: {
                  message: 'El id no existe'
              }
          });
      }

      res.json({
          ok: true,
          message: 'Categoria borrada'
      });

    });

});


module.exports = app;

