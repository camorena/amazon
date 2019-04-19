DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;
CREATE TABLE products
(
  id INT(11) NOT NULL
  AUTO_INCREMENT,
  item_id INT
  (11) NOT NULL,
  product_name VARCHAR
  (100) NOT NULL,
  department_name VARCHAR
  (45) NOT NULL,
  price INT default 0,             -- cost to customer 
  stock_quantity INT default 0,    -- how much of the product is available in stores
  product_sales  INT default 0,
  PRIMARY KEY
  (id)
);
  CREATE TABLE departments
  (
    id INT(11) NOT NULL
    AUTO_INCREMENT,
  department_id INT
    (11) NOT NULL,
  department_name VARCHAR
    (100) NOT NULL,
  over_head_costs INT default 0,   --  
  stock_quantity INT default 0,    -- 
  PRIMARY KEY
    (id)
);
