import React, { useEffect, useState } from 'react';
import { db, auth } from '../services/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const fetchProfile = async () => {
                    try {
                        const docRef = doc(db, 'users', user.uid);
                        const docSnap = await getDoc(docRef);
                        if (docSnap.exists()) {
                            setProfile(docSnap.data());
                        } else {
                            const newProfile = {
                                name: user.displayName || 'Anonymous',
                                bio: '',
                                avatar: user.photoURL || 'https://via.placeholder.com/150',
                                createdAt: new Date(),
                            };
                            await setDoc(docRef, newProfile);
                            setProfile(newProfile);
                        }
                        setLoading(false);
                    } catch (error) {
                        console.error('Profile fetch error:', error);
                        setError('Profil bilgileri alınırken bir hata oluştu.');
                        setLoading(false);
                    }
                };
                fetchProfile();
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const updateProfile = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const docRef = doc(db, 'users', user.uid);

                console.log('Güncellenen profil:', profile);
                await updateDoc(docRef, profile);
                alert('Profil güncellendi!');
            } else {
                setError('Kullanıcı bulunamadı.');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            setError('Profil güncellenirken bir hata oluştu.');
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    if (loading) return <div>Yükleniyor...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!profile) return <div>Lütfen giriş yapın.</div>;

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold mb-4">Profiliniz</h1>
            <div className="flex flex-col items-center mb-6">
                <img
                    src={profile.avatar || 'https://via.placeholder.com/150'}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full mb-4"
                />
                <p className="text-xl font-medium">{profile.name}</p>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">İsim</label>
                    <input
                        type="text"
                        name="name"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        value={profile.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea
                        name="bio"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-32"
                        value={profile.bio}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
                    <input
                        type="text"
                        name="avatar"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        value={profile.avatar}
                        onChange={handleChange}
                    />
                </div>
                <button
                    onClick={updateProfile}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
                >
                    Profil Güncelle
                </button>
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors mt-4"
                >
                    Çıkış Yap
                </button>
            </div>
        </div>
    );
}

export default Profile;
