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
var positivePgxIcon = "./public/img/report_icons/positive_pgx_icon.png";
var negativePgxIcon = "./public/img/report_icons/negative_pgx_icon.png";
var blankSignature = "./public/img/blankSignature.png";

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
var base64_positivePgxIcon = base64Img.base64Sync(positivePgxIcon);
var base64_negativePgxIcon = base64Img.base64Sync(negativePgxIcon);
var base64_blankSignature = base64Img.base64Sync(blankSignature);

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
        mrn: 'MRN_1234',
        sex: 'Male'
      },
      physician: {
        name: 'ABC',
        address1: 'address1',
        address2: 'address2',
        city: 'city',
        state: 'state',
        zipcode: 'zipcode',
        phone:'111-222-3333'
      },
      specimen: {
        external_id: 'external_id',
        accession_id:'accession_id',
        type: 'Blood',
        specimenCollectionDate: new Date()
      }
    };
    selectedReport.state = "Approved";
    selectedReport.stateChanged = new Date();

    var reportableVariants =  _reportableVariant(selectedReport.variants);

    // QR Code
    // var qr_string = "selectedReport.reportIdentifier";
    var qr_string = "1234";
    var qr_code = qr.imageSync(qr_string, {type: 'png'});

    // Image Data URI
   var dataBuffer = new Buffer.from(qr_code);
   var mediaType = 'PNG';
   var base64_qr_code = imageDataURI.encode(dataBuffer, mediaType);

   var isPhiChecked = true

   //Footer Template
   var footerTemplate = "";
   var footerData = {
     name: "HGSC Clinical Laboratory",
     address: "One Baylor Plaza",
     city: "Houston",
     state: "TX",
     zipCode: 77030,
     phone: "713.798.6539",
     fax: "713.798.5741",
     website: "www.hgsc.bcm.edu",
     email: " cvdgenomics@hgsc.bcm.edu",
     copyright: `Copyright © 2018 HGSC Clinical Laboratory. All rights reserved. ` + selectedReport.footer
   };

   //Header Template
   var headerTemplate = "";
   var headerData = {
     cvd_logo: base64_cvd_logo,
     bcm_logo: base64_bcm_logo,
     hgsc_logo: base64_hgsc_logo,
     qr_code: base64_qr_code,
     patientName: selectedReport.order.patient.patientFirstName + ' ' + selectedReport.order.patient.patientMiddleName + ' ' + selectedReport.order.patient.patientLastName,
     isPhiChecked: isPhiChecked == 'true' || isPhiChecked == true ? true : false
   };

   // EJS - Render Header
   await ejs.renderFile(reportHeader, {headerData: headerData}, function(err, str){
    if(err){
      db.winston.error("ReportController.findAll", {'user' : user, 'params' : params, 'error': err});
    } else {
      headerTemplate = str;
    }
  })

  // EJS - Render Footer
  await ejs.renderFile(reportFooter, {footerData: footerData}, function(err, str){
    if(err){
      db.winston.error("ReportController.findAll", {'user' : user, 'params' : params, 'error': err});
    } else {
      footerTemplate = str;
    }
  });
    
  // EJS - Render Report
    await ejs.renderFile(template, {
      user: returnedUser,
      report: selectedReport,
      isPhiChecked: isPhiChecked,
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
      negLpaIcon: base64_negLpaIcon,
      positivePgxIcon: base64_positivePgxIcon,
      negativePgxIcon: base64_negativePgxIcon,
      blankSignature: base64_blankSignature,
      reportableVariants: reportableVariants

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
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: headerTemplate,
      footerTemplate: footerTemplate,
      margin: {
        top: "130px",
        bottom: "180px"
      }
    });

    await browser.close();
    console.log('Finished');


  })();
} catch(err) {
  console.log(err);
}

function _reportableVariant(variants){
  if((variants === undefined) || (variants === null)){
    return [];
  }
  return variants.filter(variant => variant.reportable == true);
}