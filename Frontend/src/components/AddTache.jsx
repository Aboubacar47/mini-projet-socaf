import { useState } from 'react';
import axios from 'axios';

const AddTache = ({ onTacheAdded }) => {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/tasks/add', 
        { titre, description },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      setTitre('');
      setDescription('');
      onTacheAdded(response.data);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la tâche:', error);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Ajouter une nouvelle tâche</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="titre" className="form-label">Titre</label>
            <input
              type="text"
              className="form-control"
              id="titre"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              className="form-control"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTache;