const inquirer = require('inquirer');
const mysql = require('mysql');
const cnsleTbl = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'hrDB'
})

const viewTbl = () => {
    let queryStr = "SELECT e.id AS 'id', e.first_name, e.last_name, role.title, department.name, role.salary, IFNULL(CONCAT(m.first_name,' ', m.last_name),'No Supervisor') As manager FROM employee e LEFT JOIN role ON e.role_id = role.id LEFT JOIN department ON department.id = role.department_id LEFT JOIN employee m ON m.id = e.manager_id;"
    connection.query(queryStr, (err, res) => {
        if (err) throw err;
        console.table(res);
        selectionMenu();
    });
};
const addDepartment = () => {
    inquirer
        .prompt([{
            'type': 'input',
            'message': 'What Department do you want to add?',
            'name': 'name'
        }])
        .then((answers) => {
            console.log(answers)
            let queryStr = 'INSERT INTO role SET ?'
            connection.query(queryStr,answers,(err,res) => {
                if (err) throw err;
                console.log(res);
                selectionMenu();
            }) 
        })
};
const addEmployee = () => {
    inquirer
        .prompt([{
            'type': 'input',
            'message': 'What Department do you want to add?',
            'name': 'name'
        }])
        .then((answers) => {
            console.log(answers)
            let queryStr = 'INSERT INTO department SET ?'
            connection.query(queryStr,answers,(err,res) => {
                if (err) throw err;
                console.log(res);
                selectionMenu();
            }) 
        })
};
const addEE = () => {
    inquirer
        .prompt([{
            'type': 'input',
            'message': 'What Department do you want to add?',
            'name': 'name'
        }])
        .then((answers) => {
            console.log(answers)
            let queryStr = 'INSERT INTO department SET ?'
            connection.query(queryStr,answers,(err,res) => {
                if (err) throw err;
                console.log(res);
                selectionMenu();
            }) 
        })
};
const visDepts = () => {
    let queryStr = 'SELECT * FROM department;';
    connection.query(queryStr, (err, res) => {
        if (err) throw err;
        console.table(res);
        selectionMenu();
    });
};
const visRoles= () => {
    let queryStr = 'SELECT * FROM role;';
    connection.query(queryStr, (err, res) => {
        if (err) throw err;
        console.table(res);
        selectionMenu();
    });
};
const visEEs = () => {
    let queryStr = 'SELECT * FROM employee;';
    connection.query(queryStr, (err, res) => {
        if (err) throw err;
        console.table(res);
        selectionMenu();
    });
};
connection.connect((err) => {
    if (err) throw err; //console.log(`connected as id ${connection.id}`)
    selectionMenu();// error will be an Error if one occurred during the query// results will contain the results of the query// fields will contain information about the returned results fields (if any)
});

const selectionMenu = () => {
    inquirer
        .prompt([{
            'type': 'list',
            'message': 'What do you want to do ?',
            'choices': ["View ALL Employees Table", "Exit", "Add Department", "View Departments", "Add Role", "View Roles", "Add Employee", "View Employees", "Change Employee Role"], //"change employee managers", "view employees by manager", "delete department", "delete role", "delete employee", "View total department budget"
            'name': "menu"
        },])
        .then((answers) => {
            if (answers.menu === "View ALL Employees Table") viewTbl() 
            else if (answers.menu === "Exit") connection.end() 
            else if (answers.menu === "Add Department") addDepartment()
            else if (answers.menu === "View Departments") visDepts()
            else if (answers.menu === "Add Role") addDepartment()
            else if (answers.menu === "View Roles") visRoles()
            else if (answers.menu === "Add Employee") addDepartment()
            else if (answers.menu === "View Employees") visEEs()
            else if (answers.menu === "Change Employee Role") chgDepts()
            else if (answers.menu === "View Departments") visDepts()
        })
        .catch(err => { // remove later
            if (err.isTtyError) {
            } else {
            }
        });
}