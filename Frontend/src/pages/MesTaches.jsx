import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddTache from '../components/AddTache';
import ListeTaches from '../components/ListeTaches';

const MesTaches = () => {


  return (
    <div className="container mt-4">
      <h2 className="mb-4">Gestionnaire de Tâches</h2>
      <div className="row">
        <div className="col-md-12">
          <AddTache  />
          <ListeTaches  />
        </div>
      </div>
    </div>
  );
};

export default MesTaches;