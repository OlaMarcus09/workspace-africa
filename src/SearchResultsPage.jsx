import React, { useState, useMemo } from 'react';

// --- (ICONS remain the same) ---
const StarIcon = ({ className }) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> );
const WifiIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-700"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg> );
const PowerIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-700"><path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/></svg> );
const VerifiedIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1.5 text-white"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> );

const SpaceCard = ({ space, onSelect }) => {
    // --- FINAL FIX ---
    const displayPrice = space.pricing?.day || space.price || 0;
    const displayType = space.pricing?.day ? 'day' : (space.priceType || (space.pricing?.week ? 'week' : 'month'));

  return (
    <div onClick={() => onSelect(space)} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col">
      <div className="relative"><img src={space.imageUrl} alt={space.name} className="w-full h-48 object-cover" /><div className="absolute top-3 left-3 bg-[#0052cc] text-white text-xs font-bold py-1.5 px-3 rounded-full flex items-center"><VerifiedIcon />Vetted</div></div>
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 truncate">{space.name}</h3>
        <p className="text-gray-500 mt-1">{space.location}</p>
        <div className="flex items-center mt-3 text-gray-800"><StarIcon className="h-5 w-5 text-yellow-500" /><span className="font-bold ml-1">{space.rating}</span><span className="text-gray-500 ml-2">({space.reviews} reviews)</span></div>
        <div className="flex items-center space-x-4 mt-4 border-t pt-4"><div className="flex items-center space-x-2 text-sm text-gray-600"><WifiIcon /> <span>Fast WiFi</span></div><div className="flex items-center space-x-2 text-sm text-gray-600"><PowerIcon /> <span>24/7 Power</span></div></div>
        <div className="mt-auto pt-4 text-right">
          <p className="text-2xl font-bold text-[#0052cc]">
            ₦{displayPrice.toLocaleString()}
            {displayType && <span className="text-base font-normal text-gray-500">/{displayType}</span>}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Main Search Results Page Component ---
export default function SearchResultsPage({ spaces, onSelectSpace, isLoading, onBack }) {
  const [priceFilter, setPriceFilter] = useState(20000);
  const [amenitiesFilter, setAmenitiesFilter] = useState({ 'meeting-room': false, 'coffee': false, 'parking': false });
  const [sortOrder, setSortOrder] = useState('default');

  const handleAmenityChange = (amenity) => { setAmenitiesFilter(prev => ({ ...prev, [amenity]: !prev[amenity] })); };

  // --- FINAL FIX --- Filtering and sorting now handle both price structures
  const processedSpaces = useMemo(() => {
    const activeAmenities = Object.keys(amenitiesFilter).filter(key => amenitiesFilter[key]);
    
    let filtered = spaces.filter(space => {
      const priceForFilter = space.pricing?.day || space.price || 999999;
      const priceMatch = priceForFilter <= priceFilter;
      const amenitiesMatch = activeAmenities.every(amenity => space.amenities?.includes(amenity));
      return priceMatch && amenitiesMatch;
    });

    const sorted = [...filtered].sort((a, b) => {
        const priceA = a.pricing?.day || a.price || 999999;
        const priceB = b.pricing?.day || b.price || 999999;
        switch (sortOrder) {
            case 'price_asc': return priceA - priceB;
            case 'price_desc': return priceB - priceA;
            case 'rating_desc': return b.rating - a.rating;
            default: return 0;
        }
    });
    return sorted;
  }, [spaces, priceFilter, amenitiesFilter, sortOrder]);


  return (
    <div className="bg-white">
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
            <button onClick={onBack} className="inline-flex items-center text-gray-600 hover:text-[#0052cc] font-semibold"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>Back to Home</button>
            <h1 className="text-2xl font-bold text-gray-800 hidden sm:block">Workspaces in <span className="text-[#0052cc]">Ibadan</span></h1>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-1/4">
            <div className="sticky top-28">
              <div className="bg-gray-200 h-48 rounded-lg mb-6 flex items-center justify-center"><p className="text-gray-500">Map View Coming Soon</p></div>
              <div className="bg-gray-50 p-6 rounded-lg border">
                <h2 className="text-xl font-bold mb-4">Filters</h2>
                <div>
                  <div className="flex justify-between items-center"><h3 className="font-semibold mb-2">Price Range (Per Day)</h3><span className="font-bold text-[#0052cc]">₦{priceFilter.toLocaleString()}</span></div>
                  <input type="range" min="1000" max="20000" step="500" value={priceFilter} onChange={(e) => setPriceFilter(parseInt(e.target.value))} className="w-full" />
                </div>
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Amenities</h3>
                  <div className="space-y-2">
                    <label className="flex items-center"><input type="checkbox" checked={amenitiesFilter['meeting-room']} onChange={() => handleAmenityChange('meeting-room')} className="h-4 w-4 rounded text-[#0052cc] focus:ring-blue-400" /><span className="ml-2 text-gray-700">Meeting Room</span></label>
                    <label className="flex items-center"><input type="checkbox" checked={amenitiesFilter['coffee']} onChange={() => handleAmenityChange('coffee')} className="h-4 w-4 rounded text-[#0052cc] focus:ring-blue-400" /><span className="ml-2 text-gray-700">Free Coffee</span></label>
                    <label className="flex items-center"><input type="checkbox" checked={amenitiesFilter['parking']} onChange={() => handleAmenityChange('parking')} className="h-4 w-4 rounded text-[#0052cc] focus:ring-blue-400" /><span className="ml-2 text-gray-700">Parking</span></label>
                  </div>
                </div>
              </div>
            </div>
          </aside>
          <main className="w-full lg:w-3/4">
            <div className="flex justify-between items-center mb-4 pb-4 border-b">
                <p className="text-gray-600">Showing <span className="font-bold">{processedSpaces.length}</span> spaces</p>
                <div>
                    <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                        <option value="default">Sort by relevance</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="rating_desc">Rating: High to Low</option>
                    </select>
                </div>
            </div>
            {isLoading ? ( <p>Loading...</p> ) : (
              <>
                {processedSpaces.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {processedSpaces.map((space) => ( <SpaceCard key={space.id} space={space} onSelect={onSelectSpace} /> ))}
                  </div>
                ) : (
                  <div className="text-center py-20"><h3 className="text-xl font-semibold">No results found</h3><p className="text-gray-500 mt-2">Try adjusting your filters to find more spaces.</p></div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}