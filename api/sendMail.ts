import { createTransport } from 'nodemailer';
import sanitizeHtml from 'sanitize-html';
require('dotenv').config();
function getTransporter() {
    return createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_ADRESS,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
  }
 async function sendMail(options) {
    try {
      const transport = getTransporter();
      await transport.sendMail(options);
      return { success: true };
    } catch (error) {
      throw new Error(error?.message);
    }
  }
const from = 'Tanya G - ${process.env.EMAIL_ADRESS}'
  async function formSubmit(formData) {
    return sendMail({
      from,
      to: process.env.EMAIL_TO_USER,
      subject: 'New form submision',
      html: sanitizeHtml("hello my dear world!!!"),
    });
  }
module.export = async (req,res)=> {
    const result = await formSubmit(req.body);
    res.json({result})
  };
