
import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import PostCard from '../components/PostCard';
import { useParams } from 'react-router-dom';

function Category() {
    const { name } = useParams();
    const [posts, setPosts] = useState([]);
    const [categoryExists, setCategoryExists] = useState(true);

    useEffect(() => {
        if (!name) return;

        const q = query(collection(db, 'posts'), where('category', '==', name));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const postsData = [];
            querySnapshot.forEach((doc) => {
                postsData.push({ id: doc.id, ...doc.data() });
            });
            setPosts(postsData);
            setCategoryExists(querySnapshot.size > 0);
        });

        return () => unsubscribe();
    }, [name]);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Category: {name}</h1>
            {categoryExists ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            ) : (
                <p className="text-gray-600">No posts found under this category.</p>
            )}
        </div>
    );
}

export default Category;
