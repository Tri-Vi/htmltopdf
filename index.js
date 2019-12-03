const fs = require('fs');
const puppeteer = require('puppeteer');
const ejs = require('ejs');
var UserController = require('./controllers/userController.js');
var template = ('./views/index.ejs');
var html;



try {
  (async() => {
    

    // Get User Data From User Controller;
    var returnedUser = UserController.getUserById(1);

    await ejs.renderFile(template, {user: returnedUser}, function(err,str){
      if(err){
        console.log(err);
      } else {
        html = str;
      }
    });
    
    // Generating pdf using puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, {
      waitUntil: 'networkidle0'
    });
    await page.pdf({
      path: 'example.pdf',
      format: 'A4'
    });

    await browser.close();
    console.log('Finished');


  })();
} catch(err) {
  console.log(err);
}