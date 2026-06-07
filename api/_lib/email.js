const nodemailer = require("nodemailer");

const buildMessageSummary = (entry) => {
  const lines = [
    `Source: ${entry.source}`,
    `Name: ${entry.name}`,
    `Email: ${entry.email}`,
    entry.phone ? `Phone: ${entry.phone}` : "",
    entry.company ? `Company: ${entry.company}` : "",
    `Subject: ${entry.subject || entry.projectType || "Message"}`,
    entry.projectType ? `Project Type: ${entry.projectType}` : "",
    entry.budget ? `Budget: ${entry.budget}` : "",
    entry.timeline ? `Timeline: ${entry.timeline}` : "",
    `Status: ${entry.status}`,
    `Created: ${entry.createdAt}`,
    "",
    "Message:",
    entry.message,
  ].filter(Boolean);

  return lines.join("\n");
};

const buildHtmlSummary = (entry) => {
  const fields = [
    ["Source", entry.source],
    ["Name", entry.name],
    ["Email", entry.email],
    ["Phone", entry.phone],
    ["Company", entry.company],
    ["Subject", entry.subject || entry.projectType || "Message"],
    ["Project Type", entry.projectType],
    ["Budget", entry.budget],
    ["Timeline", entry.timeline],
    ["Status", entry.status],
    ["Created", entry.createdAt],
  ].filter(([, value]) => value);

  return `
    <div style="font-family:Inter,Arial,sans-serif;color:#0f172a;line-height:1.6;">
      <h2 style="margin:0 0 16px;">New portfolio message</h2>
      <table style="border-collapse:collapse;width:100%;max-width:720px;">
        <tbody>
          ${fields
            .map(
              ([label, value]) => `
                <tr>
                  <td style="padding:8px 12px;border:1px solid #cbd5e1;font-weight:700;background:#f8fafc;">${label}</td>
                  <td style="padding:8px 12px;border:1px solid #cbd5e1;">${String(value)}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
      <div style="margin-top:18px;padding:16px;border:1px solid #cbd5e1;border-radius:16px;background:#f8fafc;">
        <p style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#475569;">Message</p>
        <p style="margin:0;white-space:pre-wrap;">${String(entry.message)}</p>
      </div>
    </div>
  `;
};

let transporterPromise = null;

const getTransporter = async () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_APP_PASSWORD;

  if (!emailUser || !emailPassword) {
    console.info("[email] Email credentials missing. Notifications skipped.");
    return null;
  }

  if (!transporterPromise) {
    transporterPromise = Promise.resolve(
      nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: emailUser,
          pass: emailPassword,
        },
      })
    );
  }

  return transporterPromise;
};

const sendPortfolioNotification = async (entry) => {
  const transporter = await getTransporter();

  if (!transporter) {
    return { sent: false, reason: "missing_credentials" };
  }

  const emailUser = process.env.EMAIL_USER;

  await transporter.sendMail({
    from: `"Portfolio Website" <${emailUser}>`,
    to: emailUser,
    replyTo: entry.email,
    subject: `[Portfolio] ${entry.source === "hire-me" ? "Hire request" : "Contact message"} from ${entry.name}`,
    text: buildMessageSummary(entry),
    html: buildHtmlSummary(entry),
  });

  console.info("[email] Notification sent for %s message from %s", entry.source, entry.email);
  return { sent: true };
};

module.exports = {
  sendPortfolioNotification,
};
