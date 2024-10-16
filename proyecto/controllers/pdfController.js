const PDFDocument = require('pdfkit');
const fs = require('fs');
const client = require('../config/db'); // Conexión a la base de datos

// Función para generar el PDF
const generatePdf = async (req, res) => {
    try {
        // Consulta de la tabla 'activos' organizada por id 
        const query = 'SELECT * FROM activos ORDER BY id_servicio';
        const { rows: activos } = await client.query(query);
        
        // Creación del PDF
        const doc = new PDFDocument();
        const fileName = `reporte_activos_${Date.now()}.pdf`;
        const filePath = `./reports/${fileName}`;

        // Definir el archivo de salida
        doc.pipe(fs.createWriteStream(filePath));

        // Añadir título
        doc.fontSize(18).text('Reporte de Activos', { align: 'center' });
        doc.fontSize(12).text(`Empresa: Data Center`, { align: 'center' });
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, { align: 'center' });
        doc.text(`Hora: ${new Date().toLocaleTimeString()}`, { align: 'center' });
        doc.moveDown(2);

        // Dibujar tabla
        doc.fontSize(12).text('ID', 100, 150);
        doc.text('Nombre del Cliente', 150, 150);
        doc.text('Descripción del Servicio', 300, 150);
        // Quitar la columna de Fecha Inicio
        // doc.text('Fecha Inicio', 450, 150); // Esta línea se ha eliminado

        // Separador
        doc.moveTo(100, 165).lineTo(500, 165).stroke();

        let y = 180; // Posición vertical inicial
        activos.forEach((activo) => {
            doc.text(activo.id_servicio, 100, y);
            doc.text(activo.nombre_cliente, 150, y);
            doc.text(activo.descripcion_servicio, 300, y);
            // También se ha eliminado el acceso a fecha_inicio
            // doc.text(activo.fecha_inicio.toISOString().split('T')[0], 450, y); // Esta línea se ha eliminado
            y += 20;

            // Reiniciar la posición en caso de sobrepasar el límite
            if (y > 700) {
                doc.addPage(); // Añadir nueva página si la lista es muy larga
                y = 50; // Reiniciar la posición vertical
            }
        });

        // Finalizar el PDF
        doc.end();

        // Enviar el PDF al cliente
        res.download(filePath, fileName, (err) => {
            if (err) {
                console.error('Error al descargar el archivo:', err);
                res.status(500).send('Error generando el PDF');
            }
        });

    } catch (error) {
        console.error('Error generando el reporte de activos:', error);
        res.status(500).send('Error generando el reporte');
    }
};

module.exports = { generatePdf };
