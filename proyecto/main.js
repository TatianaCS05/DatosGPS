const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes'); 
const activosRoutes = require('./routes/activosRoutes');
const suspendidosRoutes = require('./routes/suspendidosRoutes');
const pagosRoutes = require ('./routes/pagosRoutes'); // Asegúrate de que esto esté correcto

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/activos', activosRoutes);
app.use('/suspendidos', suspendidosRoutes); 
app.use('/pagos', pagosRoutes);
app.use(express.static(path.join(__dirname, 'public')));

app.use((err, req, res, next) => {
    console.error('Error en la aplicación:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});
