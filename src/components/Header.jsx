
import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { auth } from '../services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function Header() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
    };

    return (
        <header className="bg-gray-800 text-white">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">My Blog</Link>
                <nav>
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `mr-4 ${isActive ? 'text-blue-400' : 'text-white hover:text-blue-400'}`
                        }
                    >
                        Home
                    </NavLink>
                    {user ? (
                        <>
                            <NavLink
                                to="/create"
                                className={({ isActive }) =>
                                    `mr-4 ${isActive ? 'text-blue-400' : 'text-white hover:text-blue-400'}`
                                }
                            >
                                Create Post
                            </NavLink>
                            <NavLink
                                to="/profile"
                                className={({ isActive }) =>
                                    `mr-4 ${isActive ? 'text-blue-400' : 'text-white hover:text-blue-400'}`
                                }
                            >
                                Profile
                            </NavLink>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink
                                to="/login"
                                className={({ isActive }) =>
                                    `mr-4 ${isActive ? 'text-blue-400' : 'text-white hover:text-blue-400'}`
                                }
                            >
                                Log In
                            </NavLink>
                            <NavLink
                                to="/signup"
                                className={({ isActive }) =>
                                    `${isActive ? 'text-blue-400' : 'text-white hover:text-blue-400'}`
                                }
                            >
                                Sign Up
                            </NavLink>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;
