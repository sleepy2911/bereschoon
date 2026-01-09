import React from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Services from '../components/Services';
import HomeQuoteSection from '../components/HomeQuoteSection';
import PageTransition from '../components/PageTransition';

const Home = () => {
    return (
        <PageTransition>
            <Hero />
            <Stats />
            <Services />
            <HomeQuoteSection />
        </PageTransition>
    );
};

export default Home;
