require("dotenv").config();
const nodemailer = require("nodemailer");
const logger = require("./logger");

const mailOptions = {
  confirmOrder: (name, order_id, amount) => {
    const subject = `Stylish - Confirm Order ${order_id}`;
    const html = `
    <h3>Dear ${name},</h3>
    <p>Thank you for your purchase.</p>
    <hr>
    <p>Order ID: ${order_id}</p>
    <p>Amount: ${amount}</p>
    <p>Payment Status: Paid</p>
    <p>Payment Method: Credit Card</p>
    <p>Shipping Status: Not Shipped</p>
    <p>Shipping Method: Home Delivery</p>
    <p>Shipping Address: </p>
    <hr>
    <p>Best Regards,</p>
    <p>Stylish Team</p>
    `;
    return [subject, html];
  },
};

async function sendMailWithOption(options) {
  console.log("sendMailWithOption");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SYSTEM_EMAIL,
      pass: process.env.SYSTEM_EMAIL_PWD,
    },
  });

  transporter.sendMail(options, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email Sent Successfully: " + info.response);

      // write info to log file
      logger.saveToLogFile(
        "Event: send email success\n" +
          "To: " +
          options.to +
          "\n" +
          info.response
      );
    }
  });
}

// set options and call send mail function
exports.sendConfirmOrderMail = async (name, order_id, amount, email) => {
  console.log("sendConfirmOrderMail");
  const [subject, html] = mailOptions.confirmOrder(name, order_id, amount);
  const options = {
    from: process.env.SYSTEM_EMAIL,
    to: email,
    subject: subject,
    html: html,
  };
  sendMailWithOption(options);
}
