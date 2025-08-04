import React from 'react';
import Button from '@/components/button';

const bgStyle = {
    backgroundImage: 'url("/login-bg.png")', // Adjust path if needed
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '100vh',
    minWidth: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const Landing = () => (
    <div style={bgStyle}>
        <div className="bg-opacity-80 p-10 rounded shadow-lg text-center flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to Forest Rack</h1>
            <p className="text-lg mb-8">Your smart inventory and stock management solution.</p>
            <a
                href="/login"
                className="bg-green-700 text-white px-6 py-3 rounded-lg shadow hover:bg-green-800 transition"
            >
                Login
            </a>
        </div>
    </div>
);

export default Landing;