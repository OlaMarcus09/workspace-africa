import React, { useState, useEffect } from 'react';
import QRCode from "react-qr-code";

// Import all our page components from their own files
import HomePage from './HomePage.jsx';
import SearchResultsPage from './SearchResultsPage.jsx'; 
import ListSpacePage from './ListSpacePage.jsx';
import SpaceDetailPage from './SpaceDetailPage.jsx';
import DashboardPage from './DashboardPage.jsx'; 

import { collection, getDocs, setDoc, doc, query, where, getDoc, addDoc, Timestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from './firebase.js';

// --- SHARED COMPONENTS ---
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const AuthModal = ({ mode, onClose, setAuthMode }) => { 
    const [name, setName] = useState(''); 
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [userType, setUserType] = useState('professional'); 
    const [error, setError] = useState(''); 
    const [loading, setLoading] = useState(false); 
    const isSignUp = mode === 'signup'; 
    const handleSignUp = async (e) => { e.preventDefault(); setLoading(true); setError(''); try { const userCredential = await createUserWithEmailAndPassword(auth, email, password); const user = userCredential.user; await setDoc(doc(db, "users", user.uid), { name: name, email: user.email, joinDate: Timestamp.now(), userType: userType }); onClose(); } catch (error) { setError(error.message); } setLoading(false); }; 
    const handleLogin = async (e) => { e.preventDefault(); setLoading(true); setError(''); try { await signInWithEmailAndPassword(auth, email, password); onClose(); } catch (error) { setError(error.message); } setLoading(false); }; 
    return ( <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"><div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md relative"><button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"><XIcon /></button><h2 className="text-2xl font-bold text-center mb-6">{isSignUp ? 'Create Your Account' : 'Welcome Back'}</h2><form onSubmit={isSignUp ? handleSignUp : handleLogin}>{isSignUp && ( <> <div className="mb-4"><label className="block text-gray-700 font-semibold mb-2" htmlFor="name">Full Name</label><input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052cc]" required /></div><div className="mb-4"><label className="block text-gray-700 font-semibold mb-2">I am a</label><select value={userType} onChange={(e) => setUserType(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052cc]"><option value="professional">Professional (Looking for a space)</option><option value="partner">Partner (I own a space)</option></select></div></> )}<div className="mb-4"><label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Email Address</label><input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052cc]" required /></div><div className="mb-6"><label className="block text-gray-700 font-semibold mb-2" htmlFor="password">Password</label><input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052cc]" required /></div>{error && <p className="text-red-500 text-sm mb-4">{error}</p>}<button type="submit" disabled={loading} className="w-full bg-[#0052cc] text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400">{loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Log In')}</button></form><p className="text-center text-sm text-gray-600 mt-6">{isSignUp ? 'Already have an account?' : "Don't have an account?"}<button onClick={() => setAuthMode(isSignUp ? 'login' : 'signup')} className="text-[#0052cc] font-semibold hover:underline ml-1">{isSignUp ? 'Log In' : 'Sign Up'}</button></p></div></div> ); 
};
const Header = ({ currentUser, onLoginClick, onSignUpClick, onLogout, setView }) => { 
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false); 
    return ( <header className="bg-white shadow-sm sticky top-0 z-40"><div className="container mx-auto px-6 py-4"><div className="flex justify-between items-center"><img src="https://res.cloudinary.com/dmqjicpcc/image/upload/v170286253/WorkSpaceAfrica_bgyjhe.png" alt="WorkSpace Africa Logo" className="h-8 w-auto cursor-pointer" onClick={() => setView('home')} /><nav className="hidden md:flex items-center space-x-8"><a href="#" onClick={(e) => {e.preventDefault(); setView('searchResults')}} className="text-gray-600 hover:text-[#0052cc] transition-colors duration-300">Find a Space</a><a href="#" onClick={(e) => {e.preventDefault(); setView('list-space')}} className="text-gray-600 hover:text-[#0052cc] transition-colors duration-300">List Your Space</a></nav><div className="hidden md:flex items-center space-x-4">{currentUser ? ( <> <button onClick={() => setView('dashboard')} className="font-semibold text-gray-600 hover:text-[#0052cc] transition-colors duration-300">Dashboard</button> <button onClick={onLogout} className="bg-[#FFB400] text-white font-semibold py-2 px-5 rounded-lg hover:bg-opacity-90 transition-all duration-300">Logout</button> </> ) : ( <> <button onClick={onLoginClick} className="font-semibold text-gray-600 hover:text-[#0052cc] transition-colors duration-300">Login</button> <button onClick={onSignUpClick} className="bg-[#FFB400] text-white font-semibold py-2 px-5 rounded-lg hover:bg-opacity-90 transition-all duration-300">Sign Up</button> </> )}</div><button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2" aria-label="Toggle menu">{mobileMenuOpen ? ( <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> ) : ( <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg> )} </button></div>{mobileMenuOpen && ( <div className="md:hidden mt-4 pb-4 border-t pt-4"><nav className="flex flex-col space-y-4"><a href="#" onClick={() => { setView('searchResults'); setMobileMenuOpen(false); }} className="text-gray-600 hover:text-[#0052cc] font-medium">Find a Space</a><a href="#" onClick={() => { setView('list-space'); setMobileMenuOpen(false); }} className="text-gray-600 hover:text-[#0052cc] font-medium">List Your Space</a><div className="border-t pt-4 space-y-3">{currentUser ? ( <> <button onClick={() => { setView('dashboard'); setMobileMenuOpen(false); }} className="w-full text-left font-semibold text-gray-600 hover:text-[#0052cc]">Dashboard</button> <button onClick={() => { onLogout(); setMobileMenuOpen(false); }} className="w-full bg-[#FFB400] text-white font-semibold py-2 px-5 rounded-lg">Logout</button> </> ) : ( <> <button onClick={() => { onLoginClick(); setMobileMenuOpen(false); }} className="w-full text-left font-semibold text-gray-600 hover:text-[#0052cc]">Login</button> <button onClick={() => { onSignUpClick(); setMobileMenuOpen(false); }} className="w-full bg-[#FFB400] text-white font-semibold py-2 px-5 rounded-lg">Sign Up</button> </> )}</div></nav></div> )}</div></header> ); 
};
const Footer = ({ setView }) => ( <footer className="bg-gray-800 text-white"><div className="container mx-auto px-6 py-12"><div className="grid md:grid-cols-4 gap-8"><div><h3 className="text-xl font-bold">WorkSpace Africa</h3><p className="mt-2 text-gray-400">The intelligent coworking marketplace.</p></div><div><h4 className="font-semibold">Company</h4><ul className="mt-4 space-y-2"><li><a href="#" onClick={() => setView('about')} className="text-gray-400 hover:text-white">About Us</a></li><li><a href="#" onClick={() => setView('contact')} className="text-gray-400 hover:text-white">Contact</a></li></ul></div><div><h4 className="font-semibold">Legal</h4><ul className="mt-4 space-y-2"><li><a href="#" onClick={() => setView('terms')} className="text-gray-400 hover:text-white">Terms of Service</a></li><li><a href="#" onClick={() => setView('privacy')} className="text-gray-400 hover:text-white">Privacy Policy</a></li></ul></div><div><h4 className="font-semibold">Connect</h4></div></div><div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-400"><p>&copy; 2025 WorkSpace Africa. All rights reserved.</p></div></div></footer> );
const SimplePage = ({ title, children }) => ( <div className="container mx-auto px-6 py-12"><h1 className="text-4xl font-bold text-gray-800 mb-8">{title}</h1><div className="bg-white rounded-lg shadow p-8 prose max-w-none">{children}</div></div> );
const BookingConfirmationPage = ({ booking, setView }) => { if (!booking) { return ( <div className="text-center py-20"><p className="text-xl">No booking details found.</p><button onClick={() => setView('home')} className="mt-4 bg-[#0052cc] text-white font-bold py-3 px-6 rounded-lg">Back to Home</button></div> ); } const qrCodeValue = `BookingID: ${booking.id}, Space: ${booking.spaceName}, Date: ${booking.date.toDate().toLocaleDateString()}, User: ${booking.userName}`; return ( <div className="bg-gray-50 py-12"><div className="container mx-auto px-6 max-w-2xl text-center"><div className="bg-white rounded-lg shadow-xl p-8"><h1 className="text-3xl font-bold text-green-600">✅ Booking Confirmed!</h1><p className="text-gray-600 mt-2">You're all set! Present this QR code at check-in.</p><div className="my-8 bg-white p-6 inline-block rounded-lg border"><QRCode value={qrCodeValue} size={200} /></div><div className="text-left bg-gray-50 rounded-lg p-6 border"><h2 className="font-bold text-lg mb-4">Booking Details</h2><div className="space-y-3"><div className="flex justify-between"><span className="font-semibold text-gray-600">Space:</span><span className="font-medium text-gray-800">{booking.spaceName}</span></div><div className="flex justify-between"><span className="font-semibold text-gray-600">Location:</span><span className="font-medium text-gray-800">{booking.spaceLocation}</span></div><div className="flex justify-between"><span className="font-semibold text-gray-600">Date:</span><span className="font-medium text-gray-800">{booking.date.toDate().toLocaleDateString()}</span></div><div className="flex justify-between"><span className="font-semibold text-gray-600">Amount Paid:</span><span className="font-medium text-gray-800">₦{booking.amountPaid.toLocaleString()}</span></div><div className="flex justify-between"><span className="font-semibold text-gray-600">Booking Ref:</span><span className="font-medium text-gray-800">{booking.transactionRef}</span></div></div></div><div className="mt-8 flex flex-col sm:flex-row justify-center gap-4"><button onClick={() => setView('dashboard')} className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300">View My Bookings</button><button onClick={() => setView('home')} className="bg-[#0052cc] text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700">Book Another Space</button></div></div></div></div> ); };


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
  const [latestBooking, setLatestBooking] = useState(null);
  const [previousView, setPreviousView] = useState('home');

  useEffect(() => { const unsubscribe = onAuthStateChanged(auth, async (user) => { setCurrentUser(user); if (user) { const userDocRef = doc(db, "users", user.uid); const userDocSnap = await getDoc(userDocRef); if (userDocSnap.exists()) { setUserProfile(userDocSnap.data()); } else { setUserProfile(null); } } else { setUserProfile(null); } }); return () => unsubscribe(); }, []);
  useEffect(() => { const fetchSpaces = async () => { setIsLoading(true); try { const querySnapshot = await getDocs(collection(db, "spaces")); const spacesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); setSpaces(spacesData); } catch (error) { console.error("Error fetching spaces:", error); } finally { setIsLoading(false); } }; fetchSpaces(); }, [refreshTrigger]);

  const handleSelectSpace = (space) => { setPreviousView(view); setSelectedSpace(space); setView('spaceDetail'); };
  const openModal = (mode) => { setAuthMode(mode); setShowAuthModal(true); };
  const handleLogout = async () => { await signOut(auth); setView('home'); };
  const handleBookingComplete = (newBookingData) => { setLatestBooking(newBookingData); setRefreshTrigger(prev => prev + 1); setView('bookingConfirmation'); };
  const handleSearch = () => { setView('searchResults'); };
  
  const renderView = () => {
    switch (view) {
      case 'list-space': return <ListSpacePage setView={setView} currentUser={currentUser} />;
      case 'searchResults': return <SearchResultsPage spaces={spaces} isLoading={isLoading} onSelectSpace={handleSelectSpace} onBack={() => setView('home')} />;
      case 'dashboard': return <DashboardPage currentUser={currentUser} userProfile={userProfile} refreshTrigger={refreshTrigger} />;
      case 'spaceDetail': return <SpaceDetailPage space={selectedSpace} onBack={() => setView(previousView)} currentUser={currentUser} userProfile={userProfile} openLoginModal={() => openModal('login')} onBookingComplete={handleBookingComplete} />;
      case 'bookingConfirmation': return <BookingConfirmationPage booking={latestBooking} setView={setView} />;
      case 'terms': return <SimplePage title="Terms of Service"><p>Your terms...</p></SimplePage>;
      case 'privacy': return <SimplePage title="Privacy Policy"><p>Your privacy policy...</p></SimplePage>;
      case 'about': return <SimplePage title="About Us"><p>About WorkSpace Africa...</p></SimplePage>;
      case 'contact': return <SimplePage title="Contact Us"><p>Contact info...</p></SimplePage>;
      case 'home': 
      default: 
        return <HomePage spaces={spaces} onSelect={handleSelectSpace} isLoading={isLoading} onSearch={handleSearch} />;
    }
  };

  return (
    <div className="bg-gray-50 font-sans">
      <Header currentUser={currentUser} onLoginClick={() => openModal('login')} onSignUpClick={() => openModal('signup')} onLogout={handleLogout} setView={setView} />
      {showAuthModal && <AuthModal mode={authMode} onClose={() => setShowAuthModal(false)} setAuthMode={setAuthMode} />}
      {/* --- UPDATED --- Added key and className for animation */}
      <main key={view} className="animate-fade-in">
        {renderView()}
      </main>
      <Footer setView={setView} />
    </div>
  );
}