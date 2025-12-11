import { useState, useEffect } from 'react';
import { createArticle, getCategories, createCategorie } from '../services/api';
import { ToastSuccess, ToastError } from '../controllers/toast';

const AddArticle = ({ onArticleAdded }) => {
  const [libelle, setLibelle] = useState('');
  const [prixAchat, setPrixAchat] = useState('');
  const [prixVente, setPrixVente] = useState('');
  const [quantite, setQuantite] = useState('');
  const [image, setImage] = useState('');
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
      
      const articleData = {
        libelle,
        prixAchat: parseFloat(prixAchat),
        prixVente: parseFloat(prixVente),
        quantite: parseInt(quantite) || 0,
        image: image || '',
        categorieId: categorieId || undefined,
      };

      const response = await createArticle(articleData);
      
      if (response.message === "Article ajouté avec succès") {
        ToastSuccess(response.message);
        
        // Réinitialiser le formulaire
        setLibelle('');
        setPrixAchat('');
        setPrixVente('');
        setQuantite('');
        setImage('');
        setCategorieId('');
        
        // Notifier le parent
        if (onArticleAdded) {
          onArticleAdded();
        }
      } else {
        ToastError(response.message);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'article:', error);
      ToastError('Erreur lors de l\'ajout de l\'article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Ajouter un nouvel article</h5>
        <form onSubmit={handleSubmit}>
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
              <label htmlFor="image" className="form-label">URL Image</label>
              <input
                type="text"
                className="form-control"
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
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
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fa fa-spin fa-spinner"></i> Ajout en cours...
              </>
            ) : (
              'Ajouter l\'article'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddArticle;
