const { exportMessages } = require("../_lib/messages");
const { sanitizeErrorMessage } = require("../_lib/response");
const { assertAdminAccess } = require("../_lib/auth");
const { toCsv } = require("../_lib/csv");

const columns = [
  { key: "source", label: "Source" },
  { key: "status", label: "Status" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "subject", label: "Subject" },
  { key: "company", label: "Company" },
  { key: "projectType", label: "Project Type" },
  { key: "budget", label: "Budget" },
  { key: "timeline", label: "Timeline" },
  { key: "message", label: "Message" },
  { key: "createdAt", label: "Created At" },
  { key: "updatedAt", label: "Updated At" },
  { key: "userAgent", label: "User Agent" },
  { key: "ipAddress", label: "IP Address" },
];

module.exports = async (req, res) => {
  try {
    assertAdminAccess(req);

    if (req.method !== "GET") {
      res.status(405).setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ success: false, message: "Method not allowed." }));
      return;
    }

    const entries = await exportMessages(req.query);
    const csv = toCsv(entries, columns);
    const fileType = req.query.type || "all";

    res.status(200);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename=\"${fileType}-messages.csv\"`);
    res.end(csv);
  } catch (error) {
    console.error("[api/admin/export] Export failed:", error.message);
    res.status(error.statusCode || 500).setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: false, message: sanitizeErrorMessage(error, "Could not export messages.") }));
  }
};
