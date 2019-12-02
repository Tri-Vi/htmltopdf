const fs = require('fs');
const puppeteer = require('puppeteer');
const Handlebars = require('handlebars');
var UserController = require('./controllers/userController.js');
try {
  (async() => {

    // Rendering Handlebars template
    var source = fs.readFileSync(__dirname + '/views/index.html','utf8');
    var template = Handlebars.compile(source);

    // Get User Data From User Controller;
    var returnedUser = UserController.getUserById(1);
    

    var result = template(returnedUser);
    
    // // Generating pdf using puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(result, {
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