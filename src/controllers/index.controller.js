import { pool } from "../db.js";

export const getUsers = async (req, res) => {
  const response = await pool.query("SELECT * FROM users ORDER BY id ASC");
  res.status(200).json(response.rows);
};

export const getUserById = async (req, res) => {
  const id = parseInt(req.params.id);
  const response = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  res.json(response.rows);
};

export const createTable = async (req, res) => {
  try {
    const createTableQuery = `
      DROP TABLE IF EXISTS users;

      CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(40),
          email TEXT NOT NULL UNIQUE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      INSERT INTO users (name, email)
          VALUES ('joe', 'joe@ibm.com'),
                 ('ryan', 'ryan@faztweb.com');
    `;

    // Ejecutar las consultas de creación de tabla e inserción
    await pool.query(createTableQuery);

    // Obtener los datos insertados
    const result = await pool.query("SELECT * FROM users");

    res.status(200).json(result.rows); // Devolver los datos insertados
  } catch (error) {
    console.error("Error creating table:", error.message);
    res.status(500).json({ error: "Failed to create table or insert data" });
  }
};


export const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    const { rows } = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;

  const { rows } = await pool.query(
    "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
    [name, email, id]
  );

  return res.json(rows[0]);
};

export const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);
  const { rowCount } = await pool.query("DELETE FROM users where id = $1", [
    id,
  ]);

  if (rowCount === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.sendStatus(204);
};
