const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'EmployeeTracker'
})

const afterConnection = () => {
    connection.query('SELECT employee.first_name, employee.last_name, role.title, department.name, role.salary FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON department.id = role.department_id;', (err, res) => { 
// SELECT employee.first_name, employee.last_name, role.title, department.name, role.salary;
// FROM employee

// LEFT JOIN role
// ON employee.role_id = role.id

// LEFT JOIN department
// ON department.id = role.department_id
// ;
        if(err) throw err;
        console.log(res);
        connection.end();
    });
};

connection.connect((err) => {
    if(err) throw err;
    console.log(`connected as id ${connection.threadID}`)
    afterConnection();
        // error will be an Error if one occurred during the query
        // results will contain the results of the query
        // fields will contain information about the returned results fields (if any)
      });