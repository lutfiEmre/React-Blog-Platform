
import React, { useState } from 'react';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (error) {
            console.error('Error logging in:', error);

            switch (error.code) {
                case 'auth/user-not-found':
                    setError('Bu email ile kullanıcı bulunamadı.');
                    break;
                case 'auth/wrong-password':
                    setError('Yanlış şifre.');
                    break;
                case 'auth/invalid-email':
                    setError('Geçersiz email adresi.');
                    break;
                default:
                    setError('Giriş yapılamadı. Lütfen tekrar deneyin.');
            }
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Giriş Yap</h2>
            {error && (
                <div className="mb-4 text-red-500">
                    {error}
                </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Email adresinizi girin"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Şifre</label>
                    <input
                        type="password"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Şifrenizi girin"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
                >
                    Giriş Yap
                </button>
            </form>
            <p className="mt-4 text-center">
                Hesabınız yok mu? <Link to="/signup" className="text-blue-600 hover:underline">Kayıt Ol</Link>
            </p>
        </div>
    );
}

export default Login;
