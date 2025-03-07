const nodemailer = require("nodemailer");


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

exports.sendResetEmail = async (email, resetToken) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `${process.env.APP_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      text: `Hello,\n We received a request to reset your password. Please click the following link to reset your password:\n\n${resetLink}\n\nIf you did not request this change, you can ignore this email.`,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Error sending reset email:", err);
  }
};



