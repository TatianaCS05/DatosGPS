const PDFDocument = require('pdfkit');
const fs = require('fs');
const client = require('../config/db'); 

const generatePdf = async (req, res) => {
    try {
        // Consulta de la tabla 'activos' organizada por id 
        const query = 'SELECT nombre_cliente, placa FROM activos ORDER BY id_servicio';
        const { rows: activos } = await client.query(query);
        
        // Creación del PDF
        const doc = new PDFDocument();
        const fileName = `reporte_activos_${Date.now()}.pdf`;

        // Configurar el archivo para ser enviado como respuesta
        res.setHeader('Content-Type', 'application/pdf');
        doc.pipe(res);

        // Añadir título
        doc.fontSize(18).text('Reporte de Activos', { align: 'center' });
        doc.fontSize(12).text('Empresa: Data Center', { align: 'center' });
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, { align: 'center' });
        doc.text(`Hora: ${new Date().toLocaleTimeString()}`, { align: 'center' });
        doc.moveDown(2);

        // Dibujar encabezado de tabla
        doc.fontSize(12).text('Nombre del Cliente', 100, 150);
        doc.text('Placa del Vehículo', 300, 150);
        doc.moveTo(100, 165).lineTo(500, 165).stroke(); // Separador
        let y = 180; // Posición vertical inicial

        const maxRows = 100; // Número máximo de filas que caben en una página
        let count = 0; // Contador de filas para limitar a una página

        // Lógica para mostrar los primeros activos dentro del límite de una página
        activos.forEach((activo) => {
            if (count < maxRows) {
                doc.text(activo.nombre_cliente, 100, y);
                doc.text(activo.placa, 300, y);
                y += 20; // Aumentar la posición vertical para cada fila
                count += 1;
            }
        });

        // Finalizar el PDF
        doc.end();

    } catch (error) {
        console.error('Error generando el reporte de activos:', error);
        res.status(500).send('Error generando el reporte');
    }
};

module.exports = { generatePdf };
