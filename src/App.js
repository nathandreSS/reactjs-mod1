import React, { useState, useEffect } from "react";

import api from "./services/api";
import "./styles.css";

function App() {
  const [ repositories, setRepositories ] = useState([]);
  useEffect(() => {
    api.get('repositories').then( response => {
      setRepositories(response.data);
    })
  },[])
  async function handleAddRepository() {
    const title = document.getElementById('title').value;
    const url = document.getElementById('url').value;
    const techs = document.getElementById('techs').value.split(',')
    const response = await api.post('repositories', {
      title,
      url,
      techs
    });

    setRepositories([...repositories, response.data]);
    clearInputs();
  }

  async function handleRemoveRepository(id) {
    await api.delete(`repositories/${id}`);

    const repoIndex = repositories.findIndex(repo => repo.id === id);
    setRepositories(repositories.filter((repo, index) => index !== repoIndex));
  }

  async function handleLikeRepository(id) {
    const response = await api.post(`repositories/${id}/like`);
    setRepositories(repositories.map( repo => {
      repo.likes = repo.id === id ? response.data.likes : repo.likes;
      return repo;
    }));
  }

  function clearInputs() {
    document.getElementById('title').value = '';
    document.getElementById('url').value = '';
    document.getElementById('techs').value = '';
    
  }
  return (
    <div id="container">
      <span id="form">
        <input id="title" type="text" placeholder="title"/>
        <input id="url" type="text" placeholder="url"/>
        <input id="techs" type="text" placeholder="techs"/>
        <button onClick={handleAddRepository}>Adicionar</button>
      </span>
    
      <ul data-testid="repository-list">
        { repositories.map( repo => {
          return <li key={repo.id}>
            <div className="info">
              <h2>{repo.title}</h2>
              <p> Likes: {repo.likes} </p>
            </div>
            <div>
              <button className='likeButton' onClick={() => handleLikeRepository(repo.id)}> 
                Like 
              </button>
            </div>
            <div>
              <button className='deleteButton' onClick={() => handleRemoveRepository(repo.id)}>
                Remover
              </button>
            </div>
          </li>
      })}
      </ul>
    </div>
  );
}

export default App;
