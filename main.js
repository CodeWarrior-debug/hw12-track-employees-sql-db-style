const inquirer = require('inquirer');
const mysql = require('mysql');
const cnsleTbl = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'hrDB'
});
const viewTbl = () => {
    let queryStr = "SELECT e.id AS 'id', e.first_name, e.last_name, role.title, department.name, role.salary, IFNULL(CONCAT(m.first_name,' ', m.last_name),'No Supervisor') As manager FROM employee e LEFT JOIN role ON e.role_id = role.id LEFT JOIN department ON department.id = role.department_id LEFT JOIN employee m ON m.id = e.manager_id;"
    connection.query(queryStr, (err, res) => {
        if (err) throw err;
        console.table(res);
        selectionLoops();
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
            // console.log(answers)
            let queryStr = 'INSERT INTO department SET ?'
            connection.query(queryStr,answers,(err,res) => {
                if (err) throw err;
                // console.log(res);
                selectionLoops();
            }) 
        })
};
const addRole = () => {
    inquirer
        .prompt([{
            'type': 'input',
            'message': 'What role do you want to add?',
            'name': 'title'
        },
        {
            'type': 'input',
            'message': 'What salary for this role?',
            'name': 'salary'
        }
    ])
        .then((answers) => {
            // console.log(answers)
            let queryStr = 'INSERT INTO role (title, salary) VALUES (?, ?)'
            connection.query(queryStr,[answers.title, answers.salary],(err,res) => {
                if (err) throw err;
                // console.log(res);
                selectionLoops();
            }) 
})};
const addEE = () => {
    connection.query('SELECT * FROM employee', (err, employees) => {
            if (err) throw err;
            connection.query('SELECT * FROM role', (err, roles) => {
                    if (err) throw err;
                    inquirer
                        .prompt([{
                                type: 'input',
                                message: 'What is the Employee\'s first name?',
                                name: "first_name"
                            },
                            {
                                type: 'input',
                                message: 'What is the Employee\'s last name?',
                                name: "last_name"
                            },
                            {
                                type: 'list',
                                message: 'Choose the employee\'s role',
                                name: "role_text",
                                choices: () => roles.map((item) => {
                                    return {
                                        name: item.title,
                                        value: item.id
                                    }
                                }),
                            },
                            {
                                type: 'list',
                                message: 'Choose the employee\'s manager',
                                name: "manager_id",
                                choices: () => employees.map((item) => {
                                    return {
                                        name: item.first_name,
                                        value: item.id
                                    }
                                })
                            }

                        ])
                        .then((answers) => {
                            // console.log(answers);
                            connection.query(
                                'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
                                [answers.first_name, answers.last_name, answers.role_text, answers.manager],
                                (err) => {
                                    if (err) throw err;
                                    selectionLoops();
                                });
                        });
                }
            )}
        );
    };
const visDepts = () => {
    let queryStr = 'SELECT * FROM department;';
    connection.query(queryStr, (err, res) => {
        if (err) throw err;
        console.table(res);
        selectionLoops();
    });
};
const visRoles= () => {
    let queryStr = 'SELECT * FROM role;';
    connection.query(queryStr, (err, res) => {
        if (err) throw err;
        console.table(res);
        selectionLoops();
    });
};
const visEEs = () => {
    let queryStr = 'SELECT * FROM employee;';
    connection.query(queryStr, (err, res) => {
        if (err) throw err;
        console.table(res);
        selectionLoops();
    });
};
connection.connect((err) => {  //starts EVERYTHING GOING HERE
    if (err) throw err; //console.log(`connected as id ${connection.id}`)
    selectionLoops();// error will be an Error if one occurred during the query// results will contain the results of the query// fields will contain information about the returned results fields (if any)
});
const employeesUpdateRole = () => {
    // query the database for all employees
    connection.query('SELECT * FROM employee', (err, dbEmployees) => {
        if (err) throw err;
        connection.query('SELECT * FROM role', (err, dbRoles) => {
            if (err) throw err;
            // choose EE
            inquirer
                .prompt([{
                    name: 'choice',
                    type: 'list',
                    choices: () => dbEmployees.map((item) => {
                        return {
                            name: item.first_name,
                            value: item.id
                        }
                    }),
                    message: 'Which employee\'s role would you like to update?',
                }, {
                    name: "newRole",
                    type: "list",
                    choices: () => dbRoles.map((item) => {
                        return {
                            name: item.title,
                            value: item.id
                        }
                    }),
                    message: 'What role should this employee have?'
                }])
                .then((answer) => {
                    // pick role
                    connection.query('UPDATE employee SET role_id = ? WHERE id = ?', [answer.newRole, answer.choice], function (error, results, fields) {
                        if (error) throw error
                        selectionLoops();
                    })
                });

        });
    })
};
const selectionLoops = () => {
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
            else if (answers.menu === "Add Role") addRole()
            else if (answers.menu === "View Roles") visRoles()
            else if (answers.menu === "Add Employee") addEE()
            else if (answers.menu === "View Employees") visEEs()
            else if (answers.menu === "Change Employee Role") employeesUpdateRole()
        })
        .catch(err => {
            if (err) throw err;
        });
};