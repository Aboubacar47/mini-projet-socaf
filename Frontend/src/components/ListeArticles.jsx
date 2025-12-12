import { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import UpdateArticle from './UpdateArticle';
import { deleteArticle } from '../services/api';
import { ToastSuccess, ToastError } from '../controllers/toast';

const ListeArticles = ({ articles, onArticleUpdated, onArticleDeleted, canEdit = true, canDelete = true }) => {
  const [articleToUpdate, setArticleToUpdate] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }

    try {
      setDeleting(id);
      const response = await deleteArticle(id);
      
      if (response.message === "Article supprimé avec succès") {
        ToastSuccess(response.message);
        if (onArticleDeleted) {
          onArticleDeleted();
        }
      } else {
        ToastError(response.message);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      ToastError('Erreur lors de la suppression de l\'article');
    } finally {
      setDeleting(null);
    }
  };

  const handleUpdateClick = (article) => {
    setArticleToUpdate(article);
  };

  const handleUpdateClose = () => {
    setArticleToUpdate(null);
  };

  const handleUpdateSuccess = () => {
    setArticleToUpdate(null);
    if (onArticleUpdated) {
      onArticleUpdated();
    }
  };

  return (
    <div className="mt-4">
      <h3>Liste des Articles</h3>
      {articles.length === 0 ? (
        <div className="alert alert-info">Aucun article trouvé</div>
      ) : (
        <div className="row">
          {articles.map(article => (
            <div key={article._id} className="col-md-6 col-lg-4 mb-3">
              <div className="card h-100">
                {article.image && (
                  <img 
                    src={`http://localhost:5000/uploads/${article.image}`} 
                    className="card-img-top" 
                    alt={article.libelle}
                    style={{ height: '180px', objectFit: 'contain', backgroundColor: '#f8f9fa', padding: '10px' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{article.libelle}</h5>
                  {article.categorieId && (
                    <p className="text-muted small mb-2">
                      <strong>Catégorie:</strong> {article.categorieId.nom}
                    </p>
                  )}
                  <div className="mb-2">
                    <span className="badge bg-success me-2">
                      Prix achat: {article.prixAchat} FCFA
                    </span>
                    <span className="badge bg-primary">
                      Prix vente: {article.prixVente} FCFA
                    </span>
                  </div>
                  <p className="card-text">
                    <strong>Quantité:</strong> {article.quantite || 0}
                  </p>
                  <p className="card-text text-muted small">
                    <strong>Marge:</strong> {(article.prixVente - article.prixAchat).toFixed(2)} FCFA
                  </p>
                </div>
                <div className="card-footer d-flex justify-content-end gap-2">
                  {canEdit && (
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={() => handleUpdateClick(article)}
                    >
                      <FaEdit /> Modifier
                    </button>
                  )}
                  {canDelete && (
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(article._id)}
                      disabled={deleting === article._id}
                    >
                      {deleting === article._id ? (
                        <><i className="fa fa-spin fa-spinner"></i></>
                      ) : (
                        <><FaTrash /> Supprimer</>
                      )}
                    </button>
                  )}
                  {!canEdit && !canDelete && (
                    <span className="text-muted small">Lecture seule</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {articleToUpdate && (
        <UpdateArticle
          article={articleToUpdate}
          onClose={handleUpdateClose}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default ListeArticles;
