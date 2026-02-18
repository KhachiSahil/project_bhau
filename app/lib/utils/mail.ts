import nodemailer from 'nodemailer';

export async function sendCompletionEmail(to: string, enquiry: any) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to : "sahilkhachi95.1@gmail.com",
    subject: 'Your Trip is Completed 🎉',
    html: `
      <h2>Hello,</h2>
      <p>Your enquiry with ID <strong>${enquiry.id}</strong> has been marked as <b>Completed</b>.</p>
      <p>We hope you had a great trip!</p>
      <br/>
      <p>Regards,<br/>Travel CRM Team</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}
