import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores';
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import './Auth.scss';

const Login = () => {
    const navigate = useNavigate();
    const { login, register, loading, error } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = isRegister
            ? await register(email, password)
            : await login(email, password);
        if (success) navigate('/');
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h2>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
                        <p className="auth-subtitle">
                            {isRegister ? 'Start your SQL learning journey today.' : 'Log in to continue practicing.'}
                        </p>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label>Email Address</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
                        <button className="btn-primary" type="submit" disabled={loading}>
                            {isRegister ? <UserPlus size={18} /> : <LogIn size={18} />}
                            {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
                        </button>
                    </form>

                    <div className="auth-toggle">
                        <p>
                            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
                            <button onClick={() => setIsRegister(!isRegister)} type="button">
                                {isRegister ? 'Log In' : 'Sign Up'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
