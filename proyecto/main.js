const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes'); 
const activosRoutes = require('./routes/activosRoutes');
const suspendidosRoutes = require('./routes/suspendidosRoutes');
const pagosRoutes = require ('./routes/pagosRoutes');
const instalacionesRoutes = require ('./routes/instalacionesRoutes');
const vehiculosRoutes = require ('./routes/vehiculosRoutes');
const revisionRoutes = require ('./routes/revisionRoutes')
const gpsRoutes = require ('./routes/gpsRoutes');
const usuariosRoutes = require ('./routes/usuariosRoutes')

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/activos', activosRoutes);
app.use('/suspendidos', suspendidosRoutes); 
app.use('/pagos', pagosRoutes);
app.use('/instalaciones', instalacionesRoutes);
app.use('/vehiculos',vehiculosRoutes);
app.use('/revision', revisionRoutes);
app.use('/gps', gpsRoutes);
app.use('/personal', usuariosRoutes) 

app.use(express.static(path.join(__dirname, 'public')));

app.get('/activosView/activos.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/activosView/activos.html'));
});

app.use((err, req, res, next) => {
    console.error('Error en la aplicación:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});
