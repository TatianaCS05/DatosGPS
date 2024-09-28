const express = require('express');
const router = express.Router();
const { Pool } = require('pg'); 
const bcrypt = require('bcrypt');

const pool = new Pool({
  user: 'postgres',       
  host: 'localhost',       
  database: 'postgres',  
  password: '123', 
  port: 5432, 
  searchPath: ['public'],            
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error al conectar a la base de datos', err.stack);
  }
  console.log('Conectado a la base de datos PostgreSQL');
  release(); // Libera el cliente después de la conexión
});

module.exports = pool;


