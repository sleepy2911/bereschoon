import React from 'react';
import { Link } from 'react-router-dom';

const MinimalFooter = () => (
    <footer className="bg-background py-8 text-center text-sm text-gray-500 border-t border-border">
        <div className="container mx-auto px-6">
            <p>&copy; {new Date().getFullYear()} Bereschoon. Alle rechten voorbehouden.</p>
            <div className="flex justify-center gap-4 mt-4">
                <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
                <Link to="/algemene-voorwaarden" className="hover:text-foreground transition-colors">Algemene Voorwaarden</Link>
            </div>
        </div>
    </footer>
);

export default MinimalFooter;
