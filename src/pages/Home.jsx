
import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';

function Home() {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        let q;

        if (currentCategory && searchQuery) {
            q = query(
                collection(db, 'posts'),
                where('category', '==', currentCategory)
            );
        } else if (currentCategory) {
            q = query(collection(db, 'posts'), where('category', '==', currentCategory));
        } else {
            q = query(collection(db, 'posts'));
        }

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let postsData = [];
            const categorySet = new Set();

            querySnapshot.forEach((doc) => {
                const data = { id: doc.id, ...doc.data() };
                if (searchQuery) {
                    const lowerQuery = searchQuery.toLowerCase();
                    if (
                        data.title.toLowerCase().includes(lowerQuery) ||
                        data.content.toLowerCase().includes(lowerQuery)
                    ) {
                        postsData.push(data);
                    }
                } else {
                    postsData.push(data);
                }
                categorySet.add(data.category);
            });
            setPosts(postsData);
            setCategories([...categorySet]);
        });

        return () => unsubscribe();
    }, [currentCategory, searchQuery]);

    const filterByCategory = (category) => {
        setCurrentCategory(category);
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h1 className="text-3xl font-bold mb-4 md:mb-0">Blog Posts</h1>
                <SearchBar onSearch={handleSearch} />
            </div>
            <div className="mb-6">
                <button
                    onClick={() => filterByCategory('')}
                    className={`mr-2 mb-2 px-4 py-2 rounded ${currentCategory === '' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    All
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => filterByCategory(cat)}
                        className={`mr-2 mb-2 px-4 py-2 rounded ${currentCategory === cat ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))
                ) : (
                    <p>No posts found.</p>
                )}
            </div>
        </div>
    );
}

export default Home;
