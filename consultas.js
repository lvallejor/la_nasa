const { Pool } = require("pg");

const pool = new Pool({
  user: "spacypfyfqxbzn",
  host: "ec2-52-4-177-4.compute-1.amazonaws.com",
  password: "bc3173aa30b749e696a263709d3f2d067c9b0b2a3eb328f1a6e853612c75e440",
  database: "d15k0intofv0m8",
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
