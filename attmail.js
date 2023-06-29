const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: 'jainsaab0002@gmail.com',
    pass: 'ltvvgwnyrrwlqlph'
  }
});

app.get('/home', async (req,res,next)=>{
  // console.log("middle");
var html = fs.readFileSync('./invoice.html','utf-8')
let result = {
  id: 12,
  name: 'Test Demo'
}
let options = {
  format: 'Letter'
}
pdf.create(html, options).toFile('./invoice.pdf',function(err,res) {
  if (err) return console.log(err.message);
  return console.log(res);
})
res.status(200).json(result)
})

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" <jainsaab0002@gmail.com>', // sender address
    to: "ksarathe9@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
    attachments:[{
        filename: 'jhe_hai_image.jpg',
        path: './uploads/222.jpg'
    }
    ]
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}


main().catch(console.error);
