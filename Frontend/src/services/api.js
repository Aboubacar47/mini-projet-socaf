import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Utilisateurs
export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data.data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return [];
  }
};

export const updateUserPermissions = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/update-permissions/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour des permissions:', error);
    throw error;
  }
};

// Articles
export const getArticles = async () => {
  try {
    const response = await axios.get(`${API_URL}/articles`);
    return response.data.data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
    return [];
  }
};

export const createArticle = async (articleData) => {
  try {
    const response = await axios.post(`${API_URL}/new-article`, articleData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de l\'article:', error);
    throw error;
  }
};

export const updateArticle = async (id, articleData) => {
  try {
    const response = await axios.put(`${API_URL}/update-article/${id}`, articleData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'article:', error);
    throw error;
  }
};

export const deleteArticle = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/delete-article/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'article:', error);
    throw error;
  }
};

// Catégories
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data.data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return [];
  }
};

export const createCategorie = async (categorieData) => {
  try {
    const response = await axios.post(`${API_URL}/new-categorie`, categorieData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error);
    throw error;
  }
};

export const updateCategorie = async (id, categorieData) => {
  try {
    const response = await axios.put(`${API_URL}/update-categorie/${id}`, categorieData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la catégorie:', error);
    throw error;
  }
};

export const deleteCategorie = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/delete-categorie/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error);
    throw error;
  }
};
