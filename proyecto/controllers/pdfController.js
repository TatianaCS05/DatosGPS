const PDFDocument = require('pdfkit');
const client = require('../config/db');

const generatePDF = async (req, res) => {
  const { activos, order } = req.body; // Recibimos la tabla y si se quiere ordenar alfabéticamente

  let query = `SELECT * FROM ${activos}`;
  if (order) {
    query += ` ORDER BY 1 ASC`; // Ordena por la primera columna (placa o lo que corresponda)
  }

  try {
    const result = await client.query(query);

    // Crea un nuevo documento PDF
    const doc = new PDFDocument();
    let filename = `${activos}.pdf`;
    filename = encodeURIComponent(filename);
    
    // Configura la respuesta HTTP para enviar el archivo PDF
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/pdf');

    doc.pipe(res); // Envia el PDF generado directamente a la respuesta

    // Agrega contenido al PDF
    doc.fontSize(20).text(`Reporte de la tabla ${activos}`, { align: 'center' });
    doc.moveDown();

    result.rows.forEach((row, index) => {
      doc.fontSize(12).text(`${index + 1}. ${JSON.stringify(row)}`);
    });

    doc.end(); // Finaliza la creación del PDF

  } catch (err) {
    console.error('Error al generar el PDF:', err);
    res.status(500).json({ error: 'Error al generar el PDF' });
  }
};

module.exports = {
  generatePDF,
};