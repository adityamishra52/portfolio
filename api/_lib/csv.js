const escapeCsvValue = (value) => {
  const normalized = value == null ? "" : String(value);
  if (/[",\n]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }
  return normalized;
};

const toCsv = (rows, columns) => {
  const header = columns.map((column) => escapeCsvValue(column.label)).join(",");
  const body = rows
    .map((row) => columns.map((column) => escapeCsvValue(row[column.key])).join(","))
    .join("\n");

  return [header, body].filter(Boolean).join("\n");
};

module.exports = {
  toCsv,
};
