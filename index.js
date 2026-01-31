import express from "express";
import mysql from "mysql2/promise";

const app = express();

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Samnke@2001",
    database: "pick_n_steal",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// GET all employees
app.get("/employees", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM employees");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

function singleEmployee() {
  const sql = "SELECT * FROM employees WHERE id_employee = ?";

  pool.query(sql, [2], (error, result) => {
    if (error) {
      console.error(" error:", error.message);
      return;
    }

    console.log("Single employee result:", result);
  });
}

// Insert an employee
async function insertEmployee() {
    const sql = "INSERT INTO employees (id_employee, first_name, last_name, email, phone_number, department, salary) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const employee = [5, "Sam", "Mpii", "sam.mp@example.com", "555-1234", "IT", 50000];

    try {
        const [result] = await pool.query(sql, employee);
        console.log("Employee inserted with ID:", result.insertId);
    } catch (error) {
        console.error("Insert error:", error.message);
    }
}


function removeEmployee() {
  const sql = "DELETE FROM employees WHERE id_employee = ?";

  pool.query(sql, [2], (error, result) => {
    if (error) {
      console.error("Delete error:", error.message);
      return;
    }

    console.log(`Deleted ${result.affectedRows} product(s) named 'baro'`);
  });
}

function updateEmployee() {
  const sql = "UPDATE employees SET salary = ? WHERE id_employee = ?";  
  const newSalary = 60000;

  pool.query(sql, [newSalary, 3], (error, result) => {
    if (error) {
      console.error("Update error:", error.message);
      return;
    }

    console.log(`Updated ${result.affectedRows} employee(s)`);
  });
}

removeEmployee();
insertEmployee();
updateEmployee();
singleEmployee();
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
    console.log("GET all employees: http://localhost:3000/employees");
    console.log("GET employee 1: http://localhost:3000/employees/id_employee");
});
