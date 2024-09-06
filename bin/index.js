#!/usr/bin/env node
const fs = require("fs");

const { program } = require("commander");

const file = require("../util/file");
const allMonths = require("../util/months");
const budget = require("../util/budget");

async function add() {
  const options = this.opts(); // Extracts flags arguments from CLI

  // Checks if flags arguments exists
  if (!options.description) {
    console.log("Description is required.");
    process.exit(1);
  }
  if (!options.amount) {
    console.log("Amount is required.");
    process.exit(1);
  }
  if (!options.category) {
    console.log("Category is required.");
    process.exit(1);
  }

  // Checks if expenses.json file exist
  if (fs.existsSync("./expenses.json")) {
    const obj = await file.read();

    let newId = 1;
    const allIds = obj.expenses.map((expense) => expense.id); // Stores all IDs of expenses in "allIds" array

    // Checks if "newId" is in "allIds", if "newId" doesn't exists in "allIds", it is assigned, otherwise "newId" is incremented
    while (allIds.includes(newId)) {
      newId++;
    }

    const expense = {
      id: newId,
      date: new Date().toISOString().split("T")[0],
      description: options.description,
      amount: options.amount,
      category: options.category,
    };

    obj.expenses.push(expense);
    obj.expenses.sort((a, b) => a.id - b.id); // Sorts from lowest ID to highest
    await file.write(obj);
    budget(obj);
    console.log(`Expense added successfully (ID: ${newId})`);
  }
  // Creates file and add first expense
  else {
    const expense = {
      id: 1,
      date: new Date().toISOString().split("T")[0],
      description: options.description,
      amount: options.amount,
      category: options.category,
    };

    const obj = { expenses: [expense] };
    await file.write(obj);
    console.log(`Expense added successfully (ID: 1)`);
  }
}

async function expensesList() {
  if (fs.existsSync("./expenses.json")) {
    const json = await file.read();
    const { category } = this.opts();

    if (json.expenses.length === 0) {
      console.log("There are no expenses!");
      process.exit(1);
    }

    console.log("# ID     Date      Categories      Description     Amount");
    console.log(
      "-------------------------------------------------------------"
    );

    json.expenses
      .filter((expense) => !category || expense.category === category) // Filter by category if it exists
      .forEach((expense) => {
        const Id = String(expense.id).padEnd(4);
        const Date = (expense.date || "N/A").padEnd(13);
        const Category = expense.category.padEnd(13);
        const Description = expense.description.padEnd(15);
        const Amount = `$${expense.amount}`.padStart(4);

        console.log(`# ${Id} ${Date} ${Category} ${Description} ${Amount}`);
      });
  } else {
    console.log("Expenses.json file doesn't exists!");
  }
}

async function deleteExpense() {
  const { id } = this.opts(); // Extracts flags arguments from CLI
  if (fs.existsSync("./expenses.json")) {
    const json = await file.read();

    if (json.expenses.length === 0) {
      console.log("There are no expenses");
      process.exit(1);
    }

    // Filters expenses and return all expenses except "id" that was given (removes expense with that Id)
    const newExpenses = json.expenses.filter((expense) => {
      return Number(expense.id) !== Number(id);
    });

    if (newExpenses.length === json.length) {
      console.log(`Expense with ID ${id} not found.`);
      process.exit(1);
    }

    const expense = { expenses: newExpenses };

    await file.write(expense);
    console.log("Expense deleted successfully");
  } else {
    console.log("Expenses.json file doesn't exists!");
  }
}

async function summaryExpenses() {
  if (fs.existsSync("./expenses.json")) {
    const json = await file.read();
    const { month } = this.opts(); //Extracts flags arguments from CLI

    if (json.expenses.length === 0) {
      console.log("There are no expenses");
      process.exit(1);
    }

    // Summary for all expenses
    if (!month) {
      let sum = 0;

      for (let i = 0; i < json.expenses.length; i++) {
        let amount = json.expenses[i].amount;
        sum += +amount;
      }

      console.log(`Total expenses: $${sum}`);
    }

    // Summary for <month> expenses
    else {
      let sum = 0;
      let currentMonth = month;

      if (month < 10) {
        currentMonth = "0" + month;
      }

      for (let i = 0; i < json.expenses.length; i++) {
        const date = json.expenses[i].date.split("-"); // Gets expenses date in array [year, month, day]
        if (
          date[0] === new Date().getFullYear().toString() &&
          date[1] === currentMonth
        ) {
          const amount = json.expenses[i].amount;
          sum += +amount;
        }
      }

      console.log(`Total expenses for ${allMonths[month - 1]}: $${sum}`);
    }
  } else {
    console.log("Expenses.json file doesn't exists!");
  }
}

// CLI Logic and Input //

program
  .command("add")
  .description("Adds expense description and amount")
  .option("-d, --description <desc>", "Add description of expense")
  .option("-a, --amount <amount>", "Add amount of expense")
  .option("-c, --category <category>", "Add category of expense")
  .action(add);
program
  .command("list")
  .description("List of expenses")
  .option(
    "-c, --category <category>",
    "Outputs expenses only for this category"
  )
  .action(expensesList);
program
  .command("summary")
  .description("Total expenses")
  .option("-m, --month <month>", "Total expenses for that month")
  .action(summaryExpenses);
program
  .command("delete")
  .description("Adds expense description and amount")
  .option("--id <id>", "Id to delete")
  .action(deleteExpense);

program.parse(process.argv);
