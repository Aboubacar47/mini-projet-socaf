import { useState, useEffect } from 'react';
import { updateArticle, getCategories, createCategorie } from '../services/api';
import { ToastSuccess, ToastError } from '../controllers/toast';

const UpdateArticle = ({ article, onClose, onSuccess }) => {
  const [libelle, setLibelle] = useState('');
  const [prixAchat, setPrixAchat] = useState('');
  const [prixVente, setPrixVente] = useState('');
  const [quantite, setQuantite] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [categorieId, setCategorieId] = useState('');
  const [categories, setCategories] = useState([]);
  const [showNewCategorie, setShowNewCategorie] = useState(false);
  const [newCategorieName, setNewCategorieName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  useEffect(() => {
    if (article) {
      setLibelle(article.libelle || '');
      setPrixAchat(article.prixAchat || '');
      setPrixVente(article.prixVente || '');
      setQuantite(article.quantite || 0);
      setCurrentImage(article.image || '');
      setCategorieId(article.categorieId?._id || article.categorieId || '');
    }
  }, [article]);

  const handleAddCategorie = async () => {
    if (!newCategorieName.trim()) {
      ToastError('Veuillez entrer un nom de catégorie');
      return;
    }

    try {
      const response = await createCategorie({ nom: newCategorieName });
      if (response.message === "Catégorie ajoutée avec succès") {
        ToastSuccess(response.message);
        setNewCategorieName('');
        setShowNewCategorie(false);
        await fetchCategories();
      } else {
        ToastError(response.message);
      }
    } catch (error) {
      console.error('Erreur:', error);
      ToastError('Erreur lors de l\'ajout de la catégorie');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('libelle', libelle);
      formData.append('prixAchat', parseFloat(prixAchat));
      formData.append('prixVente', parseFloat(prixVente));
      formData.append('quantite', parseInt(quantite) || 0);
      if (imageFile) {
        formData.append('image', imageFile);
      }
      if (categorieId) {
        formData.append('categorieId', categorieId);
      }

      const response = await updateArticle(article._id, formData);
      
      if (response.message === "Article modifié avec succès") {
        ToastSuccess(response.message);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        ToastError(response.message);
      }
    } catch (error) {
      console.error('Erreur lors de la modification de l\'article:', error);
      ToastError('Erreur lors de la modification de l\'article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Modifier l'article</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit} id="updateForm">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="libelle" className="form-label">Libellé *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="libelle"
                    value={libelle}
                    onChange={(e) => setLibelle(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="categorieId" className="form-label">Catégorie</label>
                  <div className="input-group">
                    <select
                      className="form-select"
                      id="categorieId"
                      value={categorieId}
                      onChange={(e) => setCategorieId(e.target.value)}
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>
                          {cat.nom}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowNewCategorie(!showNewCategorie)}
                    >
                      +
                    </button>
                  </div>
                  {showNewCategorie && (
                    <div className="input-group mt-2">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Nouvelle catégorie"
                        value={newCategorieName}
                        onChange={(e) => setNewCategorieName(e.target.value)}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-success"
                        onClick={handleAddCategorie}
                      >
                        Ajouter
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-12 mb-3">
                  <label htmlFor="image" className="form-label">Image</label>
                  {currentImage && (
                    <div className="mb-2">
                      <small className="text-muted">Image actuelle: {currentImage}</small>
                    </div>
                  )}
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    accept="image/*"
                  />
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label htmlFor="prixAchat" className="form-label">Prix d'achat *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    id="prixAchat"
                    value={prixAchat}
                    onChange={(e) => setPrixAchat(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="prixVente" className="form-label">Prix de vente *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    id="prixVente"
                    value={prixVente}
                    onChange={(e) => setPrixVente(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="quantite" className="form-label">Quantité</label>
                  <input
                    type="number"
                    className="form-control"
                    id="quantite"
                    value={quantite}
                    onChange={(e) => setQuantite(e.target.value)}
                    min="0"
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </button>
            <button 
              type="submit"
              form="updateForm"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fa fa-spin fa-spinner"></i> Modification en cours...
                </>
              ) : (
                'Enregistrer les modifications'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateArticle;
