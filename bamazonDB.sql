DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;
USE bamazon_db;
CREATE TABLE products (
 id INTEGER(11) auto_increment NOT NULL,
 product_name VARCHAR(100) NOT NULL,
 department_name VARCHAR(100) NOT NULL,
 price DECIMAL(10,4) NOT NULL,
 stock_quantity DECIMAL(10,4) NOT NULL,
 product_sales DECIMAL(10,4) NOT NULL,
 primary key (id)
);

CREATE TABLE departments (
 department_id INTEGER(11) auto_increment NOT NULL,
 department_name VARCHAR(100) NOT NULL,
 over_head_costs DECIMAL(10,4) NOT NULL,
 primary key (department_id)
);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Table", "Furniture", 55, 100), ("Chair", "Furniture", 15, 100),
("Phone", "Electronics", 555, 500),("TV", "Electronics", 400, 1000),
("Tablet", "Electronics", 155, 800),("Ipod", "Electronics", 155, 100),
("Tootpaste", "Personal Care", 5, 1000),("Toothbrush", "Personal Care", 2, 1070),
("Perfume", "Personal Care", 755, 500),("Gel", "Personal Care", 155, 400);

SELECT * FROM products;
