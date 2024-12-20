import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import { collection, addDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    const userDocRef = doc(db, 'users', currentUser.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        setUserProfile(userDocSnap.data());
                    } else {
                        console.error('Kullanıcı profili bulunamadı!');
                    }
                } catch (err) {
                    console.error('Kullanıcı profil bilgileri alınırken bir hata oluştu:', err);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!title || !content || !category) {
            setError('Lütfen tüm alanları doldurun.');
            return;
        }

        if (!userProfile) {
            setError('Yazar bilgileri alınamadı. Lütfen tekrar deneyin.');
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, 'posts'), {
                title,
                content,
                category,
                author: {
                    id: auth.currentUser.uid,
                    name: userProfile.name,
                    avatar: userProfile.avatar,
                },
                createdAt: serverTimestamp(),

            });
            navigate('/');
        } catch (err) {
            console.error('Gönderi eklenirken hata:', err);
            setError('Gönderi oluşturulamadı. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Yeni Gönderi Oluştur</h2>
            {error && <div className="mb-4 text-red-500">{error}</div>}
            {loading ? (
                <div>Yükleniyor...</div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Başlık</label>
                        <input
                            type="text"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">İçerik</label>
                        <textarea
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 h-40"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Kategori</label>
                        <select
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="">Kategori Seçin</option>
                            <option value="Technology">Technology</option>
                            <option value="Lifestyle">Lifestyle</option>
                            <option value="Education">Education</option>
                            <option value="Health">Health</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                    >
                        Yayınla
                    </button>
                </form>
            )}
        </div>
    );
}

export default CreatePost;
