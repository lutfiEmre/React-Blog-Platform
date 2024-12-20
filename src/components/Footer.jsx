
import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="bg-gray-800 text-gray-200 py-6">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm">&copy; {new Date().getFullYear()} My Blog. All rights reserved.</p>
                <div className="flex space-x-4 mt-4 md:mt-0">
                    <Link to="/" className="hover:text-white">
                        Home
                    </Link>
                    <Link to="/about" className="hover:text-white">
                        About
                    </Link>
                    <Link to="/contact" className="hover:text-white">
                        Contact
                    </Link>

                </div>
            </div>
        </footer>
    );
}

export default Footer;
