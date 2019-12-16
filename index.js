const fs = require('fs');
var ReportController = require('./controllers/reportController.js');
var PDF = require('./public/js/pdf.js');

var returnedReports = ReportController.getAllReport();

PDF.generatePDF(returnedReports);
