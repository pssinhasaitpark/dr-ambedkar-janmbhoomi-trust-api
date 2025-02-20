const nodemailer = require("nodemailer");
const mailgunTransport = require("nodemailer-mailgun-transport");

exports.sendRegistrationEmail = async (email) => {
  try {
    // Set up Mailgun transport using API credentials
    const transporter = nodemailer.createTransport(
      mailgunTransport({
        auth: {
          api_key: process.env.MAILGUN_API_KEY, // Add your Mailgun API key here
          domain: process.env.MAILGUN_DOMAIN, // Add your Mailgun domain here
        },
      })
    );

    const mailOptions = {
      from: "casoji6215@jarars.com", // Your email address
      to: email,
      subject: "Registration Successful",
      text: `Hello\n\nYou have successfully registered with us. Welcome!`,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Error sending registration email:", err);
  }
};



exports.sendResetEmail = async (email, resetToken) => {
  try {
    const transporter = nodemailer.createTransport(
      mailgunTransport({
        auth: {
          api_key: process.env.MAILGUN_API_KEY,
          domain: process.env.MAILGUN_DOMAIN,
        },
      })
    );

    const resetLink = `${process.env.APP_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: "casoji6215@jarars.com",
      to: email,
      subject: "Password Reset Request",
      text: `Hello,\nWe received a request to reset your password. Please click the following link to reset your password:\n\n${resetLink}\n\nIf you did not request this change, you can ignore this email.`,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Error sending reset email:", err);
  }
};



exports.sendNewPostEmail = async (emails, postTitle) => {
  try {
    // Set up Mailgun transport using API credentials
    const transporter = nodemailer.createTransport(
      mailgunTransport({
        auth: {
          api_key: process.env.MAILGUN_API_KEY, // Add your Mailgun API key here
          domain: process.env.MAILGUN_DOMAIN, // Add your Mailgun domain here
        },
      })
    );
    console.log("API Key:", process.env.MAILGUN_API_KEY);
    console.log("Domain:", process.env.MAILGUN_DOMAIN);

    const mailOptions = {
      from: "casoji6215@jarars.com", // Your email address (from Mailgun domain)
      to: emails.join(", "), // Recipient emails
      subject: `New Post: ${postTitle}`, // Subject line
      text: `Hello,\n\nA new post has been published on our site:\n\n${postTitle}\n\nStay tuned for more updates!`, // Email body
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Error sending post email:", err);
  }
};




// Send Registration Email
// exports.sendRegistrationEmail = async (email) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       port: 465,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: "casoji6215@jarars.com",
//       to: email,
//       subject: "Registration Successful",
//       text: `Hello\n\nYou have successfully registered with us. Welcome!`,
//     };

//     await transporter.sendMail(mailOptions);
//   } catch (err) {
//     console.error("Error sending registration email:", err);
//   }
// };

// Send Password Reset Email


// exports.sendResetEmail = async (email, resetToken) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       port: 465,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const resetLink = `${process.env.APP_URL}/reset-password?token=${resetToken}`;

//     const mailOptions = {
//       from: "casoji6215@jarars.com",
//       to: email,
//       subject: "Password Reset Request",
//       text: `Hello,\n We received a request to reset your password. Please click the following link to reset your password:\n\n${resetLink}\n\nIf you did not request this change, you can ignore this email.`,
//     };

//     await transporter.sendMail(mailOptions);
//   } catch (err) {
//     console.error("Error sending reset email:", err);
//   }
// };


// exports.sendNewPostEmail = async (emails, postTitle) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       port: 465,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

    
//     const mailOptions = {
//       from: "casoji6215@jarars.com",
//       to: emails.join(", "), 
//       subject: `New Post: ${postTitle}`,
//       text: `Hello,\n\nA new post has been published on our site:\n\n${postTitle}\n\n\nStay tuned for more updates!`,
//     };

//     await transporter.sendMail(mailOptions);
//   } catch (err) {
//     console.error("Error sending post email:", err);
//   }
// };

