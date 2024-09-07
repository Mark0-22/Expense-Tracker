const fs = require("fs");

exports.readJSON = () => {
  try {
    const data = fs.readFileSync("./expenses.json", "utf8");
    const obj = JSON.parse(data);
    return obj;
  } catch (err) {
    console.log("Error reading or parsing file: ", err);
    process.exit(1);
  }
};

exports.writeJSON = (data) => {
  try {
    const obj = JSON.stringify(data);
    fs.writeFileSync("./expenses.json", obj, "utf8");
  } catch (err) {
    console.log("Error reading or parsing file: ", err);
    process.exit(1);
  }
};

exports.readTXT = () => {
  try {
    const data = fs.readFileSync("./budget.txt", "utf8");
    return data;
  } catch (err) {
    console.log("Error reading or parsing file: ", err);
    process.exit(1);
  }
};

exports.writeTXT = (data) => {
  try {
    fs.writeFileSync("./budget.txt", data, "utf8");
  } catch (err) {
    console.log("Error reading or parsing file: ", err);
    process.exit(1);
  }
};

exports.JSONToCSV = (data) => {
  const csvRows = [];

  const headers = Object.keys(data[0]); // Extract the keys (headers) from the first object in the array (e.g. id, amount, date...)

  csvRows.push(headers.join(";"));

  // Loops for each expense
  for (const row of data) {
    const values = headers.map((header) => {
      const val = row[header];

      // If the value is a string and contains spaces, wrap it in double quotes
      if (typeof val === "string" && val.includes(" ")) return `"${val}"`;
      return `${val}`; // Otherwise, return the value as it is
    });

    csvRows.push(values.join(";"));
  }

  return csvRows.join("\n");
};
