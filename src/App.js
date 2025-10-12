import React, { useState, useEffect } from 'react';
import { MapPin, Star, Search, Home, Heart, User, LogOut, AlertCircle, Phone, Briefcase, TrendingUp, Users, Calendar, X, Building, CheckCircle, Clock, BarChart2, Settings, Shield } from 'lucide-react';

// --- Reusable UI Components ---

const StatCard = ({ icon, label, value, color }) => {
  const colorClasses = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', icon: 'text-blue-500' },
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', icon: 'text-green-500' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', icon: 'text-purple-500' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600', icon: 'text-orange-500' },
  };
  const classes = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`p-5 rounded-2xl border ${classes.bg} ${classes.border} transition-transform transform hover:scale-105`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-gray-600">{label}</p>
        {React.cloneElement(icon, { size: 22, className: classes.icon })}
      </div>
      <p className={`text-3xl font-bold ${classes.text}`}>{value}</p>
    </div>
  );
};

// --- Main App Component ---

export default function WorkSpaceAfrica() {
  const BRAND_COLOR = '#0A65F1';
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [spaces, setSpaces] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState('login');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({ date: '', hours: 1 });
  const [bookings, setBookings] = useState([]);
  const [partnerStats, setPartnerStats] = useState({});

  const partners = {
    'francis@sebshub.com': { name: "Seb's Hub", spaceId: '1', contact: 'Francis Nduama', phone: '08107180312' },
    'worknub@email.com': { name: 'Worknub', spaceId: '2', contact: 'The Worknub Team', phone: '07077732936' },
    'stargate@email.com': { name: 'Stargate Worksta', spaceId: '3', contact: 'Oyinlola Joseph', phone: '08148431594' }
  };
  const adminCredentials = { email: 'admin@workspace.com', password: 'admin' };

  useEffect(() => {
    const defaultSpaces = [
      {
        id: '1', name: "Seb's Hub", location: 'No 32, Awolowo Road, Ibadan', price: 3000, rating: 4.8, reviews: 124,
        amenities: ['AC', 'Kitchen', 'Meeting Rooms', 'WiFi', 'Power Backup'],
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
        description: 'Premium workspace in the heart of Ibadan with AC, kitchen facilities, and dedicated meeting rooms. Perfect for freelancers and small teams.',
        availableDesks: 18, openHours: '6am - 10pm', contact: 'Francis Nduama', phone: '08107180312', featured: true
      },
      {
        id: '2', name: 'Worknub', location: 'West One Building, VI, Lagos', price: 3500, rating: 4.7, reviews: 198,
        amenities: ['Super Fast WiFi', 'AC', 'Kitchen', 'Meeting Rooms', 'Event Space'],
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=300&fit=crop',
        description: 'State-of-the-art coworking space in Lagos with super fast WiFi, private desks, and modern event facilities. Ideal for growing businesses.',
        availableDesks: 25, openHours: '7am - 9pm', contact: 'The Worknub Team', phone: '07077732936', featured: true
      },
      {
        id: '3', name: 'Stargate Worksta', location: '9th Floor, Cocoa House, Ibadan', price: 4500, rating: 4.6, reviews: 87,
        amenities: ['AC', 'Private Offices', 'High-Speed Internet', 'Reception'],
        image: 'https://images.unsplash.com/photo-1553531889-e6cf89d16cb0?w=500&h=300&fit=crop',
        description: 'Professional private offices with premium amenities in a prestigious location. Designed for serious entrepreneurs and established businesses.',
        availableDesks: 12, openHours: '8am - 8pm', contact: 'Oyinlola Joseph', phone: '08148431594', featured: false
      }
    ];
    setSpaces(defaultSpaces);
    initializeStats(defaultSpaces);
  }, []);

  const initializeStats = (spacesList) => {
    const stats = {};
    spacesList.forEach(space => {
      stats[space.id] = {
        totalBookings: Math.floor(Math.random() * 25) + 15,
        monthlyRevenue: Math.floor(Math.random() * 200000) + 150000,
        occupancyRate: Math.floor(Math.random() * 30) + 70,
        newInquiries: Math.floor(Math.random() * 15) + 8
      };
    });
    setPartnerStats(stats);
  };

  const handleLogin = () => {
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }
    if (email === adminCredentials.email && password === adminCredentials.password) {
      setUser({ email, name: 'Admin' });
      setUserRole('admin');
    } else if (partners[email]) {
      setUser({ email, ...partners[email] });
      setUserRole('partner');
    } else {
      setUser({ email, name: email.split('@')[0] });
      setUserRole('user');
    }
    setEmail('');
    setPassword('');
  };

  const handleLogout = () => {
    setUser(null);
    setUserRole('user');
    setFavorites(new Set());
    setActiveTab('discover');
  };

  const toggleFavorite = (spaceId) => {
    if (!user) {
      alert('Please log in to save spaces');
      setActiveTab('profile');
      return;
    }
    setFavorites(prev => {
      const newFavs = new Set(prev);
      if (newFavs.has(spaceId)) {
        newFavs.delete(spaceId);
      } else {
        newFavs.add(spaceId);
      }
      return newFavs;
    });
  };

  const handleBooking = () => {
    if (!bookingDetails.date) {
      alert('Please select a date');
      return;
    }
    const newBooking = {
      id: 'BK' + Date.now(), userEmail: user.email, spaceId: selectedSpace.id,
      spaceName: selectedSpace.name, date: bookingDetails.date, hours: bookingDetails.hours,
      totalPrice: selectedSpace.price * bookingDetails.hours, status: 'Pending'
    };
    setBookings(prev => [newBooking, ...prev]);
    alert('Booking submitted! The space owner will contact you shortly.');
    setShowBookingModal(false);
    setSelectedSpace(null);
    setBookingDetails({ date: '', hours: 1 });
  };
    
  const updateBookingStatus = (bookingId, newStatus) => {
      setBookings(currentBookings =>
          currentBookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b)
      );
  };

  const filteredSpaces = spaces.filter(space =>
    space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    space.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Reusable Components ---
  const SpaceCard = ({ space }) => {
    const isFavorite = favorites.has(space.id);
    return (
      <div
        onClick={() => setSelectedSpace(space)}
        className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
      >
        <div className="relative h-48">
          <img src={space.image} alt={space.name} className="w-full h-full object-cover" />
          {space.featured && (
            <div className="absolute top-3 right-3 bg-white text-gray-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
              <Star size={14} className="text-yellow-400" fill="currentColor" /> Featured
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-gray-800 text-lg">{space.name}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <MapPin size={14} /> {space.location}
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); toggleFavorite(space.id); }}
              className="p-2 -mr-2 -mt-2 text-slate-300 hover:text-red-500 transition"
            >
              <Heart size={22} fill={isFavorite ? '#ef4444' : 'none'} className={isFavorite ? 'text-red-500' : ''} />
            </button>
          </div>
          <div className="flex justify-between items-end pt-3 border-t border-gray-100">
            <div>
              <p className="text-gray-500 text-xs">From</p>
              <p className="font-bold text-gray-900 text-lg">₦{space.price.toLocaleString()}<span className="font-normal text-sm text-gray-500">/day</span></p>
            </div>
            <div className="flex items-center gap-1">
              <Star size={16} fill="#fbbf24" color="#fbbf24" />
              <span className="text-sm font-semibold text-gray-800">{space.rating}</span>
              <span className="text-xs text-gray-500">({space.reviews})</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SpaceDetail = ({ space }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-end z-50 animate-fade-in">
      <div className="bg-white w-full rounded-t-3xl p-5 max-h-[95vh] overflow-y-auto animate-slide-up">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Space Details</h2>
          <button onClick={() => { setSelectedSpace(null); setShowBookingModal(false); }} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200">
            <X size={20} />
          </button>
        </div>
        <img src={space.image} alt={space.name} className="w-full h-48 object-cover rounded-2xl mb-4" />
        <h1 className="text-2xl font-bold text-gray-900">{space.name}</h1>
        <p className="text-gray-600 flex items-center gap-2 mb-4 text-md">
          <MapPin size={16} color={BRAND_COLOR} /> {space.location}
        </p>
        <div className="mb-5">
          <h3 className="font-bold text-gray-900 mb-3 text-lg">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {space.amenities.map((amenity, idx) => (
              <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle size={14} /> {amenity}
              </span>
            ))}
          </div>
        </div>
        <p className="text-gray-700 mb-5 leading-relaxed">{space.description}</p>
        {!showBookingModal ? (
          <div className="flex gap-3 sticky bottom-0 bg-white py-4 border-t border-gray-100 -mx-5 px-5">
            <button
              onClick={() => toggleFavorite(space.id)}
              className="flex-none p-3 border-2 border-slate-200 rounded-xl hover:bg-slate-50 transition"
            >
              <Heart fill={favorites.has(space.id) ? '#ef4444' : 'none'} className={favorites.has(space.id) ? 'text-red-500' : 'text-slate-400'} />
            </button>
            <button
              onClick={() => user ? setShowBookingModal(true) : setActiveTab('profile')}
              style={{ backgroundColor: BRAND_COLOR }}
              className="flex-1 text-white font-bold py-3 rounded-xl hover:opacity-90 transition text-lg"
            >
              Book for ₦{space.price.toLocaleString()}
            </button>
          </div>
        ) : (
          <div className="p-5 bg-slate-50 rounded-2xl animate-fade-in">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Book Your Desk</h3>
            <div className="mb-3">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Select Date</label>
              <input type="date" value={bookingDetails.date} onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Hours Needed</label>
              <input type="number" min="1" max="8" value={bookingDetails.hours} onChange={(e) => setBookingDetails({ ...bookingDetails, hours: e.target.value })}
                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
            </div>
            <div className="p-3 bg-white rounded-lg mb-4 text-center">
              <p className="text-gray-600 text-sm">Total Cost</p>
              <p className="text-3xl font-bold" style={{ color: BRAND_COLOR }}>₦{(space.price * bookingDetails.hours).toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowBookingModal(false)} className="flex-1 bg-slate-200 text-slate-700 font-bold py-3 rounded-lg hover:bg-slate-300 transition">Cancel</button>
              <button onClick={handleBooking} className="flex-1 bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition">Confirm</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // --- DASHBOARDS ---

  const UserDashboard = () => {
    const userBookings = bookings.filter(b => b.userEmail === user.email);
    const savedSpaces = spaces.filter(space => favorites.has(space.id));
    return (
        <div className="space-y-6 pb-20">
            <div className="text-center">
                <div className="w-24 h-24 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User size={48} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Welcome, {user.name}!</h2>
                <p className="text-gray-600">{user.email}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <StatCard icon={<Calendar />} label="My Bookings" value={userBookings.length} color="blue" />
                <StatCard icon={<Heart />} label="Saved Spaces" value={savedSpaces.length} color="orange" />
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2"><Clock size={20}/> My Recent Bookings</h3>
                {userBookings.length > 0 ? (
                    <div className="space-y-3">
                        {userBookings.slice(0, 3).map(b => (
                             <div key={b.id} className={`border-l-4 p-3 bg-blue-50/50 rounded-r-lg ${b.status === 'Confirmed' ? 'border-green-500' : b.status === 'Declined' ? 'border-red-500' : 'border-yellow-500'}`}>
                                <p className="font-bold text-gray-800 text-sm">{b.spaceName}</p>
                                <p className="text-xs text-gray-500 mt-1">{b.date} • {b.hours} hours</p>
                                <p className={`text-xs font-bold mt-2 uppercase ${b.status === 'Confirmed' ? 'text-green-600' : b.status === 'Declined' ? 'text-red-600' : 'text-yellow-600'}`}>{b.status}</p>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-gray-500 py-6 text-center text-sm">You haven't made any bookings yet.</p>}
            </div>
             <button onClick={handleLogout} className="w-full bg-slate-200 text-slate-800 font-bold py-3.5 rounded-xl hover:bg-slate-300 transition text-md flex items-center justify-center gap-2">
                <LogOut size={18}/> Log Out
            </button>
        </div>
    );
  };

  const PartnerDashboard = () => {
    const partnerData = user;
    const stats = partnerStats[partnerData.spaceId] || {};
    const partnerBookings = bookings.filter(b => b.spaceId === partnerData.spaceId);
    return (
      <div className="space-y-6 pb-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome, {partnerData.name}!</h2>
          <p className="text-gray-600">Here's an overview of your workspace performance.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <StatCard icon={<Calendar />} label="Total Bookings" value={stats.totalBookings} color="blue" />
          <StatCard icon={<TrendingUp />} label="Revenue (Mo)" value={`₦${(stats.monthlyRevenue / 1000).toFixed(0)}k`} color="green" />
          <StatCard icon={<Building />} label="Occupancy" value={`${stats.occupancyRate}%`} color="purple" />
          <StatCard icon={<Users />} label="Inquiries" value={stats.newInquiries} color="orange" />
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2"><Clock size={20}/> Manage Bookings</h3>
          {partnerBookings.length > 0 ? (
            <div className="space-y-3">
              {partnerBookings.map(b => (
                <div key={b.id} className="p-3 bg-slate-50 rounded-lg border">
                  <p className="font-bold text-gray-800 text-sm">{b.userEmail}</p>
                  <p className="text-xs text-gray-500 mt-1">{b.date} • {b.hours} hours • ₦{b.totalPrice.toLocaleString()}</p>
                  {b.status === 'Pending' ? (
                    <div className="flex gap-2 mt-3">
                        <button onClick={() => updateBookingStatus(b.id, 'Confirmed')} className="flex-1 bg-green-100 text-green-700 text-xs font-bold py-2 rounded-md hover:bg-green-200">Confirm</button>
                        <button onClick={() => updateBookingStatus(b.id, 'Declined')} className="flex-1 bg-red-100 text-red-700 text-xs font-bold py-2 rounded-md hover:bg-red-200">Decline</button>
                    </div>
                  ) : (
                    <p className={`text-sm font-bold mt-2 uppercase ${b.status === 'Confirmed' ? 'text-green-600' : 'text-red-600'}`}>{b.status}</p>
                  )}
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500 py-6 text-center text-sm">No new bookings yet.</p>}
        </div>
      </div>
    );
  };

  const AdminDashboard = () => {
    const totalRevenue = Object.values(partnerStats).reduce((sum, stat) => sum + stat.monthlyRevenue, 0);
    const totalBookings = Object.values(partnerStats).reduce((sum, stat) => sum + stat.totalBookings, 0);
    const totalUsers = new Set(bookings.map(b => b.userEmail)).size;

    return (
      <div className="space-y-6 pb-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Platform Dashboard</h2>
          <p className="text-gray-600">Real-time insights & performance metrics.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <StatCard icon={<Calendar />} label="Total Bookings" value={bookings.length} color="blue" />
          <StatCard icon={<TrendingUp />} label="Platform Revenue" value={`₦${(totalRevenue / 1000).toFixed(0)}k`} color="green" />
          <StatCard icon={<Building />} label="Active Spaces" value={spaces.length} color="purple" />
          <StatCard icon={<Users />} label="Active Users" value={totalUsers} color="orange" />
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2"><Shield size={20}/> Manage Spaces</h3>
          {spaces.map(space => (
            <div key={space.id} className="mb-3 p-4 bg-slate-50 rounded-xl border flex justify-between items-center">
                <div>
                    <p className="font-bold text-gray-800 text-md">{space.name}</p>
                    <p className="text-xs text-gray-500">{space.location}</p>
                </div>
                <button className="text-xs bg-blue-100 text-blue-700 font-bold py-2 px-3 rounded-md hover:bg-blue-200">View</button>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2"><Briefcase size={20}/> Manage Partners</h3>
            {Object.entries(partners).map(([email, partner]) => (
                 <div key={email} className="mb-3 p-4 bg-slate-50 rounded-xl border flex justify-between items-center">
                    <div>
                        <p className="font-bold text-gray-800 text-md">{partner.name}</p>
                        <p className="text-xs text-gray-500">{email}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    );
  };
  
  // --- Render Logic ---

  const renderContent = () => {
    if (userRole === 'partner') return <PartnerDashboard />;
    if (userRole === 'admin') return <AdminDashboard />;

    switch (activeTab) {
      case 'discover':
        return (
          <div className="space-y-4 pb-20">
            {filteredSpaces.length > 0 ? (
              filteredSpaces.map(space => <SpaceCard key={space.id} space={space} />)
            ) : (
              <div className="text-center py-16 text-gray-400">
                <Search size={48} className="mx-auto mb-4" />
                <p className="text-lg font-semibold">No spaces found</p>
                <p className="mt-1">Try a different search query.</p>
              </div>
            )}
          </div>
        );
      case 'saved':
        const savedSpaces = spaces.filter(space => favorites.has(space.id));
        return (
          <div className="space-y-4 pb-20">
            {!user ? (
              <div className="text-center py-16 text-gray-400"><User size={48} className="mx-auto mb-4" /><p className="text-lg font-semibold">Please log in</p><p>Sign in to see your saved spaces.</p></div>
            ) : savedSpaces.length > 0 ? (
              savedSpaces.map(space => <SpaceCard key={space.id} space={space} />)
            ) : (
              <div className="text-center py-16 text-gray-400">
                <Heart size={48} className="mx-auto mb-4" />
                <p className="text-lg font-semibold">No saved spaces yet</p>
                <p className="mt-1">Tap the heart icon to save a space.</p>
              </div>
            )}
          </div>
        );
      case 'dashboard':
        return user ? <UserDashboard /> : <div className="text-center py-16 text-gray-400"><p>Please log in to see your dashboard.</p></div>;
      case 'profile':
        return (
          <div className="pb-20">
            {user ? <UserDashboard /> : (
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900">{authMode === 'login' ? 'Welcome Back!' : 'Join Us'}</h2>
                  <p className="text-gray-600">Sign in to unlock all features.</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                  <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500" />
                  <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500" />
                  <button onClick={handleLogin} style={{ backgroundColor: BRAND_COLOR }} className="w-full text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition text-lg">
                    {authMode === 'login' ? 'Sign In' : 'Create Account'}
                  </button>
                </div>
                <button onClick={() => setAuthMode(m => m === 'login' ? 'signup' : 'login')} className="w-full font-semibold py-3 hover:underline" style={{ color: BRAND_COLOR }}>
                  {authMode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
                <div className="p-4 bg-slate-50 rounded-xl border text-xs text-gray-600">
                  <p className="font-bold flex items-center gap-2 mb-2"><AlertCircle size={16} /> Demo Credentials</p>
                  <p><b className="font-semibold">Admin:</b> admin@workspace.com / admin</p>
                  <p><b className="font-semibold">Partner:</b> francis@sebshub.com (no password)</p>
                  <p><b className="font-semibold">User:</b> any other email (no password)</p>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <div className="max-w-md mx-auto bg-white flex flex-col min-h-screen shadow-2xl shadow-slate-300/30">
        <header className="bg-white border-b border-slate-100 sticky top-0 z-10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-black text-2xl" style={{ backgroundColor: BRAND_COLOR }}>W</div>
              <div>
                <h1 className="text-lg font-extrabold text-gray-900 tracking-tight">WorkSpace</h1>
                <p className="text-xs text-gray-500 -mt-1">Africa</p>
              </div>
            </div>
            {user && (
              <button onClick={handleLogout} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full">
                <LogOut size={20} />
              </button>
            )}
          </div>
          {userRole === 'user' && activeTab === 'discover' && (
            <div className="relative mt-4">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search by name or location..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-100 border-2 border-transparent rounded-xl focus:outline-none focus:border-blue-400" />
            </div>
          )}
        </header>

        <main className="flex-1 p-4 overflow-y-auto">
          {renderContent()}
        </main>

        {userRole === 'user' && (
          <nav className="bg-white border-t border-slate-200 sticky bottom-0 z-10 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.05)]">
            <div className="flex justify-around">
              {[
                { id: 'discover', icon: Home, label: 'Discover' },
                { id: 'saved', icon: Heart, label: 'Saved' },
                { id: 'profile', icon: User, label: 'Dashboard' }
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex-1 py-3 flex flex-col items-center gap-1.5 transition-colors duration-300 relative ${
                    activeTab === id ? '' : 'text-gray-400 hover:text-gray-800'
                  }`}
                >
                  {activeTab === id && (
                    <div style={{ backgroundColor: BRAND_COLOR }} className="absolute top-0 h-1 w-10 rounded-b-full"></div>
                  )}
                  <Icon size={24} style={{ color: activeTab === id ? BRAND_COLOR : ''}} />
                  <span className="text-xs font-semibold" style={{ color: activeTab === id ? BRAND_COLOR : ''}}>{label}</span>
                </button>
              ))}
            </div>
          </nav>
        )}
      </div>

      {selectedSpace && <SpaceDetail space={selectedSpace} />}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .font-sans { font-family: 'Inter', sans-serif; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </div>
  );
}

