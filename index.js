const express = require("express");
const bodyParser = require("body-parser");
const { authenticate, authorize } = require("./middleware/authMiddleware");
const filmController = require("./controllers/filmController");
const loginRegisterController = require("./controllers/loginRegisterController");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/films/readall", filmController.getAllFilms);
app.get("/films/read", filmController.getFilmById);

// Protected endpoints using authenticate middleware
app.post(
  "/films/create",
  authenticate,
  authorize("superuser"),
  filmController.createFilm
);

app.post(
  "/films/update",
  authenticate,
  authorize("superuser"),
  filmController.updateFilm
);
app.post(
  "/films/delete",
  authenticate,
  authorize("superuser"),
  filmController.deleteFilm
);

// auth endpoints
app.post("/auth/register", loginRegisterController.register);
app.post("/auth/login", loginRegisterController.login);

app.listen(3000, () => {
  console.log("app listening on port 3000!");
});
