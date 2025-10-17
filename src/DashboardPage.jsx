import React from 'react';
import ProfessionalDashboard from './ProfessionalDashboard.jsx';
import PartnerDashboard from './PartnerDashboard.jsx';

export default function DashboardPage({ currentUser, userProfile, refreshTrigger }) {
    if (!userProfile) {
        return <div className="text-center py-20">Loading profile...</div>;
    }

    switch (userProfile.userType) {
        case 'professional':
            return <ProfessionalDashboard currentUser={currentUser} userProfile={userProfile} refreshTrigger={refreshTrigger} />;
        case 'partner':
            return <PartnerDashboard currentUser={currentUser} refreshTrigger={refreshTrigger} />;
        default:
            return <p className="text-center py-20">Unknown user type. Please contact support.</p>;
    }
};