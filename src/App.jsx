
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import Category from './pages/Category';
import ProtectedRoute from './components/ProtectedRoute';
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import AuthorDetail from "./pages/AuthorDetail.jsx";

function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/post/:id" element={<PostDetail />} />
                        <Route path="/category/:name" element={<Category />} />
                        <Route path="/author/:authorId" element={<AuthorDetail />} />

                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/create"
                            element={
                                <ProtectedRoute>
                                    <CreatePost />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/about"
                            element={
                            <About/>
                            }
                        />
                        <Route
                            path="/contact"
                            element={
                                <Contact/>
                            }
                        />
                        {/* Diğer rotalarınızı buraya ekleyebilirsiniz */}
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
