const nodeMailer = require('nodemailer');
///////////////////////

const sendEmail = async options => {
    //createTransport
    const transport = nodeMailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "dcd48070c170a5",
            pass: "cdc4c066e341fb"
        }
    });
    const mailOptions = {
        from: options.from,
        to: options.to,
        subject: options.subject,
        text: options.text
    };
    /////////

    await transport.sendMail(mailOptions);
};
module.exports = sendEmail;