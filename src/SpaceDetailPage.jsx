import React, { useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import { db } from './firebase.js';

// --- ICONS needed for this page ---
const WifiIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-3 text-[#0052cc]"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg> );
const PowerIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-3 text-[#0052cc]"><path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/></svg> );
const StarIcon = ({ className }) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> );
const MeetingRoomIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-3 text-[#0052cc]"><path d="M12 22V4"/><path d="M14 2H8"/><path d="M10 22h4"/><path d="M10 12H3.5a2.5 2.5 0 1 1 0-5H10"/><path d="M14 12h6.5a2.5 2.5 0 1 0 0-5H14"/></svg>;
const CoffeeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-3 text-[#0052cc]"><path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v2a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h12z"/><path d="M6 1-2v3a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V-1"/></svg>;
const ParkingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-3 text-[#0052cc]"><path d="M9 18V6h6.5a4.5 4.5 0 1 1 0 9H9z"/></svg>;


export default function SpaceDetailPage({ space, onBack, currentUser, userProfile, openLoginModal, onBookingComplete }) {
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // This logic handles both old data (space.price) and new data (space.pricing.day)
  const bookingAmount = space.pricing?.day || space.price || 0;

  const config = { 
      reference: `WSA-${Date.now()}`, 
      email: userProfile?.email || '', 
      amount: bookingAmount * 100, // Paystack amount is in kobo
      publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY, 
  };
  const initializePayment = usePaystackPayment(config);

  const handleBookNow = () => {
    if (!currentUser) {
        openLoginModal();
        return;
    }
    // This guard clause is the most important check
    if (!userProfile?.email || !bookingAmount || !config.publicKey) {
      console.error("Payment cannot be initialized. Missing data:", { email: userProfile?.email, amount: bookingAmount, key: config.publicKey });
      alert("Cannot initialize payment. Please ensure you are logged in and the space has a valid price.");
      return;
    }
    
    if (isProcessing) return; 
    setIsProcessing(true); 

    const onSuccess = async (reference) => { 
        try { 
            const newBooking = { 
                userId: currentUser.uid, 
                userName: userProfile.name, 
                userEmail: userProfile.email, 
                spaceId: space.id, 
                spaceName: space.name, 
                spaceLocation: space.location, 
                date: Timestamp.fromDate(new Date(bookingDate)), 
                status: "confirmed", 
                amountPaid: bookingAmount, 
                transactionRef: reference.reference, 
                createdAt: Timestamp.now(), 
            }; 
            const docRef = await addDoc(collection(db, "bookings"), newBooking); 
            onBookingComplete({id: docRef.id, ...newBooking}); 
        } catch (error) { 
            console.error("Error creating booking:", error); 
            alert('Error saving your booking.'); 
        } finally { 
            setIsProcessing(false); 
        } 
    }; 
    const onClose = () => { setIsProcessing(false); }; 
    initializePayment(onSuccess, onClose); 
  };

  const amenityIcons = { 'wifi': { icon: <WifiIcon />, name: "High-Speed WiFi" }, 'power': { icon: <PowerIcon />, name: "Guaranteed Power" }, 'meeting-room': { icon: <MeetingRoomIcon />, name: "Meeting Rooms" }, 'coffee': { icon: <CoffeeIcon />, name: "Free Coffee" }, 'parking': { icon: <ParkingIcon />, name: "On-site Parking" }, }; 
  
  return ( 
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={onBack} className="mb-6 inline-flex items-center text-gray-600 hover:text-[#0052cc] font-semibold"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>Back</button>
        <div className="grid grid-cols-3 grid-rows-2 gap-2 h-[500px] rounded-2xl overflow-hidden">
          <div className="col-span-2 row-span-2"><img src={space.imageUrl} alt={space.name} className="w-full h-full object-cover"/></div>
          <div className="col-span-1 row-span-1"><img src={space.gallery?.[0] || 'https://placehold.co/600x400/cccccc/FFFFFF?text=WorkSpace'} alt={`${space.name} gallery 1`} className="w-full h-full object-cover"/></div>
          <div className="col-span-1 row-span-1"><img src={space.gallery?.[1] || 'https://placehold.co/600x400/cccccc/FFFFFF?text=WorkSpace'} alt={`${space.name} gallery 2`} className="w-full h-full object-cover"/></div>
        </div>
        <div className="grid lg:grid-cols-3 gap-12 mt-12">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-gray-800">{space.name}</h1>
            <p className="text-lg text-gray-500 mt-2">{space.location}</p>
            <div className="flex items-center mt-3 text-gray-800"><StarIcon className="h-5 w-5 text-yellow-500" /><span className="font-bold ml-1">{space.rating}</span><span className="text-gray-500 ml-2">({space.reviews} reviews)</span></div>
            <div className="border-t my-8"></div>
            <h2 className="text-2xl font-bold text-gray-800">About this space</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">{space.description}</p>
            <div className="border-t my-8"></div>
            <h2 className="text-2xl font-bold text-gray-800">Amenities</h2>
            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-y-4">{space.amenities?.map(amenity => ( <li key={amenity} className="flex items-center text-lg text-gray-700">{amenityIcons[amenity]?.icon || ''}<span>{amenityIcons[amenity]?.name || amenity}</span></li> ))}</ul>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-32">
              {(space.pricing?.day || space.price) && <p className="text-3xl font-bold text-[#0052cc]">₦{(space.pricing?.day || space.price).toLocaleString()}<span className="text-xl font-normal text-gray-500">/{space.priceType || 'day'}</span></p>}
              <div className="flex flex-wrap gap-4 mt-2">
                {space.pricing?.week && <p className="text-lg font-semibold text-gray-700">₦{space.pricing.week.toLocaleString()}<span className="font-normal text-gray-500">/week</span></p>}
                {space.pricing?.month && <p className="text-lg font-semibold text-gray-700">₦{space.pricing.month.toLocaleString()}<span className="font-normal text-gray-500">/month</span></p>}
              </div>
              <div className="mt-6"><label className="block text-sm font-medium text-gray-700">Date</label><input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"/></div>
              {/* This is the final, most robust button logic */}
              <button onClick={handleBookNow} disabled={isProcessing || !bookingAmount || !userProfile?.email} className="mt-8 w-full bg-[#FFB400] text-white font-bold py-4 px-6 rounded-lg text-lg hover:bg-opacity-90 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed">
                {isProcessing ? 'Processing...' : (bookingAmount && currentUser ? 'Book Now' : (bookingAmount ? 'Login to Book' : 'Booking unavailable'))}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div> 
  );
}