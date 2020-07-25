const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
let likes = 0;

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
  const { title, url, techs } = request.body;
  
  const repositorie = { id: uuid(), title, url, techs, likes };

  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  
  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);
  
  if(repositorieIndex < 0) {
    return response.status(400).json({ error: "Project Not Found."}); 
  }
  
  const repositorie = {
    id,
    title,
    url,
    techs,
  };

  repositories[repositorieIndex] = repositorie;

  return response.json(repositorie);

  
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);
  
  if(repositorieIndex < 0) {
    return response.status(400).json({ error: "Project Not Found."}); 
  }

  repositories.splice(repositorieIndex, 1);


  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);
  
  if(repositorieIndex < 0) {
    return response.status(400).json({ error: "Project Not Found."}); 
  }

  let repositorie = repositories[repositorieIndex];repositorie.likes = repositorie.likes + 1;
  repositories[repositorieIndex] = repositorie;

  return response.status(200).json(repositorie);

});

app.listen(3334, () => {
  console.log("Back-end started!");
});

module.exports = app;
