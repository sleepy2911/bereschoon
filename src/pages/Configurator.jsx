import React from 'react';
import ConfiguratorContact from '../components/ConfiguratorContact';
import PageTransition from '../components/PageTransition';

const Configurator = () => {
    return (
        <PageTransition className="pt-20">
            <ConfiguratorContact />
        </PageTransition>
    );
};

export default Configurator;
