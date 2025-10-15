import React, { useState, useEffect } from 'react';

// --- SVG ICONS (Self-contained components for easy reuse) ---
const WifiIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-700"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
);
const PowerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-700"><path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/></svg>
);
const StarIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);
const VerifiedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1.5 text-white"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);
const MeetingRoomIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-3 text-[#0052cc]"><path d="M12 22V4"/><path d="M14 2H8"/><path d="M10 22h4"/><path d="M10 12H3.5a2.5 2.5 0 1 1 0-5H10"/><path d="M14 12h6.5a2.5 2.5 0 1 0 0-5H14"/></svg>;
const CoffeeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-3 text-[#0052cc]"><path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v2a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h12z"/><path d="M6 1-2v3a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V-1"/></svg>;
const ParkingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-3 text-[#0052cc]"><path d="M9 18V6h6.5a4.5 4.5 0 1 1 0 9H9z"/></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;


// --- DATA WITH DETAILS FOR DETAIL PAGE ---
const mockSpaces = [
  { 
    id: 1, name: "Seb's Hub", location: "Awolowo Road, Ibadan", price: 10000, priceType: "day", rating: 4.9, reviews: 112, 
    imageUrl: "https://res.cloudinary.com/dmqjicpcc/image/upload/v1760286124/Sebs_4_zcsh2a.jpg",
    description: "Premium and vibrant, with a strong focus on community. Best for freelancers and small teams who value networking and a lively atmosphere.",
    amenities: ['wifi', 'power', 'meeting-room', 'coffee'],
    gallery: [
      "https://res.cloudinary.com/dmqjicpcc/image/upload/v1760286124/Sebs_Hub_1_labjbj.jpg",
      "https://res.cloudinary.com/dmqjicpcc/image/upload/v1760286129/Sebs_2_p8unmy.jpg",
    ]
  },
  { 
    id: 2, name: "Stargate Workstation", location: "Cocoa House, Ibadan", price: 15000, priceType: "day", rating: 4.8, reviews: 88, 
    imageUrl: "https://res.cloudinary.com/dmqjicpcc/image/upload/v1760286178/Stargate_1_ndxn7o.jpg",
    description: "Professional and prestigious, located in an iconic building. Primarily offers private offices for established entrepreneurs and businesses requiring a formal setting.",
    amenities: ['wifi', 'power', 'meeting-room', 'parking'],
    gallery: [
      "https://res.cloudinary.com/dmqjicpcc/image/upload/v1760286197/Stargate_4_tmz1ms.jpg",
      "https://res.cloudinary.com/dmqjicpcc/image/upload/v1760286185/Stargate_3_i8jupc.jpg",
    ]
  },
  { 
    id: 3, name: "Worknub", location: "Agodi GRA, Ibadan", price: 12500, priceType: "day", rating: 4.9, reviews: 95, 
    imageUrl: "https://res.cloudinary.com/dmqjicpcc/image/upload/v1760286220/Woknub_1_ojpgrx.jpg",
    description: "State-of-the-art and modern, with a corporate-friendly feel. Excellent for growing businesses, remote teams, and hosting professional events.",
    amenities: ['wifi', 'power', 'meeting-room', 'coffee', 'parking'],
    gallery: [
      "https://res.cloudinary.com/dmqjicpcc/image/upload/v1760286228/Worknub_2_szwo6w.jpg",
      "https://res.cloudinary.com/dmqjicpcc/image/upload/v1760286221/Worknub_3_fmgtms.jpg",
    ]
  },
  { 
    id: 4, name: "Nesta Hub", location: "Bodija, Ibadan", price: 8500, priceType: "day", rating: 4.8, reviews: 65, 
    imageUrl: "https://placehold.co/600x400/0052cc/FFFFFF?text=Nesta+Hub",
    description: "A modern innovation center designed for the tech community. Ideal for startups, developers, and collaborative projects.",
    amenities: ['wifi', 'power', 'meeting-room'],
    gallery: [
      "https://placehold.co/800x600/0052cc/FFFFFF?text=Lounge+Area",
      "https://placehold.co/800x600/0052cc/FFFFFF?text=Event+Space",
    ]
  },
  { 
    id: 5, name: "TheBunker", location: "Bodija, Ibadan", price: 7500, priceType: "day", rating: 4.7, reviews: 42, 
    imageUrl: "https://res.cloudinary.com/dmqjicpcc/image/upload/v1716301389/1001493840.jpg",
    description: "Industrial-chic and minimalist, designed as a distraction-free environment for deep, focused work. Targets tech professionals, developers, and creatives.",
    amenities: ['wifi', 'power', 'coffee'],
    gallery: [
      "https://res.cloudinary.com/dmqjicpcc/image/upload/v1716301386/1001493836.jpg",
    ]
  },
];


// --- COMPONENTS ---
const Header = ({ onBack }) => (
  <header className="bg-white shadow-sm sticky top-0 z-50">
    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
      <img src="https://res.cloudinary.com/dmqjicpcc/image/upload/v1760286253/WorkSpaceAfrica_bgyjhe.png" alt="WorkSpace Africa Logo" className="h-8 w-auto" />
      <nav className="hidden md:flex items-center space-x-8"><a href="#" className="text-gray-600 hover:text-[#0052cc]">Find a Space</a><a href="#" className="text-gray-600 hover:text-[#0052cc]">List Your Space</a></nav>
      <div className="flex items-center space-x-4"><button className="hidden md:block text-gray-600 hover:text-[#0052cc]">Sign In</button><button className="bg-[#FFB400] text-white font-semibold py-2 px-5 rounded-lg hover:bg-opacity-90 transition-all">Sign Up</button></div>
    </div>
  </header>
);

const HeroSection = () => (
  <section className="bg-gray-50"><div className="container mx-auto px-6 py-20 text-center"><h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight">Find Your Focus. <span className="text-[#0052cc]">Power Your Workday.</span></h1><p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Instantly book vetted coworking spaces in Ibadan with guaranteed power and high-speed WiFi.</p><div className="mt-8 max-w-2xl mx-auto bg-white rounded-full p-2 shadow-lg flex items-center"><input type="text" placeholder="Search by city, e.g., Ibadan" className="w-full bg-transparent text-lg p-3 border-none focus:ring-0"/><button className="bg-[#0052cc] text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-colors">Search</button></div></div></section>
);

const SpaceCard = ({ space, onSelect }) => (
  <div onClick={() => onSelect(space)} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer">
    <div className="relative"><img src={space.imageUrl} alt={space.name} className="w-full h-48 object-cover" /><div className="absolute top-3 left-3 bg-[#0052cc] text-white text-xs font-bold py-1.5 px-3 rounded-full flex items-center"><VerifiedIcon />Vetted by WorkSpace Africa</div></div>
    <div className="p-5"><h3 className="text-xl font-bold text-gray-800 truncate">{space.name}</h3><p className="text-gray-500 mt-1">{space.location}</p><div className="flex items-center mt-3 text-gray-800"><StarIcon className="h-5 w-5 text-yellow-500" /><span className="font-bold ml-1">{space.rating}</span><span className="text-gray-500 ml-2">({space.reviews} reviews)</span></div><div className="flex items-center space-x-4 mt-4 border-t pt-4"><div className="flex items-center space-x-2 text-sm text-gray-600"><WifiIcon /> <span>Fast WiFi</span></div><div className="flex items-center space-x-2 text-sm text-gray-600"><PowerIcon /> <span>24/7 Power</span></div></div><div className="mt-4 text-right"><p className="text-2xl font-bold text-[#0052cc]">₦{space.price.toLocaleString()}<span className="text-base font-normal text-gray-500">/{space.priceType}</span></p></div></div>
  </div>
);

const FeaturedSpaces = ({ spaces, onSelect }) => (
  <section className="bg-white py-16"><div className="container mx-auto px-6"><h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Featured Workspaces in Ibadan</h2><p className="text-center text-gray-600 mb-10">Handpicked and vetted for quality and reliability.</p><div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">{spaces.map(space => <SpaceCard key={space.id} space={space} onSelect={onSelect} />)}</div></div></section>
);

const SpaceDetailPage = ({ space, onBack }) => {
    const amenityIcons = {
        'wifi': { icon: <WifiIcon />, name: "High-Speed WiFi" },
        'power': { icon: <PowerIcon />, name: "Guaranteed Power" },
        'meeting-room': { icon: <MeetingRoomIcon />, name: "Meeting Rooms" },
        'coffee': { icon: <CoffeeIcon />, name: "Free Coffee" },
        'parking': { icon: <ParkingIcon />, name: "On-site Parking" },
    };

    return (
    <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button onClick={onBack} className="mb-6 inline-flex items-center text-gray-600 hover:text-[#0052cc] font-semibold"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>Back to listings</button>
            <div className="grid grid-cols-3 grid-rows-2 gap-2 h-[500px] rounded-2xl overflow-hidden">
                <div className="col-span-2 row-span-2"><img src={space.imageUrl} alt={space.name} className="w-full h-full object-cover"/></div>
                <div className="col-span-1 row-span-1"><img src={space.gallery[0]} alt={`${space.name} gallery 1`} className="w-full h-full object-cover"/></div>
                <div className="col-span-1 row-span-1"><img src={space.gallery[1]} alt={`${space.name} gallery 2`} className="w-full h-full object-cover"/></div>
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
                    <ul className="mt-6 grid grid-cols-2 gap-y-4">
                        {space.amenities.map(amenity => (
                            <li key={amenity} className="flex items-center text-lg text-gray-700">
                                {amenityIcons[amenity]?.icon || ''}
                                <span>{amenityIcons[amenity]?.name || amenity}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-32">
                        <p className="text-3xl font-bold text-[#0052cc]">₦{space.price.toLocaleString()}<span className="text-xl font-normal text-gray-500">/{space.priceType}</span></p>
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3"/>
                        </div>
                        <button className="mt-8 w-full bg-[#FFB400] text-white font-bold py-4 px-6 rounded-lg text-lg hover:bg-opacity-90 transition-all">Book Now</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
}

const Footer = () => (
    <footer className="bg-gray-800 text-white"><div className="container mx-auto px-6 py-12"><div className="grid md:grid-cols-4 gap-8"><div><h3 className="text-xl font-bold">WorkSpace Africa</h3><p className="mt-2 text-gray-400">The intelligent coworking marketplace.</p></div><div><h4 className="font-semibold">For Professionals</h4><ul className="mt-4 space-y-2"><li><a href="#" className="text-gray-400 hover:text-white">Find a Space</a></li></ul></div><div><h4 className="font-semibold">For Partners</h4><ul className="mt-4 space-y-2"><li><a href="#" className="text-gray-400 hover:text-white">List Your Space</a></li></ul></div><div><h4 className="font-semibold">Company</h4><ul className="mt-4 space-y-2"><li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li><li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li></ul></div></div><div className="mt-12 border-t border-gray-700 pt-8 flex justify-between items-center"><p className="text-gray-400">&copy; 2025 WorkSpace Africa. All rights reserved.</p></div></div></footer>
);

// --- MAIN APP COMPONENT ---
export default function App() {
  const [spaces, setSpaces] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState(null);
  
  useEffect(() => {
    setSpaces(mockSpaces);
  }, []);

  const handleSelectSpace = (space) => {
    setSelectedSpace(space);
    window.scrollTo(0, 0); // Scroll to top when a space is selected
  };

  const handleGoBack = () => {
    setSelectedSpace(null);
  };

  if (selectedSpace) {
    return (
        <>
            <Header />
            <SpaceDetailPage space={selectedSpace} onBack={handleGoBack} />
            <Footer />
        </>
    );
  }

  return (
    <div className="bg-gray-50 font-sans">
      <Header />
      <main>
        <HeroSection />
        <FeaturedSpaces spaces={spaces} onSelect={handleSelectSpace} />
      </main>
      <Footer />
    </div>
  );
}

