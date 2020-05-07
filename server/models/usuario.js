
const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};

let Schema = mongoose.Schema;


let usarioSchema = new Schema({
    nombre:{
        type: String,
        require: [true, 'El nombre es necesaario']
    },
    email:{
        type: String,
        unique: true,
        require: [true, 'El correo es necesaario']
    },
    password:{
        type: String,
        require: [true, 'El password es necesaario']
    },
    img:{
        type: String,
        require: false
    },
    role:{  
        type: String,      
        default: 'USER_ROLE',
        enum: rolesValidos
        
    },
    estado:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    }    
});


usarioSchema.methods.toJSON = function(){

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}


usarioSchema.plugin( uniqueValidator, { message: '{PATH} debe ser unico'});

module.exports = mongoose.model( 'Usuario' , usarioSchema)



