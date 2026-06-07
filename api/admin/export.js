const { exportMessages } = require("../_lib/messages");
const { enforceRateLimit } = require("../_lib/rateLimit");
const { sanitizeErrorMessage } = require("../_lib/response");
const { assertAdminAccess } = require("../_lib/auth");
const { toCsv } = require("../_lib/csv");
const { toExcelBuffer } = require("../_lib/excel");

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
    if (enforceRateLimit(req, res, { keyPrefix: "admin-export", max: 20, windowMs: 60 * 1000 })) {
      return;
    }

    assertAdminAccess(req);

    if (req.method !== "GET") {
      res.status(405).setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ success: false, message: "Method not allowed." }));
      return;
    }

    const entries = await exportMessages(req.query);
    const csv = toCsv(entries, columns);
    const fileType = req.query.type || "all";
    const format = req.query.format === "excel" ? "excel" : "csv";

    res.status(200);

    if (format === "excel") {
      res.setHeader("Content-Type", "application/vnd.ms-excel");
      res.setHeader("Content-Disposition", `attachment; filename=\"${fileType}-messages.xls\"`);
      res.end(toExcelBuffer(entries, columns));
      return;
    }

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename=\"${fileType}-messages.csv\"`);
    res.end(csv);
  } catch (error) {
    console.error("[api/admin/export] Export failed:", error.message);
    res.status(error.statusCode || 500).setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: false, message: sanitizeErrorMessage(error, "Could not export messages.") }));
  }
};
