export function exportToCSV<T extends object>(data: T[], fileName = 'data.csv') {
  if (!data || !data.length) {
    return;
  }

  const headers = Object.keys(data[0] as object) as (keyof T & string)[];

  const csvRows = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((field) => {
          const record = row as Record<string, unknown>;
          const rawValue = record[field];

          if (rawValue === null || rawValue === undefined) {
            return '';
          }

          let stringValue = String(rawValue).replace(/"/g, '""');

          if (
            stringValue.includes(',') ||
            stringValue.includes('"') ||
            stringValue.includes('\n')
          ) {
            stringValue = `"${stringValue}"`;
          }

          return stringValue;
        })
        .join(',')
    ),
  ];

  const csvString = csvRows.join('\n');

  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}
