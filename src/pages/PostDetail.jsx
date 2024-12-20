
import React, { useEffect, useState } from 'react';
import { db, auth } from '../services/firebase';
import {
    doc,
    getDoc,
    addDoc,
    collection,
    serverTimestamp,
    onSnapshot,
} from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchPostWithAuthor = async () => {
            try {
                const docRef = doc(db, 'posts', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const postData = { id: docSnap.id, ...docSnap.data() };


                    if (postData.author?.id) {
                        const authorRef = doc(db, 'users', postData.author.id);
                        const authorSnap = await getDoc(authorRef);
                        postData.author = authorSnap.exists() ? authorSnap.data() : postData.author;
                    }

                    setPost(postData);
                } else {
                    setError('Gönderi bulunamadı.');
                }
            } catch (err) {
                console.error('Error fetching post with author:', err);
                setError('Gönderi alınırken bir hata oluştu: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPostWithAuthor();
    }, [id]);


    useEffect(() => {
        const fetchCommentsWithUsers = async () => {
            const commentsRef = collection(db, 'posts', id, 'comments');

            const unsubscribe = onSnapshot(commentsRef, async (snapshot) => {
                try {
                    const comments = snapshot.docs.map((doc) => {
                        const data = doc.data();
                        if (!data || !data.userId || !data.comment) {
                            console.warn('Geçersiz yorum verisi:', data);
                            return null;
                        }
                        return {
                            id: doc.id,
                            ...data,
                        };
                    }).filter(Boolean);

                    console.log('Fetched Comments:', comments);

                    const userIds = [...new Set(comments.map((comment) => comment.userId))];

                    console.log('Unique User IDs:', userIds);

                    const userDocs = await Promise.all(
                        userIds.map(async (userId) => {
                            const userDocRef = doc(db, 'users', userId);
                            const userDocSnap = await getDoc(userDocRef);
                            return { userId, ...(userDocSnap.exists() ? userDocSnap.data() : {}) };
                        })
                    );

                    const userMap = userDocs.reduce((acc, user) => {
                        acc[user.userId] = user;
                        return acc;
                    }, {});

                    console.log('User Map:', userMap);

                    const enrichedComments = comments.map((comment) => ({
                        ...comment,
                        username: userMap[comment.userId]?.name || 'Anonymous',
                        avatar: userMap[comment.userId]?.avatar || 'https://via.placeholder.com/150',
                    }));

                    console.log('Enriched Comments:', enrichedComments);

                    setComments(enrichedComments);
                } catch (err) {
                    console.error('Error fetching comments with user data:', err);
                    setError('Yorumlar alınırken bir hata oluştu.');
                }
            });

            return unsubscribe;
        };

        fetchCommentsWithUsers();
    }, [id]);


    const addComment = async () => {
        if (comment.trim() === '') return;
        if (!user) {
            alert('Yorum yapabilmek için giriş yapmalısınız.');
            return;
        }

        try {
            console.log('Yorum ekleniyor:', {
                userId: user.uid,
                username: user.displayName || 'Anonymous',
                comment,
            });

            const commentsRef = collection(db, 'posts', id, 'comments');
            await addDoc(commentsRef, {
                userId: user.uid,
                username: user.displayName || 'Anonymous',
                comment,
                createdAt: serverTimestamp(),
            });

            setComment('');
        } catch (err) {
            console.error('Error adding comment:', err);
            setError('Yorum eklenirken bir hata oluştu: ' + err.message);
        }
    };

    if (loading) return <div>Yükleniyor...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!post) return <div>Gönderi bulunamadı.</div>;

    return (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center mb-4">
                {post.author?.avatar ? (
                    <img
                        src={post.author.avatar}
                        alt={post.author.name || 'Yazar Avatarı'}
                        className="w-12 h-12 rounded-full mr-4"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 flex items-center justify-center text-white">
                        ?
                    </div>
                )}
                <div>
                    <p className="text-lg font-medium">{post.author?.name || 'Bilinmeyen Yazar'}</p>
                    <p className="text-gray-500">
                        Posted on {post.createdAt?.toDate().toLocaleDateString() || 'Tarih Bilgisi Yok'}
                    </p>
                </div>
            </div>
            <p className="text-gray-800 mb-6">{post.content}</p>
            <hr className="my-6" />
            <h3 className="text-2xl font-semibold mb-4">Yorumlar</h3>
            <div className="space-y-4 mb-6">
                {comments.length > 0 ? (
                    comments.map((c) => (
                        <div key={c.id} className="p-4 bg-gray-100 rounded">
                            <div className="flex items-center mb-2">
                                <img
                                    src={c.avatar}
                                    alt={c.username}
                                    className="w-8 h-8 rounded-full mr-2"
                                />
                                <p className="text-gray-800 font-medium">{c.username}</p>
                            </div>
                            <p className="text-gray-800">{c.comment}</p>
                            <p className="text-gray-500 text-sm">
                                On: {c.createdAt?.toDate().toLocaleDateString() || 'Tarih Bilgisi Yok'}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-600">Henüz yorum yok.</p>
                )}
            </div>
            <div className="flex flex-col">
                <textarea
                    className="border border-gray-300 rounded-md p-2 mb-2"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Yorum bırakın..."
                    rows="4"
                ></textarea>
                <button
                    onClick={addComment}
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                >
                    Yorum Gönder
                </button>
            </div>
        </div>
    );
}

export default PostDetail;
