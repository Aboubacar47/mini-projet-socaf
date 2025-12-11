import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, updateUserPermissions } from '../services/api';
import { ToastSuccess, ToastError } from '../controllers/toast';
import { FaEdit, FaUserSlash, FaUserCheck } from 'react-icons/fa';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [permissions, setPermissions] = useState({
    canAddArticle: false,
    canEditArticle: false,
    canDeleteArticle: false,
    canManageCategories: false
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('token'));
    if (!token || token.role !== 'admin') {
      ToastError('Accès refusé. Réservé aux administrateurs.');
      navigate('/mes-articles');
      return;
    }
    
    fetchUsers();
  }, [navigate]);

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setPermissions(user.permissions || {
      canAddArticle: false,
      canEditArticle: false,
      canDeleteArticle: false,
      canManageCategories: false
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handlePermissionChange = (permission) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: !prev[permission]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      const response = await updateUserPermissions(selectedUser._id, { permissions });

      if (response.message === "Permissions mises à jour avec succès") {
        ToastSuccess(response.message);
        handleCloseModal();
        await fetchUsers();
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

  const handleToggleActive = async (user) => {
    const action = user.active ? 'désactiver' : 'activer';
    
    if (!window.confirm(`Êtes-vous sûr de vouloir ${action} ce compte ?`)) {
      return;
    }

    try {
      const response = await updateUserPermissions(user._id, { active: !user.active });
      
      if (response.message === "Permissions mises à jour avec succès") {
        ToastSuccess(`Compte ${user.active ? 'désactivé' : 'activé'} avec succès`);
        await fetchUsers();
      } else {
        ToastError(response.message);
      }
    } catch (error) {
      console.error('Erreur:', error);
      ToastError('Erreur lors de la modification du compte');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Administration - Gestion des Utilisateurs</h2>
        <div>
          <button className="btn btn-outline-primary me-2" onClick={() => navigate('/mes-articles')}>
            Retour aux Articles
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-4">Liste des utilisateurs</h5>

          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="alert alert-info">Aucun utilisateur trouvé</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Nom d'utilisateur</th>
                    <th>Rôle</th>
                    <th>Statut</th>
                    <th>Permissions</th>
                    <th width="200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} className={!user.active ? 'table-secondary' : ''}>
                      <td>{user.username}</td>
                      <td>
                        <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        {user.active ? (
                          <span className="badge bg-success">Actif</span>
                        ) : (
                          <span className="badge bg-secondary">Désactivé</span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-1">
                          {user.permissions?.canAddArticle && (
                            <span className="badge bg-info" title="Ajouter article">Add</span>
                          )}
                          {user.permissions?.canEditArticle && (
                            <span className="badge bg-warning" title="Modifier article">Edit</span>
                          )}
                          {user.permissions?.canDeleteArticle && (
                            <span className="badge bg-danger" title="Supprimer article">Del</span>
                          )}
                          {user.permissions?.canManageCategories && (
                            <span className="badge bg-primary" title="Gérer catégories">Cat</span>
                          )}
                          {!user.permissions?.canAddArticle && 
                           !user.permissions?.canEditArticle && 
                           !user.permissions?.canDeleteArticle && 
                           !user.permissions?.canManageCategories && (
                            <span className="text-muted small">Aucune</span>
                          )}
                        </div>
                      </td>
                      <td>
                        {user.role !== 'admin' && (
                          <>
                            <button
                              className="btn btn-sm btn-primary me-2"
                              onClick={() => handleOpenModal(user)}
                              title="Gérer les permissions"
                            >
                              <FaEdit /> Permissions
                            </button>
                            <button
                              className={`btn btn-sm ${user.active ? 'btn-warning' : 'btn-success'}`}
                              onClick={() => handleToggleActive(user)}
                              title={user.active ? 'Désactiver' : 'Activer'}
                            >
                              {user.active ? <FaUserSlash /> : <FaUserCheck />}
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal des permissions */}
      {showModal && selectedUser && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Permissions de {selectedUser.username}
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
                  <p className="text-muted mb-3">
                    Sélectionnez les permissions à accorder à cet utilisateur :
                  </p>
                  
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="canAddArticle"
                      checked={permissions.canAddArticle}
                      onChange={() => handlePermissionChange('canAddArticle')}
                    />
                    <label className="form-check-label" htmlFor="canAddArticle">
                      <strong>Ajouter des articles</strong>
                      <br />
                      <small className="text-muted">Permet de créer de nouveaux articles</small>
                    </label>
                  </div>

                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="canEditArticle"
                      checked={permissions.canEditArticle}
                      onChange={() => handlePermissionChange('canEditArticle')}
                    />
                    <label className="form-check-label" htmlFor="canEditArticle">
                      <strong>Modifier des articles</strong>
                      <br />
                      <small className="text-muted">Permet de modifier les articles existants</small>
                    </label>
                  </div>

                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="canDeleteArticle"
                      checked={permissions.canDeleteArticle}
                      onChange={() => handlePermissionChange('canDeleteArticle')}
                    />
                    <label className="form-check-label" htmlFor="canDeleteArticle">
                      <strong>Supprimer des articles</strong>
                      <br />
                      <small className="text-muted">Permet de supprimer des articles</small>
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="canManageCategories"
                      checked={permissions.canManageCategories}
                      onChange={() => handlePermissionChange('canManageCategories')}
                    />
                    <label className="form-check-label" htmlFor="canManageCategories">
                      <strong>Gérer les catégories</strong>
                      <br />
                      <small className="text-muted">Permet d'ajouter, modifier et supprimer des catégories</small>
                    </label>
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

export default AdminUsers;
