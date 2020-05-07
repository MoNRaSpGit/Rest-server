

process.env.PORT  = process.env.PORT  || 3000;


// Entorno de desarrollo
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Base de datos

let urlDB;

if ( process.env.NODE_ENV === 'dev'){
   urlDB = 'mongodb://localhost:27017/cafe';
}else{
urlDB = 'mongodb+srv://monra:GJ8RAFooTL9Rznv6@cluster0-b3gdy.mongodb.net/cafe';
}

process.env.URLDB = urlDB;