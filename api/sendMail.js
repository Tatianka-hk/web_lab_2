import { createTransport } from 'nodemailer';
import sanitizeHtml from 'sanitize-html';
import { MyError } from '../src/Errors';

require('dotenv').config();
const history = new Map();

const transporter = createTransport({
  host: process.env.HOST,
  port: process.env.POST,
  secure: false,
  auth: {
    user: process.env.EMAIL_ADRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendMail(options) {
  try {
    await transport.sendMail(options);//&
    return { success: true };
  } catch (error) {
    throw MyError.MailError();
  }
}
const from = 'Tanya G - ${process.env.EMAIL_ADRESS}'
async function formSubmit(formData) {
  let html = '';
  for (const option in formData) {
    html += option + ' : ' + formData[option] + '<br/>';
  }
  return sendMail({
    from,
    to: process.env.EMAIL_TO_USER,
    subject: 'New form submision',
    html: sanitizeHtml(html),
  });
}


const rateLimit = (ip, limit) => {
  const count = history.get(ip) || 0;
  if (count >= limit) {
    throw MyError.RateLimitError();
  }
  history.set(ip, count + 1);
};

const emailCheckRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const nameCheckRegex = /^[a-zA-ZА-ЯЁа-яё]{2,}\s?[a-zA-ZА-ЯЁа-яё]*$/;

function validate({ email, name }) {
  if (!emailCheckRegex.test(String(email).toLowerCase())) {
    throw MyError.ValidationError(`${email} is not valid`);
  }

  if (!nameCheckRegex.test(String(name))) {
    throw MyError.ValidationError(`${name} is not valid`);
  }
}

module.exports = async (req, res) => {
  console.log(req.body);
  try {
    rateLimit(req.headers['x-real-ip'], 1);
    validate(req.body);
    const result = await formSubmit(req.body);
    return res.json({ result });
  } catch (e) {
    return res.status(e.status).json({
      status: e.status,
      errors: [e.message],
      result: {
        success: false,
      },
    });
  }
};

