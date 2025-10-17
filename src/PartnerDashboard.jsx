import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from './firebase.js';

// --- Icons for this component ---
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const DollarSignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const BuildingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="4"></line><line x1="15" y1="22" x2="15" y2="4"></line><line x1="2" y1="10" x2="22" y2="10"></line><line x1="2" y1="14" x2="22" y2="14"></line></svg>;


export default function PartnerDashboard({ currentUser, refreshTrigger }) {
    const [mySpaces, setMySpaces] = useState([]);
    const [recentBookings, setRecentBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser) return;
            setIsLoading(true);
            try {
                // 1. Fetch the partner's spaces
                const spacesQuery = query(collection(db, "spaces"), where("ownerId", "==", currentUser.uid));
                const spacesSnapshot = await getDocs(spacesQuery);
                const spacesData = spacesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMySpaces(spacesData);

                // 2. If they have spaces, fetch recent bookings for those spaces
                if (spacesData.length > 0) {
                    const spaceIds = spacesData.map(space => space.id);
                    // Firestore 'in' queries are limited to 10 items. For now, we only query the first 10 spaces.
                    const bookingsQuery = query(collection(db, "bookings"), where("spaceId", "in", spaceIds.slice(0, 10)), limit(20));
                    const bookingsSnapshot = await getDocs(bookingsQuery);
                    const bookingsData = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setRecentBookings(bookingsData);
                }
            } catch (error) {
                console.error("Error fetching partner data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [currentUser, refreshTrigger]);

    const totalRevenue = recentBookings.reduce((sum, booking) => sum + (booking.amountPaid || 0), 0);

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold text-gray-800">Partner Dashboard</h1>
            <p className="text-lg text-gray-500 mt-2">Manage your spaces and view your business performance.</p>

            {/* --- Stat Cards --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-[#0052cc] rounded-lg shadow p-6 flex items-center">
                    <div className="bg-blue-500 p-3 rounded-full mr-4"><UsersIcon /></div>
                    <div><p className="text-white text-3xl font-bold">{recentBookings.length}</p><p className="text-blue-200">Total Bookings</p></div>
                </div>
                <div className="bg-green-600 rounded-lg shadow p-6 flex items-center">
                    <div className="bg-green-500 p-3 rounded-full mr-4"><DollarSignIcon /></div>
                    <div><p className="text-white text-3xl font-bold">₦{totalRevenue.toLocaleString()}</p><p className="text-green-200">Total Revenue</p></div>
                </div>
                <div className="bg-gray-700 rounded-lg shadow p-6 flex items-center">
                    <div className="bg-gray-600 p-3 rounded-full mr-4"><BuildingIcon /></div>
                    <div><p className="text-white text-3xl font-bold">{mySpaces.length}</p><p className="text-gray-300">Listed Spaces</p></div>
                </div>
            </div>

            {/* --- Recent Bookings Table --- */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Bookings</h2>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {isLoading ? <p className="p-6 text-center text-gray-500">Loading bookings...</p> : recentBookings.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Space</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentBookings.map(b => (
                                        <tr key={b.id}>
                                            <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{b.spaceName}</div></td>
                                            <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{b.userName}</div><div className="text-sm text-gray-500">{b.userEmail}</div></td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{b.date.toDate().toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₦{b.amountPaid.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="p-12 text-center text-gray-500">You have no recent bookings for your spaces.</p>
                    )}
                </div>
            </div>
        </div>
    );
};