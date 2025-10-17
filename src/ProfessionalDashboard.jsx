import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase.js';

export default function ProfessionalDashboard({ currentUser, userProfile, refreshTrigger }) {
    const [myBookings, setMyBookings] = useState([]);
    const [isLoadingBookings, setIsLoadingBookings] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!currentUser) return;
            setIsLoadingBookings(true);
            try {
                const q = query(collection(db, "bookings"), where("userId", "==", currentUser.uid));
                const querySnapshot = await getDocs(q);
                const bookingsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMyBookings(bookingsData);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            } finally {
                setIsLoadingBookings(false);
            }
        };
        fetchBookings();
    }, [currentUser, refreshTrigger]);

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">My Account</h1>
            <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Details</h2>
                        <div className="space-y-4">
                            <div><label className="block text-gray-700 font-semibold mb-2">Full Name</label><p className="text-gray-800 text-lg">{userProfile?.name || 'Not set'}</p></div>
                            <div><label className="block text-gray-700 font-semibold mb-2">Email</label><p className="text-gray-800">{userProfile?.email}</p></div>
                            <div><label className="block text-gray-700 font-semibold mb-2">Member Since</label><p className="text-gray-800">{userProfile?.joinDate?.toDate().toLocaleDateString() || 'N/A'}</p></div>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Bookings</h2>
                        {isLoadingBookings ? (
                            <p>Loading your bookings...</p>
                        ) : myBookings.length > 0 ? (
                            <ul className="space-y-4">
                                {myBookings.map(booking => (
                                    <li key={booking.id} className="flex justify-between items-center border-b pb-4">
                                        <div><p className="font-bold text-lg text-[#0052cc]">{booking.spaceName}</p><p className="text-sm text-gray-500">Date: {booking.date.toDate().toLocaleDateString()}</p></div>
                                        <span className="text-sm font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full capitalize">{booking.status}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-gray-500 py-8">You haven't made any bookings yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};