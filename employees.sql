DROP DATABASE IF EXISTS hrDB;

CREATE DATABASE hrDB;

USE hrDB;

CREATE TABLE department (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NULL
);

CREATE TABLE role (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id)

);

CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);

INSERT INTO department(name)
VALUES("Management"),
    ("Sales"),
    ("Labor");

INSERT INTO role(title, salary, department_id)
VALUES("Manager", 80000, 1),
    ("Salesperson", 60000,2),
    ("Labor", 40000,3);
 
INSERT INTO employee(first_name,last_name,role_id,manager_id)

VALUES("Big", "Boss", 1, NULL),
    ("James", "Fast-Money", 2, 1),
    ("Peter", "ABC",2,1),
    ("Small","Boss",1,NULL),
    ("Poor","Guy",3,4),
    ("Tired", "Dude", 3, 4);