import React from 'react';
import Link from 'next/link';

const Header = () => {
    return (
        <header className="fixed top-0 z-50 w-full">
            <div className="max-w-7xl mx-auto px-8">
                <div className="flex justify-center items-center h-20">
                    {/* Desktop Navigation */}
                    <nav className="flex items-center space-x-12">
                        <Link
                            href="/about"
                            className="text-white/90 hover:text-white text-lg font-medium transition-colors"
                        >
                            About Us
                        </Link>
                        <Link
                            href="/faq"
                            className="text-white/90 hover:text-white text-lg font-medium transition-colors"
                        >
                            FAQ
                        </Link>
                        <Link
                            href="/map"
                            className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-md transition-colors backdrop-blur-sm text-lg"
                        >
                            View Map
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;