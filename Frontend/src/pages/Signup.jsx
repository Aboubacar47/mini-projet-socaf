import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignUpSubmit } from '../controllers/SignupSubmit';
import { Bounce, ToastContainer } from 'react-toastify';

const Signup = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [load, setLoad] = useState(false);
  const route = useNavigate();

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Inscription</h2>
              <form onSubmit={(e) => SignUpSubmit(e, username, password, role, setLoad, route)}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Nom d'utilisateur</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Mot de passe</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">Rôle</label>
                  <select
                    className="form-select"
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="user">Utilisateur</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
                <button type={!load ? "submit" : "button"} disabled={!load ? false : true} className="btn btn-primary w-100">
                    {!load ? (
                        <span>S'inscrire</span>
                    ): (
                      <><i className="fa fa-spin fa-spinner"></i> En cours de traitement...</>
                    )}
                </button>
              </form>
              <div className="text-center mt-3">
                <p>
                  Déjà un compte ?{' '}
                  <Link to="/">Se connecter</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;