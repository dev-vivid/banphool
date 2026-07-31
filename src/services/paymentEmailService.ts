import { sendEmail } from "./emailService";

export const sendPaymentSuccessEmails = async (payment: any) => {
  // Donor Email
  if (payment.donorEmail) {
    await sendEmail({
      to: payment.donorEmail,
      subject: "Thank You for Your Donation",
      html: `
        <h2>Thank You ${payment.donorName}</h2>

        <p>Your donation has been received successfully.</p>

        <table border="1" cellpadding="8" cellspacing="0">
          <tr>
            <td><b>Transaction No</b></td>
            <td>${payment.transactionNo}</td>
          </tr>

          <tr>
            <td><b>Amount</b></td>
            <td>₹${Number(payment.amount).toFixed(2)}</td>
          </tr>

          <tr>
            <td><b>Status</b></td>
            <td>SUCCESS</td>
          </tr>
        </table>

        <br>

        <p>Thank you for supporting Banphool Foundation.</p>
      `,
    });
  };

  // Admin Email
  await sendEmail({
    to: process.env.ADMIN_EMAIL!,
    subject: "New Donation Received",
    html: `
      <h2>New Donation Received</h2>

      <table border="1" cellpadding="8" cellspacing="0">

        <tr>
          <td><b>Donor</b></td>
          <td>${payment.donorName}</td>
        </tr>

        <tr>
          <td><b>Email</b></td>
          <td>${payment.donorEmail ?? "-"}</td>
        </tr>

        <tr>
          <td><b>Phone</b></td>
          <td>${payment.donorPhone ?? "-"}</td>
        </tr>

        <tr>
          <td><b>Amount</b></td>
          <td>₹${Number(payment.amount).toFixed(2)}</td>
        </tr>

        <tr>
          <td><b>Transaction No</b></td>
          <td>${payment.transactionNo}</td>
        </tr>

      </table>
    `,
  });
};