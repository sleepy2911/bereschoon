import React from 'react';
import { Link } from 'react-router-dom';

const MinimalHeader = () => {
    return (
        <header className="absolute top-0 left-0 right-0 z-50 py-6">
            <div className="container mx-auto px-6">
                <div className="inline-block relative w-20 h-20">
                    <img
                        src="/images/logo.png"
                        alt="Bereschoon"
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>
        </header>
    );
};

export default MinimalHeader;
