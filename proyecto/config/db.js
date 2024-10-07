const express = require('express');
const router = express.Router();
const { Pool } = require('pg'); 
const bcrypt = require('bcrypt');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error al conectar a la base de datos', err.stack);
  }
  console.log('Conectado a la base de datos PostgreSQL');
  release(); // Libera el cliente después de la conexión
});


module.exports = pool;


