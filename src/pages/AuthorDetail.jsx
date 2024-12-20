import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

function AuthorDetail() {
    const { authorId } = useParams();
    const [author, setAuthor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAuthor = async () => {
            try {
                const docRef = doc(db, 'users', authorId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setAuthor(docSnap.data());
                } else {
                    setError('Yazar bilgisi bulunamadı.');
                }
            } catch (err) {
                console.error('Error fetching author:', err);
                setError('Yazar bilgisi alınırken bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        };

        fetchAuthor();
    }, [authorId]);

    if (loading) return <div>Yükleniyor...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!author) return <div>Yazar bilgisi bulunamadı.</div>;

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-6">
                {author.avatar ? (
                    <img
                        src={author.avatar}
                        alt={author.name}
                        className="w-20 h-20 rounded-full mr-4"
                    />
                ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-300 mr-4 flex items-center justify-center text-white">
                        ?
                    </div>
                )}
                <div>
                    <h1 className="text-2xl font-bold mb-2">{author.name}</h1>
                    <p className="text-gray-600">{author.bio || 'Yazarın bir biyografisi yok.'}</p>
                </div>
            </div>
            <p className="text-gray-800">Bu yazar hakkında daha fazla bilgi burada yer alabilir.</p>
        </div>
    );
}

export default AuthorDetail;