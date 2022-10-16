const mail = require('../config/mail');

exports.contactGet = (req, res) => {
  res.render('contact');
};

// Handle Contact on POST.
exports.contactPost = (req, res) => {
  const {
    name, email, subject, message,
  } = req.body;
  const errors = [];
  if (!name) errors.push({ warnings: 'Invalid name' });
  if (!email) errors.push({ warnings: 'Invalid email' });
  if (!subject) errors.push({ warnings: 'Invalid subject' });
  if (!message) errors.push({ warnings: 'Invalid message' });

  if (errors.length > 0) {
    res.render('contact', { errors });
  } else {
    const mailName = 'Contact Page';
    const mailTo = 'lincolnteixeiragomes@gmail.com';
    const mailSubject = `Contact Page - ${subject}`;
    const mailMessage = `

      <p><b>Name:</b> ${name}</p>
      <p><b>E-mail:</b> ${email}</p>
      <p><b>Subject:</b> ${subject}</p>
      <p><b>Message:</b> ${message}</p>
    `;

    // implement your spam protection or checks.
    mail.sendMail(mailName, mailTo, mailSubject, mailMessage);
    req.flash('success_msg', 'Message send succefully!');
    res.redirect('/contact');
  }
};
