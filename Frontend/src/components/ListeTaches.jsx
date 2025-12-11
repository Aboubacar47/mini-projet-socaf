import { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import UpdateTache from './UpdateTache';

const ListeTaches = () => {
  const [taches] = useState([]);


  return (
    <div className="mt-4">
      <h3>Mes Tâches</h3>
      {taches.length === 0 ? (
        <p className="text-muted">Aucune tâche trouvée</p>
      ) : (
        <div className="row">
          {taches.map(tache => (
            <div key={tache._id} className="col-md-6 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{tache.titre}</h5>
                  <p className="card-text">{tache.description}</p>
                  <div className="d-flex justify-content-end">
                    <button className="btn btn-primary me-2">
                      <FaEdit /> Modifier
                    </button>
                    <button className="btn btn-danger">
                      <FaTrash /> Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
};

export default ListeTaches;