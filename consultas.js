const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "esmeralda",
  database: "nasa",
  port: 5432,
});

const insertarUsuario = async (email, nombre, password) => {
  try {
    const result = await pool.query(
      "INSERT INTO usuarios (email, nombre, password, auth) VALUES ($1, $2, $3, false) RETURNING *",
      [email, nombre, password]
    );
    return result.rows;
  } catch (error) {
    console.log(error);
  }
};

const listaUsuarios = async () => {
  try {
    const result = await pool.query("SELECT * FROM usuarios");
    return result.rows;
  } catch (error) {
    console.log(error);
  }
};

const checkAuth = async (id, auth) => {
  const result = await pool.query(
    "UPDATE usuarios SET auth=$1 where id = $2 RETURNING *",
    [auth, id]
  );
  return result;
};

const getUser = async (email, password) => {
  const result = await pool.query("SELECT * FROM usuarios where email = $1", [
    email,
  ]);
  return result.rows[0];
};

module.exports = { insertarUsuario, listaUsuarios, checkAuth, getUser };
