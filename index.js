const inquirer = require("inquirer");
const connection = require('./config/connection');

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to the database.");
    startApp(); // Call the function to start Inquirer prompts
});

async function mainQuestionsList() {
    try {
        const res = await inquirer.prompt([
            {
                type: "list",
                name: "choice",
                message: "What would you like to do?",
                choices: [
                    {
                        name: "View All Employees",
                        value: "VIEW_EMPLOYEES"
                    },
                    {
                        name: "Add Employee",
                        value: "ADD_EMPLOYEE"
                    },
                    {
                        name: "Update Employee Role",
                        value: "UPDATE_EMPLOYEE_ROLE"
                    },
                    {
                        name: "View All Roles",
                        value: "VIEW_ROLES"
                    },
                    {
                        name: "Add Role",
                        value: "ADD_ROLE"
                    },
                    {
                        name: "View All Departments",
                        value: "VIEW_DEPARTMENTS"
                    },
                    {
                        name: "Add Department",
                        value: "ADD_DEPARTMENT"
                    },
                    {
                        name: "Quit",
                        value: "QUIT"
                    }
                ],
            },
        ]);

        let choice = res.choice;
        // Call the appropriate function depending on what the user chose
        switch (choice) {
            case "VIEW_EMPLOYEES":
                viewEmployees();
                break;
            case "ADD_EMPLOYEE":
                addEmployee();
                break;
            case "UPDATE_EMPLOYEE_ROLE":
                updateEmployeeRole();
                break;
            case "VIEW_DEPARTMENTS":
                viewDepartments();
                break;
            case "ADD_DEPARTMENT":
                addDepartment();
                break;
            case "VIEW_ROLES":
                viewRoles();
                break;
            case "ADD_ROLE":
                addRole();
                break;
            default:
                quit();
        }
    } catch (err) {
        console.error(err);
    }
}

function viewDepartments() {
    const query = 'SELECT id AS department_id, name AS department_name FROM department';
    connection.query(query, (err, results) => {
        if (err) throw err;
        console.table(results);
        startApp();
    });
}

function viewRoles() {
    const query = 'SELECT role.id AS role_id, title, salary, department.name AS department_name FROM role JOIN department ON role.department_id = department.id';
    connection.query(query, (err, results) => {
        if (err) throw err;
        console.table(results);
        startApp();
    });
}

function viewEmployees() {
    const query = 'SELECT employee.id AS employee_id, first_name, last_name, role.title, role.department_id, role.salary, manager_id FROM employee JOIN role ON employee.role_id = role.id';
    connection.query(query, (err, results) => {
        if (err) throw err;
        console.table(results);
        startApp();
    });
}

function addDepartment() {
    inquirer
        .prompt([
            {
                name: 'department_name',
                type: 'input',
                message: 'Enter the name of the department:',
            },
        ])
        .then((answer) => {
            const query = 'INSERT INTO department (name) VALUES (?)';
            connection.query(query, [answer.department_name], (err) => {
                if (err) throw err;
                console.log('Department added successfully.');
                startApp();
            });
        });
}

function addRole() {
    inquirer
        .prompt([
            {
                name: 'title',
                type: 'input',
                message: 'Enter the role title:',
            },
            {
                name: 'salary',
                type: 'input',
                message: 'Enter the role salary:',
            },
            {
                name: 'department_id',
                type: 'input',
                message: 'Enter the department ID for this role:',
            },
        ])
        .then((answer) => {
            const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
            connection.query(query, [answer.title, answer.salary, answer.department_id], (err) => {
                if (err) throw err;
                console.log('Role added successfully.');
                startApp();
            });
        });
}

function addEmployee() {
    // Collect user input for employee details
    inquirer
        .prompt([
            {
                name: 'first_name',
                type: 'input',
                message: "Enter the employee's first name:",
            },
            {
                name: 'last_name',
                type: 'input',
                message: "Enter the employee's last name:",
            },
            {
                name: 'role_id',
                type: 'input',
                message: "Enter the employee's role ID:",
            },
            {
                name: 'manager_id',
                type: 'input',
                message: "Enter the employee's manager ID:",
            },
        ])
        .then((answer) => {
            // Insert the new employee into the database
            const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
            connection.query(
                query,
                [answer.first_name, answer.last_name, answer.role_id, answer.manager_id],
                (err) => {
                    if (err) throw err;
                    console.log('Employee added successfully.');
                    startApp();
                }
            );
        });
}

function updateEmployeeRole() {
    // Collect user input for employee and new role details
    inquirer
        .prompt([
            {
                name: 'employee_id',
                type: 'input',
                message: 'Enter the ID of the employee to update:',
            },
            {
                name: 'new_role_id',
                type: 'input',
                message: 'Enter the new role ID for the employee:',
            },
        ])
        .then((answer) => {
            // Update the employee's role in the database
            const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
            connection.query(query, [answer.new_role_id, answer.employee_id], (err) => {
                if (err) throw err;
                console.log('Employee role updated successfully.');
                startApp();
            });
        });
}

function quit() {
    console.log('Goodbye!');
    connection.end(); // Close the database connection
    process.exit(0); // Exit the Node.js application
}

function startApp() {
    mainQuestionsList();
}