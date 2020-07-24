const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

//id verification
function validateRepositoriesId(request, response, next){
  const {id} = request.params;

  if(!isUuid(id)){
    return response.status(400).json({ error: "Invalid ID."});
  }

  return next();
}

app.use("/repositories/:id", validateRepositoriesId);

app.get("/repositories", (request, response) => {

  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body;
  let likes = 0;

  const repositorie = { id: uuid(), title, url, techs, likes };

  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  
  const repositorieId = repositories.findIndex(repositorie => repositorie.id === id);
  
  if(repositorieId < 0) {
    return response.status(400).json({ error: "Project not found."}); 
  }
  
  const repositorie = {
    title,
    url,
    techs,
  }

  repositories[repositorieId] = repositorie;

  return response.json(repositorie);

  
});

app.delete("/repositories/:id", (request, response) => {
  // TODO
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
});

// app.listen(3334, () => {
//   console.log("Back-end started!");
// })

module.exports = app;
