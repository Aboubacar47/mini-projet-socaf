import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginSubmit } from '../controllers/LoginSubmit';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [load, setLoad] = useState(false);
    const route = useNavigate();

    const [testUser, setTestUser] = useState(true)

    useEffect(() => {
        const checkAuth = () => {
            const token = JSON.parse(localStorage.getItem('token')) || null;
            if (!token) {
                setTestUser(false)
            } else {
                route("/mes-articles")
            }
        };
        
        checkAuth()
    }, [route])

    return (
        <>
            {testUser ? (
                <div className='d-flex justify-content-center align-items-center vh-100 w-100'>
                    <h2><i className="fa fa-spin fa-spinner"></i></h2>
                </div>
            ) : (
                <div className="container">
                    <div className="row justify-content-center mt-5">
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-body">
                                    <h2 className="text-center mb-4">Connexion</h2>
                                    <form onSubmit={(e) => LoginSubmit(e, username, password, setLoad, route)}>
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
                                        <button type={!load ? "submit" : "button"} disabled={!load ? false : true} className="btn btn-primary w-100">
                                            {!load ? (
                                                <span> Se connecter</span>
                                            ) : (
                                                <><i className="fa fa-spin fa-spinner"></i> En cours de traitement...</>
                                            )}
                                        </button>
                                    </form>
                                    <div className="text-center mt-3">
                                        <p>
                                            Pas encore de compte ?{' '}
                                            <Link to="/signup">S'inscrire</Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Login;