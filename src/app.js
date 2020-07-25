const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");


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
  const { title, url, techs } = request.body;
  
  const repository = { 
    id: uuid(), 
    title, 
    url, 
    techs, 
    likes: 0 
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  
  const repositorieIndex = repositories.findIndex(repository => repository.id === id);
  
  if(repositorieIndex < 0) {
    return response.status(400).json({ error: "Project Not Found."}); 
  }
  
  const repository = {
    id,
    title,
    url,
    techs,
    likes: 0
  };

  repositories[repositorieIndex] = repository;

  return response.json(repository);

  
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if(repositoryIndex < 0) {
    return response.status(400).json({ error: "Project Not Found."}); 
  }

  repositories.splice(repositoryIndex, 1);


  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if(repositoryIndex < 0) {
    return response.status(400).json({ error: "Project Not Found."}); 
  }

  const repository = {
    ...repositories[repositoryIndex], 
    likes: ++repositories[repositoryIndex].likes,
  }

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);

});

 app.listen(3334, () => {
   console.log("Back-end started!");
 });

module.exports = app;
