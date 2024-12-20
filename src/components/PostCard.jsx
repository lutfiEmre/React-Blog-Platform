import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

function PostCard({ post }) {
    const [author, setAuthor] = useState(null);

    useEffect(() => {
        const fetchAuthor = async () => {
            if (post.author?.id) {
                try {
                    const docRef = doc(db, 'users', post.author.id);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setAuthor(docSnap.data());
                    } else {
                        console.error('Yazar bilgisi bulunamadı!');
                    }
                } catch (err) {
                    console.error('Yazar bilgisi alınırken bir hata oluştu:', err);
                }
            }
        };

        fetchAuthor();
    }, [post.author?.id]);

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">
                    <Link to={`/post/${post.id}`} className="text-blue-600 hover:underline">
                        {post.title}
                    </Link>
                </h2>
                <p className="text-gray-600 mb-2">
                    Category: <Link to={`/category/${post.category}`} className="text-blue-500 hover:underline">{post.category}</Link>
                </p>
                <p className="text-gray-800">{post.content.substring(0, 100)}...</p>
            </div>
            <div className="bg-gray-100 p-4 flex items-center">
                <Link to={`/author/${post.author?.id}`} className="flex items-center hover:underline">
                    {author?.avatar ? (
                        <img
                            src={author.avatar}
                            alt={author.name || 'Unknown Author'}
                            className="w-10 h-10 rounded-full mr-3"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
                    )}
                    <div>
                        <p className="text-gray-700 font-medium">{author?.name || 'Unknown Author'}</p>
                    </div>
                </Link>
                <p className="text-gray-500 text-sm ml-4">
                    Posted on {post.createdAt?.toDate().toLocaleDateString() || 'No Date'}
                </p>
            </div>
        </div>
    );
}

export default PostCard;
