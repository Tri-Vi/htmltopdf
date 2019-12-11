const express = require('express');
const app = express();
const port = 3000;

const fs = require('fs');
const puppeteer = require('puppeteer');
const ejs = require('ejs');
var UserController = require('./controllers/userController.js');
var ReportController = require('./controllers/reportController.js');
var template = ('./views/index.ejs');
var html;

//base64 middleware
const base64Img = require('base64-img');
// QR Image middleware
const qr = require('qr-image');
// ImageData Decoder - Encoder middleware
const imageDataURI = require('image-data-uri');

var reportFooter = ('./views/reports/report_footer.ejs');
var reportHeader = ('./views/reports/report_header.ejs');

// Images
var cvd_logo = "./public/img/cvdlogo-outlined.png";
var bcm_logo = "./public/img/bcmlogo.jpg";
var hgsc_logo = "./public/img/hgsclogo.png";
var negativeGenePanelIcon = "./public/img/report_icons/negative_gene_panel_icon.png";
var positiveGenePanelIcon = "./public/img/report_icons/positive_gene_panel_icon.png";
var highPrsIcon = "./public/img/report_icons/high_prs_icon.png";
var moderatePrsIcon = "./public/img/report_icons/moderate_prs_icon.png";
var lowPrsIcon = "./public/img/report_icons/low_prs_icon.png";
var posLpaIcon = "./public/img/report_icons/pos_lpa_icon.png";
var negLpaIcon = "./public/img/report_icons/neg_lpa_icon.png";

// Base64 Images
var base64_cvd_logo = base64Img.base64Sync(cvd_logo);
var base64_bcm_logo = base64Img.base64Sync(bcm_logo);
var base64_hgsc_logo = base64Img.base64Sync(hgsc_logo);
var base64_negativeGenePanelIcon =  base64Img.base64Sync(negativeGenePanelIcon);
var base64_positiveGenePanelIcon =  base64Img.base64Sync(positiveGenePanelIcon);
var base64_highPrsIcon = base64Img.base64Sync(highPrsIcon);
var base64_moderatePrsIcon = base64Img.base64Sync(moderatePrsIcon);
var base64_lowPrsIcon = base64Img.base64Sync(lowPrsIcon);
var base64_posLpaIcon = base64Img.base64Sync(posLpaIcon);
var base64_negLpaIcon = base64Img.base64Sync(negLpaIcon);


try {
  (async() => {
    

    // Get User Data From User Controller;
    var returnedUser = UserController.getUserById(1);

    // Get Report Data From Report Controller;
    var returnedReports = ReportController.getAllReport();
    var selectedReport = returnedReports[0];
    selectedReport.order = {
      indications: "A, B, C",
      patient: {
        patientFirstName: "First",
        patientMiddleName: "Middle",
        patientLastName: "Last",
        patientDOB: new Date(),
        mrn: 'MRN_1234'
      },
      physician: {
        name: 'ABC'
      }
    };
    selectedReport.state = "Approved";
    selectedReport.stateChanged = new Date();

    // QR Code
    // var qr_string = "selectedReport.reportIdentifier";
    var qr_string = "1234";
    var qr_code = qr.imageSync(qr_string, {type: 'png'});

    // Image Data URI
   var dataBuffer = new Buffer.from(qr_code);
   var mediaType = 'PNG';
   var base64_qr_code = imageDataURI.encode(dataBuffer, mediaType);
    
    await ejs.renderFile(template, {
      user: returnedUser,
      report: selectedReport,
      isPhiChecked: true,
      cvd_logo: base64_cvd_logo,
      bcm_logo: base64_bcm_logo,
      hgsc_logo: base64_hgsc_logo,
      qr_code: base64_qr_code,
      negativeGenePanelIcon: base64_negativeGenePanelIcon,
      positiveGenePanelIcon: base64_positiveGenePanelIcon,
      highPrsIcon: base64_highPrsIcon,
      moderatePrsIcon: base64_moderatePrsIcon,
      lowPrsIcon: base64_lowPrsIcon,
      posLpaIcon: base64_posLpaIcon,
      negLpaIcon: base64_negLpaIcon
    }, function(err,str){
      if(err){
        console.log(err);
      } else {
        html = str;
      }
    });
    
    // Generating pdf using puppeteer
    const browser = await puppeteer.launch({ignoreHTTPSErrors: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.setContent(html, {
      waitUntil: 'networkidle0'
    });
    await page.pdf({
      path: 'example.pdf',
      format: 'Letter',
      scale: .75,
      printBackground: true
    });

    await browser.close();
    console.log('Finished');


  })();
} catch(err) {
  console.log(err);
}