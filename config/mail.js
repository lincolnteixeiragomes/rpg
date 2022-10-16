const axios = require('axios');

async function sendMail(name, email, subject, message) {
  const data = JSON.stringify({
    Messages: [{
      From: { Email: 'rpgtheproject@gmail.com', Name: 'The RPG Project' },
      To: [{ Email: email, Name: name }],
      Subject: subject,
      HTMLPart: message,
    }],
  });

  const config = {
    method: 'post',
    url: 'https://api.mailjet.com/v3.1/send',
    data,
    headers: { 'Content-Type': 'application/json' },
    auth: { username: process.env.MJ_MAIL_APIKEY, password: process.env.MJ_MAIL_SECRETKEY },
    timeout: 5000,
  };

  return axios(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports.sendMail = sendMail;
