import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddArticle from '../components/AddArticle';
import ListeArticles from '../components/ListeArticles';
import { getArticles } from '../services/api';

const MesArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPermissions, setUserPermissions] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const data = await getArticles();
      setArticles(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Vérifier l'authentification
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    
    // Récupérer les permissions de l'utilisateur
    const user = JSON.parse(token);
    const permissions = user.permissions || {};
    const userRole = user.role || 'user';
    
    setUserPermissions(permissions);
    setIsAdmin(userRole === 'admin');
    
    console.log('User:', user);
    console.log('Permissions:', permissions);
    console.log('Is Admin:', userRole === 'admin');
    
    fetchArticles();
  }, [navigate]);

  const handleArticleAdded = () => {
    fetchArticles();
  };

  const handleArticleUpdated = () => {
    fetchArticles();
  };

  const handleArticleDeleted = () => {
    fetchArticles();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestion des Articles</h2>
        <div>
          {(isAdmin || userPermissions.canManageCategories) && (
            <button className="btn btn-outline-primary me-2" onClick={() => navigate('/mes-categories')}>
              Gérer les catégories
            </button>
          )}
          {isAdmin && (
            <button className="btn btn-outline-danger me-2" onClick={() => navigate('/admin/users')}>
              Admin Utilisateurs
            </button>
          )}
          <button className="btn btn-danger" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          {(isAdmin || userPermissions.canAddArticle) && (
            <AddArticle onArticleAdded={handleArticleAdded} />
          )}
          {loading ? (
            <div className="text-center mt-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : (
            <ListeArticles 
              articles={articles}
              onArticleUpdated={handleArticleUpdated}
              onArticleDeleted={handleArticleDeleted}
              canEdit={isAdmin || userPermissions.canEditArticle}
              canDelete={isAdmin || userPermissions.canDeleteArticle}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MesArticles;
