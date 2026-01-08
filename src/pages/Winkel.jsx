import React from 'react';
import Shop from '../components/Shop';
import PageTransition from '../components/PageTransition';

const Winkel = () => {
    return (
        <PageTransition className="pt-24">
            <Shop />
        </PageTransition>
    );
};

export default Winkel;
