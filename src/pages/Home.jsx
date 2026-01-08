import React from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Services from '../components/Services';
import PageTransition from '../components/PageTransition';

const Home = () => {
    return (
        <PageTransition>
            <Hero />
            <Stats />
            <Services />
        </PageTransition>
    );
};

export default Home;
