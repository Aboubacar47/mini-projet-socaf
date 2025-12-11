import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, createCategorie, updateCategorie, deleteCategorie } from '../services/api';
import { ToastSuccess, ToastError } from '../controllers/toast';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const MesCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategorie, setEditingCategorie] = useState(null);
  const [categorieName, setCategorieName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const user = JSON.parse(token);
    const hasPermission = user.role === 'admin' || user.permissions?.canManageCategories;
    
    if (!hasPermission) {
      ToastError('Vous n\'avez pas les permissions pour gérer les catégories');
      navigate('/mes-articles');
      return;
    }

    fetchCategories();
  }, [navigate]);

  const handleOpenModal = (categorie = null) => {
    setEditingCategorie(categorie);
    setCategorieName(categorie ? categorie.nom : '');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategorie(null);
    setCategorieName('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!categorieName.trim()) {
      ToastError('Veuillez entrer un nom de catégorie');
      return;
    }

    try {
      setSubmitting(true);
      
      let response;
      if (editingCategorie) {
        response = await updateCategorie(editingCategorie._id, { nom: categorieName });
      } else {
        response = await createCategorie({ nom: categorieName });
      }

      if (response.message.includes('succès')) {
        ToastSuccess(response.message);
        handleCloseModal();
        await fetchCategories();
      } else {
        ToastError(response.message);
      }
    } catch (error) {
      console.error('Erreur:', error);
      ToastError('Une erreur est survenue');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      return;
    }

    try {
      const response = await deleteCategorie(id);
      
      if (response.message === "Catégorie supprimée avec succès") {
        ToastSuccess(response.message);
        await fetchCategories();
      } else {
        ToastError(response.message);
      }
    } catch (error) {
      console.error('Erreur:', error);
      ToastError('Erreur lors de la suppression');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestion des Catégories</h2>
        <div>
          <button className="btn btn-primary me-2" onClick={() => navigate('/mes-articles')}>
            Retour aux Articles
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">Liste des catégories</h5>
            <button className="btn btn-success" onClick={() => handleOpenModal()}>
              <FaPlus /> Nouvelle catégorie
            </button>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : categories.length === 0 ? (
            <div className="alert alert-info">Aucune catégorie trouvée</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th width="150">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(categorie => (
                    <tr key={categorie._id}>
                      <td>{categorie.nom}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => handleOpenModal(categorie)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(categorie._id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingCategorie ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCloseModal}
                  disabled={submitting}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="categorieName" className="form-label">Nom de la catégorie *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="categorieName"
                      value={categorieName}
                      onChange={(e) => setCategorieName(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleCloseModal}
                    disabled={submitting}
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <i className="fa fa-spin fa-spinner"></i> Enregistrement...
                      </>
                    ) : (
                      'Enregistrer'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MesCategories;
