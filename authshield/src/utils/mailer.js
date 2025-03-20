const nodemailer = require("nodemailer");

const sendMagicLink = async (userEmail, magicLink, smtpConfig) => {
  const transporter = nodemailer.createTransport({
    host: smtpConfig.host || "smtp.gmail.com",
    port: smtpConfig.port || 587,
    secure: smtpConfig.secure || false,
    auth: smtpConfig.auth,
  });

  const mailOptions = {
    from: smtpConfig.auth.user,
    to: userEmail,
    subject: "Your Magic Link",
    html: `<p>Click <a href="${magicLink}">here</a> to log in</p>`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendMagicLink };
