const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../top250.json");
const managerPath = path.join(__dirname, "../manager.json");

function readData() {
  try {
    const data = fs.readFileSync(dataPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("error reading or parsing data:", error);
    return [];
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("error writing data:", error);
  }
}

function sortByPosition(films) {
  return films.sort((a, b) => a.position - b.position);
}
function writeManager(data) {
  try {
    // console.log(data);

    fs.writeFileSync(managerPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("error writing user data:", error);
  }
}
function readManager() {
  try {
    const data = fs.readFileSync(managerPath, "utf8");
    const parsedData = JSON.parse(data);
    if (!Array.isArray(parsedData)) {
      console.error("users.json is not valid array");
    }
    return parsedData;
  } catch (error) {
    console.error("error reading user data:", error);
  }
}
module.exports = {
  readData,
  writeData,
  sortByPosition,
  writeManager,
  readManager,
};
