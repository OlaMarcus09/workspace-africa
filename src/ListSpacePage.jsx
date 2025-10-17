import React, { useState } from 'react';
// --- NEW --- Import Firebase services
import { db, storage } from './firebase.js';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// --- Icon (No changes here) ---
const UploadCloudIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-gray-500 mb-2">
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/>
  </svg>
);

// --- Main List Your Space Page Component ---
export default function ListSpacePage({ setView, currentUser }) {
  const [spaceDetails, setSpaceDetails] = useState({
    name: '',
    location: '',
    description: '',
    amenities: [],
    pricing: { day: '', week: '', month: '' }
  });
  
  const [mainImage, setMainImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSpaceDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePricingChange = (e) => {
    const { name, value } = e.target;
    setSpaceDetails(prev => ({
        ...prev,
        pricing: { ...prev.pricing, [name]: value ? parseInt(value) : '' }
    }));
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAmenityChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSpaceDetails(prev => ({ ...prev, amenities: [...prev.amenities, value] }));
    } else {
      setSpaceDetails(prev => ({ ...prev, amenities: prev.amenities.filter(a => a !== value) }));
    }
  };
  
  // --- UPDATED --- handleSubmit function with Firebase logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
        alert("Please log in as a partner to list a space.");
        return;
    }
    if (!mainImage) {
        alert("Please upload a main image for your space.");
        return;
    }
    if (!spaceDetails.pricing.day && !spaceDetails.pricing.week && !spaceDetails.pricing.month) {
        alert("Please enter at least one price for your space.");
        return;
    }
    
    setIsLoading(true);

    try {
        // 1. Upload Image to Firebase Storage
        const imageRef = ref(storage, `spaces/${Date.now()}-${mainImage.name}`);
        const snapshot = await uploadBytes(imageRef, mainImage);
        
        // 2. Get the public URL of the uploaded image
        const imageUrl = await getDownloadURL(snapshot.ref);

        // 3. Save Form Data (including image URL) to Firestore
        await addDoc(collection(db, "spaces"), {
            ownerId: currentUser.uid,
            name: spaceDetails.name,
            location: spaceDetails.location,
            description: spaceDetails.description,
            amenities: spaceDetails.amenities,
            pricing: spaceDetails.pricing,
            imageUrl: imageUrl, // Use the URL from Storage
            createdAt: serverTimestamp(),
            // Add default rating and reviews, as new spaces won't have any yet
            rating: 5.0, 
            reviews: 0,
        });

        alert('Congratulations! Your space has been listed successfully.');
        setView('dashboard'); // Redirect to the partner dashboard

    } catch (error) {
        console.error("Error listing space:", error);
        alert('There was an error listing your space. Please try again.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Become a Partner</h1>
          <p className="text-gray-600 mt-2">List your space on WorkSpace Africa and start earning.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            {/* The rest of your form JSX remains exactly the same */}
            <div className="border-b pb-8">
                <h2 className="text-xl font-semibold text-gray-700">1. Space Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div><label htmlFor="name" className="block text-sm font-medium text-gray-700">Workspace Name</label><input type="text" name="name" id="name" required value={spaceDetails.name} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0052cc] focus:ring-[#0052cc] sm:text-sm p-2"/></div>
                    <div><label htmlFor="location" className="block text-sm font-medium text-gray-700">Location / Area</label><input type="text" name="location" id="location" required placeholder="e.g., Bodija, Ibadan" value={spaceDetails.location} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0052cc] focus:ring-[#0052cc] sm:text-sm p-2"/></div>
                </div>
                <div className="mt-6"><label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label><textarea name="description" id="description" rows="4" required value={spaceDetails.description} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0052cc] focus:ring-[#0052cc] sm:text-sm p-2"></textarea></div>
            </div>
            <div className="border-b pb-8">
                <h2 className="text-xl font-semibold text-gray-700">2. Photos</h2>
                <p className="text-sm text-gray-500 mt-1">Upload a high-quality main image for your workspace.</p>
                <div className="mt-4"><div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"><div className="space-y-1 text-center">{imagePreview ? <img src={imagePreview} alt="Space preview" className="mx-auto h-48 w-auto rounded-md"/> : <> <UploadCloudIcon /> <div className="flex text-sm text-gray-600"><label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#0052cc] hover:text-blue-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"><span>Upload a file</span><input id="file-upload" name="file-upload" type="file" accept="image/*" onChange={handleImageChange} className="sr-only" /></label><p className="pl-1">or drag and drop</p></div><p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p></> }</div></div>{imagePreview && <button type="button" onClick={() => {setImagePreview(''); setMainImage(null);}} className="mt-2 text-sm text-red-600 hover:text-red-800">Remove image</button>}</div>
            </div>
            <div className="border-b pb-8">
                <h2 className="text-xl font-semibold text-gray-700">3. Pricing</h2>
                <p className="text-sm text-gray-500 mt-1">Set the rates for your space. You don't have to fill all fields.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                    <div><label htmlFor="day" className="block text-sm font-medium text-gray-700">Daily Rate (₦)</label><input type="number" name="day" id="day" min="1000" step="500" value={spaceDetails.pricing.day} onChange={handlePricingChange} placeholder="e.g., 5000" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0052cc] focus:ring-[#0052cc] sm:text-sm p-2"/></div>
                    <div><label htmlFor="week" className="block text-sm font-medium text-gray-700">Weekly Rate (₦)</label><input type="number" name="week" id="week" min="5000" step="1000" value={spaceDetails.pricing.week} onChange={handlePricingChange} placeholder="e.g., 25000" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0052cc] focus:ring-[#0052cc] sm:text-sm p-2"/></div>
                    <div><label htmlFor="month" className="block text-sm font-medium text-gray-700">Monthly Rate (₦)</label><input type="number" name="month" id="month" min="20000" step="5000" value={spaceDetails.pricing.month} onChange={handlePricingChange} placeholder="e.g., 100000" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0052cc] focus:ring-[#0052cc] sm:text-sm p-2"/></div>
                </div>
            </div>
            <div>
                 <h2 className="text-xl font-semibold text-gray-700">4. Amenities</h2>
                 <p className="text-sm text-gray-500">Select all that apply.</p>
                 <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    <label className="flex items-center p-3 border rounded-md hover:bg-gray-50"><input type="checkbox" value="wifi" onChange={handleAmenityChange} className="h-4 w-4 rounded text-[#0052cc] focus:ring-blue-400" /> <span className="ml-2 text-gray-700">High-Speed WiFi</span></label>
                    <label className="flex items-center p-3 border rounded-md hover:bg-gray-50"><input type="checkbox" value="power" onChange={handleAmenityChange} className="h-4 w-4 rounded text-[#0052cc] focus:ring-blue-400" /> <span className="ml-2 text-gray-700">Guaranteed Power</span></label>
                    <label className="flex items-center p-3 border rounded-md hover:bg-gray-50"><input type="checkbox" value="meeting-room" onChange={handleAmenityChange} className="h-4 w-4 rounded text-[#0052cc] focus:ring-blue-400" /> <span className="ml-2 text-gray-700">Meeting Rooms</span></label>
                    <label className="flex items-center p-3 border rounded-md hover:bg-gray-50"><input type="checkbox" value="coffee" onChange={handleAmenityChange} className="h-4 w-4 rounded text-[#0052cc] focus:ring-blue-400" /> <span className="ml-2 text-gray-700">Free Coffee</span></label>
                    <label className="flex items-center p-3 border rounded-md hover:bg-gray-50"><input type="checkbox" value="parking" onChange={handleAmenityChange} className="h-4 w-4 rounded text-[#0052cc] focus:ring-blue-400" /> <span className="ml-2 text-gray-700">On-site Parking</span></label>
                 </div>
            </div>
            <div className="pt-6 text-right"><button type="submit" disabled={isLoading} className="bg-[#FFB400] text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-all disabled:bg-gray-400">{isLoading ? 'Submitting...' : 'List My Space'}</button></div>
          </form>
        </div>
      </div>
    </div>
  );
}