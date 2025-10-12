import React, { useState, useEffect } from 'react';
import { MapPin, Star, Search, Home, Heart, User, LogOut, AlertCircle, Phone, Briefcase, TrendingUp, Users, Calendar, X, Building, CheckCircle, Clock, BarChart2, Settings, Shield, PlusCircle, Edit, Trash2, ChevronDown, ArrowRight, Sun, Moon } from 'lucide-react';

// --- MOCK DATA (Simulates a database) ---

const mockUsers = {
  'user@test.com': { name: 'Alex Doe', role: 'user' },
  'francis@sebshub.com': { name: "Francis (Seb's Hub)", role: 'partner', spaceIds: ['1'] },
  'worknub@email.com': { name: 'Worknub Team', role: 'partner', spaceIds: ['2'] },
  'admin@workspace.com': { name: 'Admin', role: 'admin' },
};

const mockSpaces = [
  {
    id: '1', ownerEmail: 'francis@sebshub.com', name: "Seb's Hub", location: 'Awolowo Road, Ibadan', price: 3000, rating: 4.8, reviews: 124,
    amenities: ['24/7 Power', 'High-Speed WiFi', 'AC', 'Kitchen', 'Meeting Rooms'],
    images: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop'
    ],
    description: 'A premium, vibrant workspace in the heart of Ibadan. Known for its strong community and reliable amenities, Seb\'s Hub is perfect for freelancers and small teams who value both productivity and connection.',
    capacity: 20, featured: true
  },
  {
    id: '2', ownerEmail: 'worknub@email.com', name: 'Worknub', location: 'Victoria Island, Lagos', price: 3500, rating: 4.7, reviews: 198,
    amenities: ['Super Fast WiFi', 'AC', 'Kitchen', 'Event Space', 'Parking'],
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop',
    ],
    description: 'State-of-the-art coworking space in VI with modern facilities. Ideal for growing businesses and corporate teams needing a professional environment.',
    capacity: 50, featured: true
  },
  {
    id: '3', ownerEmail: 'stargate@email.com', name: 'Stargate Workstation', location: 'Cocoa House, Ibadan', price: 4500, rating: 4.6, reviews: 87,
    amenities: ['Private Offices', 'High-Speed Internet', 'Reception', 'AC'],
    images: [
      'https://images.unsplash.com/photo-1553531889-e6cf89d16cb0?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&h=600&fit=crop',
    ],
    description: 'Professional private offices with premium amenities in a prestigious location. Designed for serious entrepreneurs and established businesses.',
    capacity: 30, featured: false
  }
];

const mockBookings = [
    {id: 'B101', spaceId: '1', userEmail: 'user@test.com', date: '2025-10-28', hours: 4, totalPrice: 12000, status: 'Confirmed'},
    {id: 'B102', spaceId: '2', userEmail: 'user@test.com', date: '2025-11-05', hours: 8, totalPrice: 28000, status: 'Pending'},
    {id: 'B103', spaceId: '1', userEmail: 'another@test.com', date: '2025-10-29', hours: 2, totalPrice: 6000, status: 'Pending'},
];


// --- Reusable UI Components ---
const StatCard = ({ icon, label, value, color }) => {
  const colorClasses = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-500' },
    green: { bg: 'bg-green-50', text: 'text-green-600', icon: 'text-green-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'text-purple-500' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'text-orange-500' },
  };
  const classes = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`p-6 rounded-2xl ${classes.bg}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-gray-600">{label}</p>
        {React.cloneElement(icon, { size: 22, className: classes.icon })}
      </div>
      <p className={`text-3xl font-bold ${classes.text}`}>{value}</p>
    </div>
  );
};

const Header = ({ user, onLogout, navigate }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div onClick={() => navigate('home')} className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-800 text-white font-black text-2xl">W</div>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">WorkSpace Africa</h1>
        </div>
        <nav className="flex items-center gap-4">
          <a onClick={() => navigate('browse')} className="text-gray-600 hover:text-gray-900 font-semibold cursor-pointer">Browse</a>
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 p-2 rounded-full bg-gray-100">
                <User size={18} className="text-gray-600" />
                <span className="font-semibold text-sm">{user.name}</span>
                <ChevronDown size={16} />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl overflow-hidden hidden group-hover:block z-50 border">
                {user.role === 'user' && <a onClick={() => navigate('userDashboard')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">My Bookings</a>}
                {user.role === 'partner' && <a onClick={() => navigate('ownerDashboard')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Owner Dashboard</a>}
                {user.role === 'admin' && <a onClick={() => navigate('adminDashboard')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Admin Dashboard</a>}
                <a onClick={onLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer border-t">Log Out</a>
              </div>
            </div>
          ) : (
            <button onClick={() => navigate('login')} className="bg-gray-800 text-white font-bold px-5 py-2 rounded-lg hover:bg-gray-700 transition">
              Log In
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

// --- Page Components ---

const HomePage = ({ navigate }) => (
    <div className="text-center py-20 px-4 bg-gray-50">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">The Future of Work is Here. Find Your Space.</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">The premier discovery platform for Nigeria's best coworking spaces. Connect with verified, productive environments.</p>
        <div className="relative max-w-lg mx-auto">
            <input type="text" placeholder="Search for a city, e.g., 'Ibadan'" className="w-full text-lg p-4 pl-6 pr-16 rounded-full border-2 border-gray-300 focus:outline-none focus:border-gray-800" />
            <button onClick={() => navigate('browse')} className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700">
                <Search size={24} />
            </button>
        </div>
    </div>
);

const BrowsePage = ({ spaces, navigate }) => (
    <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Explore Workspaces</h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {spaces.map(space => (
                <div key={space.id} onClick={() => navigate('spaceDetail', space.id)} className="bg-white rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group">
                    <div className="relative h-56">
                        <img src={space.images[0]} alt={space.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    </div>
                    <div className="p-4">
                        <h3 className="font-bold text-gray-800 text-lg">{space.name}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><MapPin size={14} /> {space.location}</p>
                        <div className="flex justify-between items-end pt-3 mt-2 border-t border-gray-100">
                            <div>
                                <p className="text-gray-500 text-xs">From</p>
                                <p className="font-bold text-gray-900 text-lg">₦{space.price.toLocaleString()}<span className="font-normal text-sm text-gray-500">/day</span></p>
                            </div>
                            <div className="flex items-center gap-1">
                                <Star size={16} fill="#fbbf24" color="#fbbf24" />
                                <span className="text-sm font-semibold text-gray-800">{space.rating}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const SpaceDetailPage = ({ space }) => (
    <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <h1 className="text-4xl font-bold">{space.name}</h1>
                <p className="text-gray-600 flex items-center gap-2 my-2 text-lg"><Star size={16} /> {space.rating} ({space.reviews} reviews) <span className="mx-2">•</span> <MapPin size={16} /> {space.location}</p>
                <div className="grid grid-cols-2 gap-2 mt-4 h-96">
                    <img src={space.images[0]} className="w-full h-full object-cover rounded-l-2xl" />
                    <div className="grid grid-cols-2 gap-2">
                        <img src={space.images[1]} className="w-full h-full object-cover" />
                        <img src={space.images[2]} className="w-full h-full object-cover rounded-tr-2xl" />
                         <img src={space.images[0]} className="w-full h-full object-cover" />
                        <img src={space.images[1]} className="w-full h-full object-cover rounded-br-2xl" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold mt-8 border-b pb-2">About this space</h2>
                <p className="text-gray-700 mt-4 leading-relaxed">{space.description}</p>
                <h2 className="text-2xl font-bold mt-8 border-b pb-2">Amenities</h2>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    {space.amenities.map(a => <p key={a} className="flex items-center gap-2"><CheckCircle size={18} className="text-green-500" /> {a}</p>)}
                </div>
            </div>
            <div className="md:col-span-1">
                <div className="sticky top-24 bg-white border rounded-2xl p-6 shadow-lg">
                    <p className="text-2xl font-bold mb-4">Book Your Spot</p>
                    <p className="text-3xl font-extrabold">₦{space.price.toLocaleString()} <span className="font-normal text-lg">/ day</span></p>
                    <div className="mt-4">
                        <label className="font-semibold text-sm">Date</label>
                        <input type="date" className="w-full mt-1 p-3 border rounded-lg" />
                    </div>
                    <div className="mt-4">
                        <label className="font-semibold text-sm">Booking Type</label>
                        <select className="w-full mt-1 p-3 border rounded-lg">
                            <option>Daily Desk</option>
                            <option>Hourly Desk</option>
                            <option>Meeting Room (Hourly)</option>
                        </select>
                    </div>
                    <button className="w-full mt-6 bg-gray-800 text-white font-bold py-4 rounded-lg text-lg hover:bg-gray-700 transition">Book Now</button>
                </div>
            </div>
        </div>
    </div>
);


const LoginPage = ({ onLogin, navigate }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    return (
        <div className="flex items-center justify-center py-20 bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
                <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
                <p className="text-center text-gray-600 mb-6">Log in to manage your world.</p>
                <input type="email" placeholder="Email (e.g., user@test.com)" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-4 mb-4 border rounded-lg" />
                <input type="password" placeholder="Password (any)" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-4 mb-6 border rounded-lg" />
                <button onClick={() => onLogin(email, password)} className="w-full bg-gray-800 text-white font-bold py-4 rounded-lg text-lg hover:bg-gray-700 transition">Sign In</button>
                <div className="p-4 mt-6 bg-slate-50 rounded-xl border text-xs text-gray-600">
                  <p className="font-bold flex items-center gap-2 mb-2"><AlertCircle size={16} /> Demo Credentials</p>
                  <p><b className="font-semibold">User:</b> user@test.com</p>
                  <p><b className="font-semibold">Partner:</b> francis@sebshub.com</p>
                  <p><b className="font-semibold">Admin:</b> admin@workspace.com</p>
                </div>
            </div>
        </div>
    );
};

// --- Role-Based Dashboards ---

const UserDashboard = ({ user, bookings, spaces }) => (
    <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>
        <div className="grid md:grid-cols-3 gap-6">
            <StatCard icon={<Calendar/>} label="Upcoming Bookings" value={bookings.filter(b => b.userEmail === user.email && b.status !== 'Completed').length} color="blue" />
            <StatCard icon={<Heart/>} label="Saved Spaces" value={"3"} color="orange" /> 
        </div>
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
            <div className="space-y-4">
                {bookings.filter(b => b.userEmail === user.email).map(booking => {
                    const space = spaces.find(s => s.id === booking.spaceId);
                    return (
                        <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <p className="font-bold">{space.name}</p>
                                <p className="text-sm text-gray-500">{booking.date}</p>
                            </div>
                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{booking.status}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    </div>
);

const OwnerDashboard = ({ user, spaces, bookings, onUpdateBooking, onAddSpace }) => {
    const mySpaces = spaces.filter(s => s.ownerEmail === user.email);
    const myBookings = bookings.filter(b => mySpaces.some(s => s.id === b.spaceId));
    
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Owner Dashboard</h1>
                <button onClick={onAddSpace} className="bg-gray-800 text-white font-bold px-5 py-2 rounded-lg hover:bg-gray-700 transition flex items-center gap-2"><PlusCircle size={18}/> Add New Space</button>
            </div>
             <div className="grid md:grid-cols-4 gap-6">
                <StatCard icon={<TrendingUp/>} label="Total Revenue" value="₦128k" color="green" />
                <StatCard icon={<Calendar/>} label="Total Bookings" value={myBookings.length} color="blue" />
                <StatCard icon={<Building/>} label="My Spaces" value={mySpaces.length} color="purple" />
                <StatCard icon={<Users/>} label="New Inquiries" value="12" color="orange" />
            </div>

            <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm">
                 <h2 className="text-2xl font-bold mb-4">Manage Bookings</h2>
                 <table className="w-full text-left">
                     <thead><tr className="border-b"><th className="p-2">User</th><th className="p-2">Space</th><th className="p-2">Date</th><th className="p-2">Status</th><th className="p-2">Actions</th></tr></thead>
                     <tbody>
                         {myBookings.map(b => (
                             <tr key={b.id} className="border-b hover:bg-gray-50">
                                 <td className="p-2">{b.userEmail}</td>
                                 <td className="p-2">{spaces.find(s=>s.id === b.spaceId)?.name}</td>
                                 <td className="p-2">{b.date}</td>
                                 <td className="p-2"><span className={`px-3 py-1 text-xs font-bold rounded-full ${b.status === 'Confirmed' ? 'bg-green-100 text-green-700' : b.status === 'Declined' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{b.status}</span></td>
                                 <td className="p-2">
                                     {b.status === 'Pending' && <div className="flex gap-2">
                                         <button onClick={() => onUpdateBooking(b.id, 'Confirmed')} className="text-green-600 hover:text-green-800"><CheckCircle size={18}/></button>
                                         <button onClick={() => onUpdateBooking(b.id, 'Declined')} className="text-red-600 hover:text-red-800"><X size={18}/></button>
                                     </div>}
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
            </div>
        </div>
    );
};

const AdminDashboard = ({ spaces, users, bookings }) => (
    <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid md:grid-cols-4 gap-6">
            <StatCard icon={<TrendingUp/>} label="Platform Revenue" value="₦750k" color="green" />
            <StatCard icon={<Calendar/>} label="Total Bookings" value={bookings.length} color="blue" />
            <StatCard icon={<Building/>} label="Total Spaces" value={spaces.length} color="purple" />
            <StatCard icon={<Users/>} label="Total Users" value={Object.keys(users).length} color="orange" />
        </div>

        <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Manage Spaces</h2>
            <table className="w-full text-left">
                 <thead><tr className="border-b"><th className="p-2">Name</th><th className="p-2">Location</th><th className="p-2">Owner</th><th className="p-2">Actions</th></tr></thead>
                 <tbody>
                    {spaces.map(s => (
                        <tr key={s.id} className="border-b hover:bg-gray-50">
                            <td className="p-2 font-semibold">{s.name}</td>
                            <td className="p-2">{s.location}</td>
                            <td className="p-2">{s.ownerEmail}</td>
                            <td className="p-2 flex gap-3"><button className="text-blue-600"><Edit size={16}/></button><button className="text-red-600"><Trash2 size={16}/></button></td>
                        </tr>
                    ))}
                 </tbody>
            </table>
        </div>
    </div>
);


// --- Main App Logic ---

export default function WorkSpaceAfrica() {
  const [page, setPage] = useState('home');
  const [pageData, setPageData] = useState(null);
  const [user, setUser] = useState(null);
  const [spaces, setSpaces] = useState(mockSpaces);
  const [bookings, setBookings] = useState(mockBookings);
  
  const navigate = (newPage, data = null) => {
    setPage(newPage);
    setPageData(data);
  };
  
  const handleLogin = (email, password) => {
      if (mockUsers[email]) {
          setUser({ email, ...mockUsers[email] });
          if (mockUsers[email].role === 'admin') navigate('adminDashboard');
          else if (mockUsers[email].role === 'partner') navigate('ownerDashboard');
          else navigate('userDashboard');
      } else {
          alert("User not found. Use one of the demo accounts.");
      }
  };

  const handleLogout = () => {
      setUser(null);
      navigate('home');
  };

  const handleUpdateBooking = (bookingId, status) => {
      setBookings(current => current.map(b => b.id === bookingId ? {...b, status} : b));
  };
    
  const handleAddSpace = () => {
      // In a real app, this would open a form modal. For now, we'll just log it.
      console.log("Add new space form should open here.");
      alert("This would open a form to add a new space.");
  }

  const renderPage = () => {
    if (page === 'home') return <HomePage navigate={navigate} />;
    if (page === 'browse') return <BrowsePage spaces={spaces} navigate={navigate} />;
    if (page === 'spaceDetail') {
        const space = spaces.find(s => s.id === pageData);
        return space ? <SpaceDetailPage space={space} /> : <p>Space not found</p>;
    }
    if (page === 'login') return <LoginPage onLogin={handleLogin} navigate={navigate} />;
    
    // Authenticated Routes
    if (!user) return <LoginPage onLogin={handleLogin} navigate={navigate} />;
    
    if (page === 'userDashboard') return <UserDashboard user={user} bookings={bookings} spaces={spaces} />;
    if (page === 'ownerDashboard' && user.role === 'partner') return <OwnerDashboard user={user} spaces={spaces} bookings={bookings} onUpdateBooking={handleUpdateBooking} onAddSpace={handleAddSpace} />;
    if (page === 'adminDashboard' && user.role === 'admin') return <AdminDashboard spaces={spaces} users={mockUsers} bookings={bookings} />;

    return <p>Page not found or you do not have permission.</p>;
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
        <Header user={user} onLogout={handleLogout} navigate={navigate} />
        <main className="flex-1">
            {renderPage()}
        </main>
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto px-4 py-8 text-center">
                <p>&copy; 2025 WorkSpace Africa. Powering the Future of Work.</p>
            </div>
        </footer>
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
          .font-sans { font-family: 'Inter', sans-serif; }
        `}</style>
    </div>
  );
}

