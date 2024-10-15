const express = require('express');
const router = express.Router();
const { Pool } = require('pg'); 
const bcrypt = require('bcrypt');
require('dotenv').config();

const { Client } = require('pg');

// Configuración del cliente de PostgreSQL
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect()
  .then(() => console.log('Conectado a la base de datos'))
  .catch((err) => console.error('Error al conectar a la base de datos', err));


  module.exports = client;