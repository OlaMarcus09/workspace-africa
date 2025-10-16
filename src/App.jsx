import React, { useState, useEffect } from 'react';
import { usePaystackPayment } from 'react-paystack';

// Import the functions we need from Firebase
import { collection, getDocs, setDoc, doc, query, where, getDoc, addDoc, Timestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
// Import our database and auth connections from our config file
import { db, auth } from './firebase.js';

// --- SVG ICONS ---
const WifiIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-700"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg> );
const PowerIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-700"><path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/></svg> );
const StarIcon = ({ className }) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> );
const VerifiedIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1.5 text-white"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> );
const MeetingRoomIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-3 text-[#0052cc]"><path d="M12 22V4"/><path d="M14 2H8"/><path d="M10 22h4"/><path d="M10 12H3.5a2.5 2.5 0 1 1 0-5H10"/><path d="M14 12h6.5a2.5 2.5 0 1 0 0-5H14"/></svg>;
const CoffeeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-3 text-[#0052cc]"><path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v2a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h12z"/><path d="M6 1-2v3a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V-1"/></svg>;
const ParkingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-3 text-[#0052cc]"><path d="M9 18V6h6.5a4.5 4.5 0 1 1 0 9H9z"/></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const DollarSignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const BuildingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="4"></line><line x1="15" y1="22" x2="15" y2="4"></line><line x1="2" y1="10" x2="22" y2="10"></line><line x1="2" y1="14" x2="22" y2="14"></line></svg>;

// --- SOCIAL PROOF COMPONENTS ---
const StatsSection = () => ( <section className="bg-[#0052cc] bg-opacity-5 py-16"><div className="container mx-auto px-6"><div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"><div><p className="text-4xl lg:text-5xl font-bold text-[#0052cc]">500+</p><p className="text-gray-600 mt-2">Happy Professionals</p></div><div><p className="text-4xl lg:text-5xl font-bold text-[#0052cc]">15+</p><p className="text-gray-600 mt-2">Vetted Spaces</p></div><div><p className="text-4xl lg:text-5xl font-bold text-[#0052cc]">5,000+</p><p className="text-gray-600 mt-2">Hours Booked</p></div><div><p className="text-4xl lg:text-5xl font-bold text-[#0052cc]">4.8★</p><p className="text-gray-600 mt-2">Average Rating</p></div></div></div></section> );
const TestimonialsSection = () => { const testimonials = [ { name: 'Tunde Anjola', role: 'Lead Developer, TechSavvy Inc.', review: "WorkSpace Africa is a game-changer. The power guarantee is not a joke. I can finally code without worrying about my inverter. Found an amazing hub in Bodija in minutes.", avatar: 'https://placehold.co/100x100/0052cc/FFFFFF?text=TA' }, { name: 'Chioma Okoro', role: 'Freelance Designer', review: "The quality of the spaces is top-notch. I love the 'vetted' badge because it gives me peace of mind. The booking process was so smooth and instant.", avatar: 'https://placehold.co/100x100/FFB400/FFFFFF?text=CO' }, { name: 'Femi Adebayo', role: 'Marketing Consultant', review: "Finally, a platform that understands the Nigerian market. Finding a professional place for client meetings used to be a headache. Now it's just a few clicks away.", avatar: 'https://placehold.co/100x100/000000/FFFFFF?text=FA' } ]; return ( <section className="bg-white py-20"><div className="container mx-auto px-6"><h2 className="text-3xl font-bold text-center text-gray-800 mb-4">What Our Community Says</h2><p className="text-center text-gray-600 mb-12">Trusted by the best professionals and teams in Nigeria.</p><div className="grid grid-cols-1 md:grid-cols-3 gap-8">{testimonials.map((t, index) => ( <div key={index} className="bg-gray-50 p-8 rounded-lg border border-gray-100"><div className="flex items-center gap-4 mb-4"><img src={t.avatar} className="w-14 h-14 rounded-full" alt={t.name} /><div><p className="font-bold text-gray-800">{t.name}</p><p className="text-sm text-gray-600">{t.role}</p></div></div><p className="text-gray-700 leading-relaxed">"{t.review}"</p><div className="mt-4 text-yellow-500 flex items-center"><StarIcon className="h-5 w-5" /><StarIcon className="h-5 w-5" /><StarIcon className="h-5 w-5" /><StarIcon className="h-5 w-5" /><StarIcon className="h-5 w-5" /></div></div> ))}</div></div></section> ); };

// --- DASHBOARD COMPONENTS ---
const ProfessionalDashboard = ({ currentUser, userProfile, refreshTrigger }) => { const [myBookings, setMyBookings] = useState([]); const [isLoadingBookings, setIsLoadingBookings] = useState(true); useEffect(() => { const fetchBookings = async () => { if (!currentUser) return; setIsLoadingBookings(true); try { const q = query(collection(db, "bookings"), where("userId", "==", currentUser.uid)); const querySnapshot = await getDocs(q); const bookingsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); setMyBookings(bookingsData); } catch (error) { console.error("Error fetching bookings:", error); } finally { setIsLoadingBookings(false); } }; fetchBookings(); }, [currentUser, refreshTrigger]); return ( <div className="container mx-auto px-6 py-12"><h1 className="text-4xl font-bold text-gray-800 mb-8">My Account</h1><div className="grid lg:grid-cols-3 gap-12"><div className="lg:col-span-1"><div className="bg-white rounded-lg shadow p-6"><h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Details</h2><div className="space-y-4"><div><label className="block text-gray-700 font-semibold mb-2">Full Name</label><p className="text-gray-800 text-lg">{userProfile?.name || 'Not set'}</p></div><div><label className="block text-gray-700 font-semibold mb-2">Email</label><p className="text-gray-800">{userProfile?.email}</p></div><div><label className="block text-gray-700 font-semibold mb-2">Member Since</label><p className="text-gray-800">{userProfile?.joinDate?.toDate().toLocaleDateString() || 'N/A'}</p></div></div></div></div><div className="lg:col-span-2"><div className="bg-white rounded-lg shadow p-6"><h2 className="text-2xl font-bold text-gray-800 mb-6">My Bookings</h2>{isLoadingBookings ? ( <p>Loading your bookings...</p> ) : myBookings.length > 0 ? ( <ul className="space-y-4">{myBookings.map(booking => ( <li key={booking.id} className="flex justify-between items-center border-b pb-4"><div><p className="font-bold text-lg text-[#0052cc]">{booking.spaceName}</p><p className="text-sm text-gray-500">Date: {booking.date.toDate().toLocaleDateString()}</p></div><span className="text-sm font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full capitalize">{booking.status}</span></li> ))}</ul> ) : ( <p className="text-center text-gray-500 py-8">You haven't made any bookings yet.</p> )}</div></div></div></div> ); };
const PartnerDashboard = ({ currentUser, userProfile, refreshTrigger }) => { const [mySpaces, setMySpaces] = useState([]); const [recentBookings, setRecentBookings] = useState([]); const [isLoading, setIsLoading] = useState(true); useEffect(() => { const fetchData = async () => { if (!currentUser) return; setIsLoading(true); try { const spacesQuery = query(collection(db, "spaces"), where("ownerId", "==", currentUser.uid)); const spacesSnapshot = await getDocs(spacesQuery); const spacesData = spacesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); setMySpaces(spacesData); if (spacesData.length > 0) { const spaceIds = spacesData.map(space => space.id); const bookingsQuery = query(collection(db, "bookings"), where("spaceId", "in", spaceIds.slice(0,10))); const bookingsSnapshot = await getDocs(bookingsQuery); const bookingsData = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); setRecentBookings(bookingsData); } } catch (error) { console.error("Error fetching partner data:", error); } finally { setIsLoading(false); } }; fetchData(); }, [currentUser, refreshTrigger]); const totalRevenue = recentBookings.reduce((sum, b) => sum + (b.amountPaid || 0), 0); return ( <div className="container mx-auto px-6 py-12"><h1 className="text-4xl font-bold text-gray-800">Partner Dashboard</h1><p className="text-lg text-gray-500 mt-2">Manage your spaces and view your business performance.</p><div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"><div className="bg-[#0052cc] rounded-lg shadow p-6 flex items-center"><div className="bg-blue-500 p-3 rounded-full mr-4"><UsersIcon /></div><div><p className="text-white text-3xl font-bold">{recentBookings.length}</p><p className="text-blue-200">Total Bookings</p></div></div><div className="bg-green-600 rounded-lg shadow p-6 flex items-center"><div className="bg-green-500 p-3 rounded-full mr-4"><DollarSignIcon /></div><div><p className="text-white text-3xl font-bold">₦{totalRevenue.toLocaleString()}</p><p className="text-green-200">Total Revenue</p></div></div><div className="bg-gray-700 rounded-lg shadow p-6 flex items-center"><div className="bg-gray-600 p-3 rounded-full mr-4"><BuildingIcon /></div><div><p className="text-white text-3xl font-bold">{mySpaces.length}</p><p className="text-gray-300">Listed Spaces</p></div></div></div><div className="mt-12"><h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Bookings</h2><div className="bg-white rounded-lg shadow overflow-hidden">{isLoading ? <p className="p-6 text-center text-gray-500">Loading...</p> : recentBookings.length > 0 ? ( <div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Space</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th></tr></thead><tbody className="bg-white divide-y divide-gray-200">{recentBookings.map(b => ( <tr key={b.id}> <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{b.spaceName}</div></td> <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{b.userName}</div><div className="text-sm text-gray-500">{b.userEmail}</div></td> <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{b.date.toDate().toLocaleDateString()}</td> <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₦{b.amountPaid.toLocaleString()}</td> </tr> ))}</tbody></table></div> ) : ( <p className="p-12 text-center text-gray-500">No bookings for your spaces yet.</p> )}</div></div></div> ); };

const AuthModal = ({ mode, onClose, setAuthMode }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('professional');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isSignUp = mode === 'signup';

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: user.email,
        joinDate: Timestamp.now(),
        userType: userType
      });
      onClose();
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleLogin = async (e) => { e.preventDefault(); setLoading(true); setError(''); try { await signInWithEmailAndPassword(auth, email, password); onClose(); } catch (error) { setError(error.message); } setLoading(false); };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"><XIcon /></button>
        <h2 className="text-2xl font-bold text-center mb-6">{isSignUp ? 'Create Your Account' : 'Welcome Back'}</h2>
        <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
          {isSignUp && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">Full Name</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052cc]" required />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">I am a</label>
                <select value={userType} onChange={(e) => setUserType(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052cc]">
                  <option value="professional">Professional (Looking for a space)</option>
                  <option value="partner">Partner (I own a space)</option>
                </select>
              </div>
            </>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Email Address</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052cc]" required />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052cc]" required />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-[#0052cc] text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400">
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Log In')}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button onClick={() => setAuthMode(isSignUp ? 'login' : 'signup')} className="text-[#0052cc] font-semibold hover:underline ml-1">
            {isSignUp ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

const Header = ({ currentUser, onLoginClick, onSignUpClick, onLogout, setView }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <img src="https://res.cloudinary.com/dmqjicpcc/image/upload/v170286253/WorkSpaceAfrica_bgyjhe.png" alt="WorkSpace Africa Logo" className="h-8 w-auto cursor-pointer" onClick={() => setView('home')} />
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" onClick={() => setView('home')} className="text-gray-600 hover:text-[#0052cc]">Find a Space</a>
            <a href="#" onClick={() => setView('list-space')} className="text-gray-600 hover:text-[#0052cc]">List Your Space</a>
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? ( <> <button onClick={() => setView('dashboard')} className="font-semibold text-gray-600 hover:text-[#0052cc]">Dashboard</button> <button onClick={onLogout} className="bg-[#FFB400] text-white font-semibold py-2 px-5 rounded-lg hover:bg-opacity-90">Logout</button> </> ) : ( <> <button onClick={onLoginClick} className="text-gray-600 hover:text-[#0052cc]">Sign In</button> <button onClick={onSignUpClick} className="bg-[#FFB400] text-white font-semibold py-2 px-5 rounded-lg hover:bg-opacity-90">Sign Up</button> </> )}
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2" aria-label="Toggle menu">
            {mobileMenuOpen ? ( <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> ) : ( <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg> )}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <nav className="flex flex-col space-y-4">
              <a href="#" onClick={() => { setView('home'); setMobileMenuOpen(false); }} className="text-gray-600 hover:text-[#0052cc] font-medium">Find a Space</a>
              <a href="#" onClick={() => { setView('list-space'); setMobileMenuOpen(false); }} className="text-gray-600 hover:text-[#0052cc] font-medium">List Your Space</a>
              <div className="border-t pt-4 space-y-3">
                {currentUser ? ( <> <button onClick={() => { setView('dashboard'); setMobileMenuOpen(false); }} className="w-full text-left font-semibold text-gray-600 hover:text-[#0052cc]">Dashboard</button> <button onClick={() => { onLogout(); setMobileMenuOpen(false); }} className="w-full bg-[#FFB400] text-white font-semibold py-2 px-5 rounded-lg">Logout</button> </> ) : ( <> <button onClick={() => { onLoginClick(); setMobileMenuOpen(false); }} className="w-full text-left text-gray-600 hover:text-[#0052cc] font-medium">Sign In</button> <button onClick={() => { onSignUpClick(); setMobileMenuOpen(false); }} className="w-full bg-[#FFB400] text-white font-semibold py-2 px-5 rounded-lg">Sign Up</button> </> )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

const HeroSection = () => ( <section className="bg-gray-50"><div className="container mx-auto px-6 py-20 text-center"><h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight">Find Your Focus. <span className="text-[#0052cc]">Power Your Workday.</span></h1><p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Instantly book vetted coworking spaces in Ibadan with guaranteed power and high-speed WiFi.</p><div className="mt-8 max-w-2xl mx-auto bg-white rounded-full p-2 shadow-lg flex items-center"><input type="text" placeholder="Search by city, e.g., Ibadan" className="w-full bg-transparent text-lg p-3 border-none focus:ring-0"/><button className="bg-[#0052cc] text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-colors">Search</button></div></div></section> );
const SpaceCard = ({ space, onSelect }) => ( <div onClick={() => onSelect(space)} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer"><div className="relative"><img src={space.imageUrl} alt={space.name} className="w-full h-48 object-cover" /><div className="absolute top-3 left-3 bg-[#0052cc] text-white text-xs font-bold py-1.5 px-3 rounded-full flex items-center"><VerifiedIcon />Vetted by WorkSpace Africa</div></div><div className="p-5"><h3 className="text-xl font-bold text-gray-800 truncate">{space.name}</h3><p className="text-gray-500 mt-1">{space.location}</p><div className="flex items-center mt-3 text-gray-800"><StarIcon className="h-5 w-5 text-yellow-500" /><span className="font-bold ml-1">{space.rating}</span><span className="text-gray-500 ml-2">({space.reviews} reviews)</span></div><div className="flex items-center space-x-4 mt-4 border-t pt-4"><div className="flex items-center space-x-2 text-sm text-gray-600"><WifiIcon /> <span>Fast WiFi</span></div><div className="flex items-center space-x-2 text-sm text-gray-600"><PowerIcon /> <span>24/7 Power</span></div></div><div className="mt-4 text-right"><p className="text-2xl font-bold text-[#0052cc]">₦{space.price.toLocaleString()}<span className="text-base font-normal text-gray-500">/{space.priceType}</span></p></div></div></div> );
const FeaturedSpaces = ({ spaces, onSelect, isLoading }) => ( <section className="bg-white py-16"><div className="container mx-auto px-6"><h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Featured Workspaces in Ibadan</h2><p className="text-center text-gray-600 mb-10">Handpicked and vetted for quality and reliability.</p>{isLoading ? (<div className="text-center font-semibold text-lg py-10">Loading Spaces...</div>) : (<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">{spaces.map((space, index) => <div key={space.id} className="fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}><SpaceCard space={space} onSelect={onSelect} /></div>)}</div>)}</section> );

const SpaceDetailPage = ({ space, onBack, currentUser, userProfile, setView, openLoginModal, onBookingComplete }) => {
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [isProcessing, setIsProcessing] = useState(false);

  const config = {
    reference: `WSA-${Date.now()}`,
    email: userProfile?.email || '',
    amount: space.price * 100,
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
  };

  const initializePayment = usePaystackPayment(config);

  const handleBookNow = () => {
    if (!import.meta.env.VITE_PAYSTACK_PUBLIC_KEY) { alert("Payment system is not configured. Please contact support."); return; }
    if (!currentUser) { openLoginModal(); return; }
    if (!userProfile) { alert("Profile not loaded yet. Please wait a moment."); return; }
    if (isProcessing) return;

    setIsProcessing(true);

    const onSuccess = async (reference) => {
      try {
        await addDoc(collection(db, "bookings"), { userId: currentUser.uid, userName: userProfile.name, userEmail: userProfile.email, spaceId: space.id, spaceName: space.name, spaceLocation: space.location, date: Timestamp.fromDate(new Date(bookingDate)), status: "confirmed", amountPaid: space.price, transactionRef: reference.reference, createdAt: Timestamp.now(), });
        alert('Booking Successful!');
        onBookingComplete();
        setView('dashboard');
      } catch (error) {
        console.error("Error creating booking:", error);
        alert('Error saving your booking. Please contact support.');
      } finally {
        setIsProcessing(false);
      }
    };
    const onClose = () => { setIsProcessing(false); console.log('Payment popup closed.'); };
    initializePayment(onSuccess, onClose);
  };

  const amenityIcons = { 'wifi': { icon: <WifiIcon />, name: "High-Speed WiFi" }, 'power': { icon: <PowerIcon />, name: "Guaranteed Power" }, 'meeting-room': { icon: <MeetingRoomIcon />, name: "Meeting Rooms" }, 'coffee': { icon: <CoffeeIcon />, name: "Free Coffee" }, 'parking': { icon: <ParkingIcon />, name: "On-site Parking" }, }; 
  return ( <div className="bg-gray-50 min-h-screen"><div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"><button onClick={onBack} className="mb-6 inline-flex items-center text-gray-600 hover:text-[#0052cc] font-semibold"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>Back to listings</button><div className="grid grid-cols-3 grid-rows-2 gap-2 h-[500px] rounded-2xl overflow-hidden"><div className="col-span-2 row-span-2"><img src={space.imageUrl} alt={space.name} className="w-full h-full object-cover"/></div><div className="col-span-1 row-span-1"><img src={space.gallery?.[0] || space.imageUrl} alt={`${space.name} gallery 1`} className="w-full h-full object-cover"/></div><div className="col-span-1 row-span-1"><img src={space.gallery?.[1] || space.imageUrl} alt={`${space.name} gallery 2`} className="w-full h-full object-cover"/></div></div><div className="grid lg:grid-cols-3 gap-12 mt-12"><div className="lg:col-span-2"><h1 className="text-4xl font-bold text-gray-800">{space.name}</h1><p className="text-lg text-gray-500 mt-2">{space.location}</p><div className="flex items-center mt-3 text-gray-800"><StarIcon className="h-5 w-5 text-yellow-500" /><span className="font-bold ml-1">{space.rating}</span><span className="text-gray-500 ml-2">({space.reviews} reviews)</span></div><div className="border-t my-8"></div><h2 className="text-2xl font-bold text-gray-800">About this space</h2><p className="mt-4 text-gray-600 leading-relaxed">{space.description}</p><div className="border-t my-8"></div><h2 className="text-2xl font-bold text-gray-800">Amenities</h2><ul className="mt-6 grid grid-cols-2 gap-y-4">{space.amenities?.map(amenity => ( <li key={amenity} className="flex items-center text-lg text-gray-700">{amenityIcons[amenity]?.icon || ''}<span>{amenityIcons[amenity]?.name || amenity}</span></li> ))}</ul></div><div className="lg:col-span-1"><div className="bg-white rounded-2xl shadow-xl p-8 sticky top-32"><p className="text-3xl font-bold text-[#0052cc]">₦{space.price.toLocaleString()}<span className="text-xl font-normal text-gray-500">/{space.priceType}</span></p><div className="mt-6"><label className="block text-sm font-medium text-gray-700">Date</label><input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"/></div><button onClick={handleBookNow} disabled={isProcessing} className="mt-8 w-full bg-[#FFB400] text-white font-bold py-4 px-6 rounded-lg text-lg hover:bg-opacity-90 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed">{isProcessing ? 'Processing...' : 'Book Now'}</button></div></div></div></div></div> );}

const SimplePage = ({ title, children }) => ( <div className="container mx-auto px-6 py-12"><h1 className="text-4xl font-bold text-gray-800 mb-8">{title}</h1><div className="bg-white rounded-lg shadow p-8 prose max-w-none">{children}</div></div> );

const Footer = ({ setView }) => ( <footer className="bg-gray-800 text-white"><div className="container mx-auto px-6 py-12"><div className="grid md:grid-cols-4 gap-8"><div><h3 className="text-xl font-bold">WorkSpace Africa</h3><p className="mt-2 text-gray-400">The intelligent coworking marketplace.</p></div><div><h4 className="font-semibold">Company</h4><ul className="mt-4 space-y-2"><li><a href="#" onClick={() => setView('about')} className="text-gray-400 hover:text-white">About Us</a></li><li><a href="#" onClick={() => setView('contact')} className="text-gray-400 hover:text-white">Contact</a></li></ul></div><div><h4 className="font-semibold">Legal</h4><ul className="mt-4 space-y-2"><li><a href="#" onClick={() => setView('terms')} className="text-gray-400 hover:text-white">Terms of Service</a></li><li><a href="#" onClick={() => setView('privacy')} className="text-gray-400 hover:text-white">Privacy Policy</a></li></ul></div><div><h4 className="font-semibold">Connect</h4></div></div><div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-400"><p>&copy; 2025 WorkSpace Africa. All rights reserved.</p></div></div></footer> );

// --- MAIN APP COMPONENT ---
export default function App() {
  const [spaces, setSpaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('home');
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => { const unsubscribe = onAuthStateChanged(auth, async (user) => { setCurrentUser(user); if (user) { const userDocRef = doc(db, "users", user.uid); const userDocSnap = await getDoc(userDocRef); if (userDocSnap.exists()) { setUserProfile(userDocSnap.data()); } else { console.log("No such user profile document!"); setUserProfile(null); } } else { setUserProfile(null); } }); return () => unsubscribe(); }, []);
  useEffect(() => { const fetchSpaces = async () => { try { const querySnapshot = await getDocs(collection(db, "spaces")); const spacesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); setSpaces(spacesData); } catch (error) { console.error("Error fetching spaces from Firestore: ", error); } finally { setIsLoading(false); } }; fetchSpaces(); }, []);

  const handleSelectSpace = (space) => { setSelectedSpace(space); setView('spaceDetail'); };
  const handleGoBackHome = () => { setSelectedSpace(null); setView('home'); };
  const openModal = (mode) => { setAuthMode(mode); setShowAuthModal(true); };
  const handleLogout = async () => { await signOut(auth); setView('home'); };
  const handleBookingComplete = () => { setRefreshTrigger(prev => prev + 1); };
  
  const renderDashboard = () => { if (!userProfile) return <div className="text-center py-20">Loading profile...</div>; switch (userProfile.userType) { case 'professional': return <ProfessionalDashboard currentUser={currentUser} userProfile={userProfile} refreshTrigger={refreshTrigger} />; case 'partner': return <PartnerDashboard currentUser={currentUser} userProfile={userProfile} refreshTrigger={refreshTrigger} />; default: return <p className="text-center py-20">Unknown user type. Please contact support.</p>; } };

  const renderView = () => {
    switch (view) {
      case 'dashboard': return renderDashboard();
      case 'spaceDetail': return <SpaceDetailPage space={selectedSpace} onBack={handleGoBackHome} currentUser={currentUser} userProfile={userProfile} setView={setView} openLoginModal={() => openModal('login')} onBookingComplete={handleBookingComplete} />;
      case 'terms': return <SimplePage title="Terms of Service"><p>Your terms of service will go here. It's important to define rules for users, partners, payments, and cancellations.</p></SimplePage>;
      case 'privacy': return <SimplePage title="Privacy Policy"><p>Your privacy policy will go here, explaining what data you collect and how you use it.</p></SimplePage>;
      case 'about': return <SimplePage title="About Us"><p>This is where you tell the story of WorkSpace Africa, your mission, and your vision for the future of work in Africa.</p></SimplePage>;
      case 'contact': return <SimplePage title="Contact Us"><p>Provide your email, phone number, and a contact form here for support and inquiries.</p></SimplePage>;
      case 'list-space': return <SimplePage title="List Your Space"><p>Information for partners on how to join the platform, the benefits, and the commission structure will go here.</p></SimplePage>;
      case 'home': default: return ( <> <HeroSection /> <StatsSection /> <FeaturedSpaces spaces={spaces} onSelect={handleSelectSpace} isLoading={isLoading} /> <TestimonialsSection /> </> );
    }
  };

  return (
    <div className="bg-gray-50" style={{ fontFamily: 'Satoshi, sans-serif' }}>
      <Header currentUser={currentUser} onLoginClick={() => openModal('login')} onSignUpClick={() => openModal('signup')} onLogout={handleLogout} setView={setView} />
      {showAuthModal && <AuthModal mode={authMode} onClose={() => setShowAuthModal(false)} setAuthMode={setAuthMode} />}
      <main>
        {renderView()}
      </main>
      <Footer setView={setView} />
    </div>
  );
}

