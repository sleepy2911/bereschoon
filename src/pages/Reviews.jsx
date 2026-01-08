import React from 'react';
import Reviews from '../components/Reviews';
import PageTransition from '../components/PageTransition';

const ReviewsPage = () => {
    return (
        <PageTransition className="pt-24">
            <Reviews />
        </PageTransition>
    );
};

export default ReviewsPage;
