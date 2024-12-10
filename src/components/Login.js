import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login, handleDiscordLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            handleDiscordLogin(token);
            navigate('/');
        }
    }, [handleDiscordLogin, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData.email, formData.password);
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const handleDiscordLoginButton = () => {
        window.location.href = 'https://doginal-drc-20-drops-backend.onrender.com/api/auth/discord';
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Submit</button>
                        or
                <button
                    type="button"
                    onClick={handleDiscordLoginButton}
                    className="discord-login-button"
                >
                    Login with Discord
                </button>
            </form>
        </div>
    );
};

export default Login;
