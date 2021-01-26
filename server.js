const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const { insertarUsuario, listaUsuarios } = require("./consultas");
const app = express();

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

app.get("/", (req, res) => {
  res.render("Home", { layout: "Home" });
});

app.post("/usuario", async (req, res) => {
  const { email, nombre, password } = req.body;
  res.send(await insertarUsuario(email, nombre, password));
});

app.get("/Admin", async (req, res) => {
  const usuarios = await listaUsuarios();
  res.render("Admin", {
    layout: "Admin",
    usuarios,
  });
});
