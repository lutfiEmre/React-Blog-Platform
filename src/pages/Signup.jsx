
import React, { useState } from 'react';
import { auth, db } from '../services/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password || !displayName) {
            setError('Lütfen tüm alanları doldurun.');
            return;
        }

        try {
            // Kullanıcı oluşturma
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: displayName,
                photoURL: 'https://via.placeholder.com/150' // Varsayılan avatar
            });


            await setDoc(doc(db, 'users', user.uid), {
                name: displayName,
                bio: '',
                avatar: user.photoURL,
                createdAt: new Date()
            });


            navigate('/profile');
        } catch (error) {
            console.error('Signup Error:', error);
            setError('Hesap oluşturulamadı. Lütfen tekrar deneyin.');
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Kayıt Ol</h2>
            {error && <div className="mb-4 text-red-500">{error}</div>}
            <form onSubmit={handleSignup} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">İsim</label>
                    <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                        placeholder="İsminizi girin"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">E-posta</label>
                    <input
                        type="email"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="E-posta adresinizi girin"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Şifre</label>
                    <input
                        type="password"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Şifrenizi girin"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                >
                    Kayıt Ol
                </button>
            </form>
        </div>
    );
}

export default Signup;
