import React from 'react';
import Spinner from './Spinner.jsx'; // <-- Import the new spinner

// --- ICONS for this page ---
const StarIcon = ({ className }) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> );
const WifiIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-700"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg> );
const PowerIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-700"><path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/></svg> );
const VerifiedIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1.5 text-white"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> );

const HeroSection = ({ onSearch }) => ( <section className="bg-gray-50"><div className="container mx-auto px-6 py-20 text-center"><h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight">Find Your Focus. <span className="text-[#0052cc]">Power Your Workday.</span></h1><p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Instantly book vetted coworking spaces in Ibadan with guaranteed power and high-speed WiFi.</p><div className="mt-8 max-w-2xl mx-auto bg-white rounded-full p-2 shadow-lg flex items-center"><input type="text" placeholder="Search by city, e.g., Ibadan" className="w-full bg-transparent text-lg p-3 border-none focus:ring-0"/><button onClick={onSearch} className="bg-[#0052cc] text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-colors duration-300">Search</button></div></div></section> );
const StatsSection = () => ( <section className="bg-[#0052cc] bg-opacity-5 py-16"><div className="container mx-auto px-6"><div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"><div><p className="text-4xl lg:text-5xl font-bold text-[#0052cc]">500+</p><p className="text-gray-600 mt-2">Happy Professionals</p></div><div><p className="text-4xl lg:text-5xl font-bold text-[#0052cc]">15+</p><p className="text-gray-600 mt-2">Vetted Spaces</p></div><div><p className="text-4xl lg:text-5xl font-bold text-[#0052cc]">5,000+</p><p className="text-gray-600 mt-2">Hours Booked</p></div><div><p className="text-4xl lg:text-5xl font-bold text-[#0052cc]">4.8★</p><p className="text-gray-600 mt-2">Average Rating</p></div></div></div></section> );

const SpaceCard = ({ space, onSelect }) => {
  const displayPrice = space.pricing?.day || space.price || 0;
  const displayType = space.pricing?.day ? 'day' : (space.priceType || (space.pricing?.week ? 'week' : 'month'));
  
  return (
    // --- UPDATED --- Added transition classes
    <div onClick={() => onSelect(space)} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transform hover:-translate-y-1 cursor-pointer transition-all duration-300">
      <div className="relative"><img src={space.imageUrl} alt={space.name} className="w-full h-48 object-cover" /><div className="absolute top-3 left-3 bg-[#0052cc] text-white text-xs font-bold py-1.5 px-3 rounded-full flex items-center"><VerifiedIcon />Vetted by WorkSpace Africa</div></div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 truncate">{space.name}</h3>
        <p className="text-gray-500 mt-1">{space.location}</p>
        <div className="flex items-center mt-3 text-gray-800"><StarIcon className="h-5 w-5 text-yellow-500" /><span className="font-bold ml-1">{space.rating}</span><span className="text-gray-500 ml-2">({space.reviews} reviews)</span></div>
        <div className="flex items-center space-x-4 mt-4 border-t pt-4"><div className="flex items-center space-x-2 text-sm text-gray-600"><WifiIcon /> <span>Fast WiFi</span></div><div className="flex items-center space-x-2 text-sm text-gray-600"><PowerIcon /> <span>24/7 Power</span></div></div>
        <div className="mt-4 text-right">
          <p className="text-2xl font-bold text-[#0052cc]">
            ₦{displayPrice.toLocaleString()}
            {displayType && <span className="text-base font-normal text-gray-500">/{displayType}</span>}
          </p>
        </div>
      </div>
    </div>
  );
};

const FeaturedSpaces = ({ spaces, onSelect, isLoading }) => ( 
    <section className="bg-white py-16">
        <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Featured Workspaces in Ibadan</h2>
            <p className="text-center text-gray-600 mb-10">Handpicked and vetted for quality and reliability.</p>
            {/* --- UPDATED --- Use the Spinner component */}
            {isLoading ? <Spinner /> : ( 
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {spaces.map((space) => ( <SpaceCard key={space.id} space={space} onSelect={onSelect} /> ))}
                </div> 
            )}
        </div>
    </section> 
);
const TestimonialsSection = () => { const testimonials = [ { name: 'Tunde Anjola', role: 'Lead Developer, TechSavvy Inc.', review: "WorkSpace Africa is a game-changer...", avatar: 'https://placehold.co/100x100/0052cc/FFFFFF?text=TA' }, { name: 'Chioma Okoro', role: 'Freelance Designer', review: "The quality of the spaces is top-notch...", avatar: 'https://placehold.co/100x100/FFB400/FFFFFF?text=CO' }, { name: 'Femi Adebayo', role: 'Marketing Consultant', review: "Finally, a platform that understands the Nigerian market...", avatar: 'https://placehold.co/100x100/000000/FFFFFF?text=FA' } ]; return ( <section className="bg-white py-20"><div className="container mx-auto px-6"><h2 className="text-3xl font-bold text-center text-gray-800 mb-4">What Our Community Says</h2><p className="text-center text-gray-600 mb-12">Trusted by the best professionals and teams in Nigeria.</p><div className="grid grid-cols-1 md:grid-cols-3 gap-8">{testimonials.map((t, index) => ( <div key={index} className="bg-gray-50 p-8 rounded-lg border border-gray-100 hover:shadow-lg transition-shadow duration-300"><div className="flex items-center gap-4 mb-4"><img src={t.avatar} className="w-14 h-14 rounded-full" alt={t.name} /><div><p className="font-bold text-gray-800">{t.name}</p><p className="text-sm text-gray-600">{t.role}</p></div></div><p className="text-gray-700 leading-relaxed">"{t.review}"</p><div className="mt-4 text-yellow-500 flex items-center"><StarIcon className="h-5 w-5" /><StarIcon className="h-5 w-5" /><StarIcon className="h-5 w-5" /><StarIcon className="h-5 w-5" /><StarIcon className="h-5 w-5" /></div></div> ))}</div></div></section> ); };

export default function HomePage({ spaces, onSelect, isLoading, onSearch }) {
    return (
        <>
            <HeroSection onSearch={onSearch} />
            <StatsSection />
            <FeaturedSpaces spaces={spaces} onSelect={onSelect} isLoading={isLoading} />
            <TestimonialsSection />
        </>
    );
}