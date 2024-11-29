const nodemailer = require("nodemailer");

/*
Here we are using a service "MailTrap".

MailTrap allow us to capture emails without sending 
it into actual email-address.
*/

const sendEmail = async function (options) {
    // [1] Transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // [2] Define the Email Options
    const mailOptions = {
        from: "SafarSathi <operations@safarsathi.com>",
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    // [3] Send the Email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
