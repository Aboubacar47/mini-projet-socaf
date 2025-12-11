import { useState } from 'react';
import axios from 'axios';

const UpdateTache = ({ tache, onUpdate, onClose }) => {
  const [titre, setTitre] = useState(tache.titre);
  const [description, setDescription] = useState(tache.description);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/tasks/update/${tache._id}`,
        { titre, description },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la modification de la tâche:', error);
    }
  };

  return (
    <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Modifier la tâche</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
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
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateTache;