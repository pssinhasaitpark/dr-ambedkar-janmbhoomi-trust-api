const nodemailer = require("nodemailer");


//send email to the subscribed users
exports.sendNewPostEmail = async (emails, postTitle) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    
    const mailOptions = {
      from: "casoji6215@jarars.com",
      to: emails.join(", "), 
      subject: `New Post: ${postTitle}`,
      text: `Hello,\n\nA new post has been published on our site:\n\n${postTitle}\n\n\nStay tuned for more updates!`,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Error sending post email:", err);
  }
};



