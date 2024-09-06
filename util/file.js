const fs = require("fs");

exports.read = () => {
  try {
    const data = fs.readFileSync("./expenses.json", "utf8");
    const obj = JSON.parse(data);
    return obj;
  } catch (err) {
    console.log("Error reading or parsing file: ", err);
    process.exit(1);
  }
};

exports.write = (data) => {
  try {
    const obj = JSON.stringify(data);
    fs.writeFileSync("./expenses.json", obj, "utf8");
  } catch (err) {
    console.log("Error reading or parsing file: ", err);
    process.exit(1);
  }
};
