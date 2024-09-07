const file = require("./file");

exports.budgetInfo = () => {
  console.log(budget);
  return budget !== undefined ? true : false;
};

exports.setBudget = async (data) => {
  await file.writeTXT(data);
  console.log("Budget is successfully set");
};
