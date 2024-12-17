const { readData, writeData, sortByPosition } = require("../utils/dataAccess");
const { v4: uuidv4 } = require("uuid");

const getAllFilms = (req, res) => {
  const films = sortByPosition(readData());
  res.json(films);
};

const getFilmById = (req, res) => {
  const { id } = req.body;
  const films = readData();
  const film = films.find((f) => f.id === id);

  if (!film) return res.status(404).json({ error: "Film not found" });
  res.json(film);
};

const createFilm = (req, res) => {
  const newFilm = req.body;

  if (
    !newFilm.title ||
    !newFilm.rating ||
    !newFilm.year ||
    newFilm.year < 1888 ||
    newFilm.budget < 0 ||
    newFilm.gross < 0 ||
    !newFilm.poster
  ) {
    return res.status(400).json({ error: "invalid fields" });
  }
  const films = sortByPosition(readData());

  if (newFilm.position > films.length + 1) {
    newFilm.position = films.length + 1;
  } else {
    films.forEach((f) => {
      f.position >= newFilm.position ? f.position++ : null;
    });
  }

  newFilm.id = uuidv4();
  films.push(newFilm);
  writeData(films);
  res.status(200).json(newFilm);
};

const updateFilm = (req, res) => {
  const { id, ...updates } = req.body;
  const films = readData();
  const film = films.find((f) => f.id === id);

  if (!film) {
    return res
      .status(404)
      .json({ error: "film with provided id was not found" });
  }

  Object.assign(film, updates);

  if (updates.position) {
    films.forEach((f) => {
      f.position >= updates.position && f.id !== id ? f.position++ : null;
    });
  }
  writeData(sortByPosition(films));
  res.json(film);
};

const deleteFilm = (req, res) => {
  const { id } = req.body;
  const films = readData();
  const index = films.findIndex((f) => f.id === id);

  if (index === -1) {
    return res
      .status(404)
      .json({ error: "film with provided id was not found" });
  }

  films.splice(index, 1);
  films.forEach((f, i) => {
    f.position = i + 1;
  });

  writeData(films);
  res.json({ success: true });
};

module.exports = {
  getAllFilms,
  getFilmById,
  createFilm,
  updateFilm,
  deleteFilm,
};
