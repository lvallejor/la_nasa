//Importaciones
const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const {
  insertarUsuario,
  listaUsuarios,
  checkAuth,
  getUser,
} = require("./consultas");
const app = express();
const jwt = require("jsonwebtoken");

//Config
app.listen(3001, () => console.log("Servidor en puerto 3001"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("view engine", "handlebars");
app.engine(
  "handlebars",
  exphbs({
    layoutsDir: __dirname + "/views",
    partialsDir: __dirname + "/views/components",
  })
);
const secretKey = "NASA";

//Rutas
app.get("/", (req, res) => {
  res.render("Home", { layout: "Home" });
});

app.post("/usuario", async (req, res) => {
  const { email, nombre, password } = req.body;
  res.send(await insertarUsuario(email, nombre, password));
});

app.get("/Admin", async (req, res) => {
  const usuarios = await listaUsuarios();
  res.render("Admin", { layout: "Admin", usuarios });
});

app.post("/auth", async (req, res) => {
  const { id, auth } = req.body;
  try {
    const result = await checkAuth(id, auth);
    res.send(result);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.get("/login", (req, res) => {
  res.render("Login", { layout: "Login" });
});

app.post("/verify", async (req, res) => {
  const { email, password } = req.body;
  const user = await getUser(email, password);
  let token = user && user.auth ? jwt.sign(user, secretKey) : false;
  user
    ? user.auth
      ? res.redirect("/Evidencias?token=" + token)
      : res.send("Usted no está autorizado")
    : res.send("No existe este usuario en nuestra base de datos");

  res.send();
});

app.get("/Evidencias", (req, res) => {
  const { token } = req.query;

  jwt.verify(token, secretKey, (err, payload) => {
    err
      ? res.status(401).send({ error: "401 No Autorizado", message: err })
      : res.render("Evidencias", {
          layout: "Evidencias",
          nombre: payload.nombre,
        });
  });
});
