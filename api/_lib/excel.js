const toExcelBuffer = (rows, columns) => {
  const header = `<tr>${columns.map((column) => `<th>${column.label}</th>`).join("")}</tr>`;
  const body = rows
    .map(
      (row) =>
        `<tr>${columns
          .map((column) => `<td>${String(row[column.key] ?? "").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>`)
          .join("")}</tr>`
    )
    .join("");

  const html = `
    <html>
      <head><meta charset="utf-8" /></head>
      <body>
        <table>${header}${body}</table>
      </body>
    </html>
  `;

  return Buffer.from(html, "utf8");
};

module.exports = {
  toExcelBuffer,
};
