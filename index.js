var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 8889,

  // Your username
  user: "root",

  // Your password
  password: "Datelica2019",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt([{
      name: "menuOption",
      type: "list",
      message: "Select a menu option ",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product",
        "Exit"
      ]
    }])
    .then(function (data) {
      processRequest(data.menuOption);
    });
}

// function to handle menu options
function processRequest(menuOption) {
  var choice = menuOption.toLowerCase();
  switch (choice) {
    case "view products for sale":
      viewProducts();
      break;
    case "view low inventory":
      viewInventory();
      break;
    case "add to inventory":
      addInventory();
      break;
    case "add new product":
      addProduct();
      break;
    case "exit":
      break;
  }
}

function viewProducts() {
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;
    if (results.length === 0) {
      console.log("Products table empty");
    } else {
      showResults('Products for Sale', results);
      start();
    }
  });

}

function viewInventory() {
  connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (
    err,
    results
  ) {
    if (err) throw err;
    if (results.length === 0) {
      console.log("No products found with stock under 5 items");
    } else {
      showResults('Products Low Inventory', results);
      start();
    }
  });
}

function addInventory() {
  inquirer
    .prompt([{
        name: "prodId",
        type: "input",
        message: "Product Number",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "qty",
        type: "input",
        message: "Product quantity to add",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function (input) {
      connection.query(
        "SELECT * FROM products WHERE item_id = " + input.prodId,
        function (err, results) {
          if (err) throw err;
          if (results.length > 0) {
            showResults('Product Before Update', results);
            connection.query(
              "UPDATE products SET ? WHERE ?", [{
                  stock_quantity: results[0].stock_quantity + parseInt(input.qty)
                },
                {
                  item_id: input.prodId
                }
              ],
              function (err) {
                if (err) throw err;
                connection.query(
                  "SELECT * FROM products WHERE item_id = " + input.prodId,
                  function (err, results) {
                    if (err) throw err;
                    if (results.length > 0) {
                      showResults('Product After Update', results);
                      start();
                    }
                  }
                );
              }
            );
          }
        }
      );

    });
}

function addProduct() {
  inquirer
    .prompt([{
        name: "prodId",
        type: "input",
        message: "Product Id"
      },
      {
        name: "name",
        type: "input",
        message: "Product Name"
      },
      {
        name: "dept",
        type: "input",
        message: "Department Name"
      },
      {
        name: "price",
        type: "input",
        message: "Product Price",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "stock",
        type: "input",
        message: "Stock Quantity",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "sales",
        type: "input",
        message: "Product Sales",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function (input) {
      connection.query(
        "SELECT * FROM products WHERE item_id = " + input.prodId,
        function (err, results) {
          if (err) throw err;
          if (results.length > 0) {
            console.log('Product Already Exist');
            start();
          }
        }
      );
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO products SET ?", {
          item_id: input.prodId,
          product_name: input.name,
          department_name: input.dept,
          price: input.price || 0,
          stock_quantity: input.stock || 0,
          product_sales: input.sales || 0
        },
        function (err) {
          if (err) throw err;
          connection.query(
            "SELECT * FROM products WHERE item_id = " + input.prodId,
            function (err, results) {
              if (err) throw err;
              if (results.length > 0) {
                showResults('New Product Added', results);
                start();
              }
            }
          );
        }
      );
    });
}

function showResults(title, results) {
  var table = new Table({
    head: ["ID", "Name", "Dept", "Price", "Stock", "Sales"],
    colWidths: [4, 15, 15, 7, 7, 7]
  });
  Object.keys(results).forEach(function (key) {
    var row = results[key];
    table.push([
      row.item_id,
      row.product_name,
      row.department_name,
      row.price,
      row.stock_quantity,
      row.product_sales
    ]);
  });
  console.log("\n\n                    " + title.toUpperCase());
  console.log(table.toString());
  console.log("\n");
}