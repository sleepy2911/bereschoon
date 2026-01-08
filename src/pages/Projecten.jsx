import React from 'react';
import Gallery from '../components/Gallery';
import PageTransition from '../components/PageTransition';

const Projecten = () => {
    return (
        <PageTransition className="pt-24">
            <Gallery />
        </PageTransition>
    );
};

export default Projecten;
