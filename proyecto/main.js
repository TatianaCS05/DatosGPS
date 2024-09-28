const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes'); 
const activosRoutes = require('./routes/activosRoutes'); 

app.use(express.json());  

app.use('/auth', authRoutes);

app.use('/activos', activosRoutes);

app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});