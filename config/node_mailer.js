const nodemailer = require("nodemailer");
const ejs = require('ejs')
const path = require('path')
 
let transporter = nodemailer.createTransport({
    service:'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'ramanpkgupta', // generated ethereal user
      pass: 'xxx', // generated ethereal password
    },
  });

let renderTemplate = (data,relativePath)=>{
    let mailHTML;
    ejs.renderFile(path.join(__dirname,'../views/mailers',relativePath),data,function(err,template){
        if(err){
            console.log(err);
            return 
        }
        mailHTML = template
    })
        return mailHTML
}
module.exports = {transporter:transporter,renderTemplate:renderTemplate

}