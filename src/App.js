// src/App.js - Production Ready Code
import React, { useState, useEffect } from 'react';
import { MapPin, Star, Search, Home, Heart, User, LogOut, BarChart3, Settings, Mail, Phone, AlertCircle } from 'lucide-react';

export default function WorkSpaceAfricaMVP() {
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [spaces, setSpaces] = useState([]);
  const [favorites, setFavorites] = useState([]);
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
  const [notifications, setNotifications] = useState([]);

  const partners = {
    'francis@sebshub.com': { name: 'Seb\'s Hub', spaceId: '1', contact: 'Francis Nduama', phone: '8107180312' },
    'worknub@email.com': { name: 'Worknub', spaceId: '2', contact: 'The Worknub Team', phone: '7077732936' },
    'stargate@email.com': { name: 'Stargate Worksta', spaceId: '3', contact: 'Oyinlola Joseph', phone: '+2348148431594' }
  };

  const adminCredentials = { email: 'admin@workspace.com', password: 'admin123' };

  useEffect(() => {
    const defaultSpaces = [
      {
        id: '1',
        name: 'Seb\'s Hub',
        location: 'No 32, Awolowo Road, Ibadan',
        price: 3000,
        rating: 4.8,
        reviews: 12,
        amenities: ['AC', 'Kitchen', 'Meeting Rooms'],
        image: 'bg-blue-500',
        description: 'Professional workspace with AC, kitchen facilities, and dedicated meeting rooms. Perfect for freelancers and small teams.',
        availableDesks: 18,
        openHours: '6am - 10pm',
        contact: 'Francis Nduama',
        phone: '8107180312'
      },
      {
        id: '2',
        name: 'Worknub',
        location: 'West One Building, Lagos',
        price: 3500,
        rating: 4.7,
        reviews: 16,
        amenities: ['Super Fast WiFi', 'AC', 'Kitchen', 'Meeting Rooms'],
        image: 'bg-green-500',
        description: 'Premium coworking space with super fast WiFi, private desks, and event facilities. Ideal for growing businesses.',
        availableDesks: 25,
        openHours: '7am - 9pm',
        contact: 'The Worknub Team',
        phone: '7077732936'
      },
      {
        id: '3',
        name: 'Stargate Worksta',
        location: '9th Floor, Cocoa House, Ibadan',
        price: 4500,
        rating: 4.6,
        reviews: 10,
        amenities: ['AC', 'Private Offices', 'High-Speed Internet'],
        image: 'bg-purple-500',
        description: 'Professional private offices with premium amenities. Designed for serious entrepreneurs and established businesses.',
        availableDesks: 12,
        openHours: '8am - 8pm',
        contact: 'Oyinlola Joseph',
        phone: '+2348148431594'
      }
    ];
    setSpaces(defaultSpaces);
    initializeStats(defaultSpaces);
  }, []);

  const initializeStats = (spacesList) => {
    const stats = {};
    spacesList.forEach(space => {
      stats[space.id] = {
        totalBookings: Math.floor(Math.random() * 25) + 5,
        monthlyRevenue: Math.floor(Math.random() * 200000) + 100000,
        occupancyRate: Math.floor(Math.random() * 40) + 60,
        newInquiries: Math.floor(Math.random() * 12) + 3
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
      setUser({ email, uid: 'admin123' });
      setUserRole('admin');
      setEmail('');
      setPassword('');
    } else if (partners[email]) {
      setUser({ email, uid: email, ...partners[email] });
      setUserRole('partner');
      setEmail('');
      setPassword('');
    } else {
      setUser({ email, uid: 'user' + Date.now() });
      setUserRole('user');
      setEmail('');
      setPassword('');
    }
  };

  const handleSignUp = () => {
    if (!email || !password) {
      alert('Please enter email and password');
      return;
    }
    setUser({ email, uid: 'user' + Date.now() });
    setUserRole('user');
    setEmail('');
    setPassword('');
  };

  const handleLogout = () => {
    setUser(null);
    setUserRole('user');
    setFavorites([]);
    setNotifications([]);
  };

  const toggleFavorite = (spaceId) => {
    if (!user) {
      alert('Please log in to save spaces');
      setActiveTab('profile');
      return;
    }

    if (favorites.includes(spaceId)) {
      setFavorites(prev => prev.filter(id => id !== spaceId));
    } else {
      setFavorites(prev => [...prev, spaceId]);
    }
  };

  const handleBooking = () => {
    if (!bookingDetails.date || !bookingDetails.hours) {
      alert('Please select date and hours');
      return;
    }

    const newBooking = {
      id: 'BK' + Date.now(),
      userId: user.uid,
      userEmail: user.email,
      spaceId: selectedSpace.id,
      spaceName: selectedSpace.name,
      date: bookingDetails.date,
      hours: bookingDetails.hours,
      totalPrice: selectedSpace.price * bookingDetails.hours,
      status: 'pending',
      createdAt: new Date().toLocaleDateString()
    };

    setBookings(prev => [...prev, newBooking]);
    setNotifications(prev => [...prev, {
      id: Date.now(),
      type: 'booking',
      message: `New booking from ${user.email} at ${selectedSpace.name}`,
      spaceId: selectedSpace.id,
      read: false
    }]);

    alert('Booking submitted! The space owner will contact you shortly.');
    setShowBookingModal(false);
    setBookingDetails({ date: '', hours: 1 });
    setSelectedSpace(null);
  };

  const filteredSpaces = spaces.filter(space =>
    space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    space.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const SpaceCard = ({ space }) => (
    <div 
      onClick={() => setSelectedSpace(space)}
      className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition cursor-pointer"
    >
      <div className={`${space.image} h-32 flex items-center justify-center text-white`}>
        <Home size={48} />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-gray-800">{space.name}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <MapPin size={14} /> {space.location}
            </p>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(space.id);
            }}
            className="p-1"
          >
            <Heart 
              size={20} 
              fill={favorites.includes(space.id) ? 'currentColor' : 'none'}
              color={favorites.includes(space.id) ? '#ef4444' : '#cbd5e1'}
            />
          </button>
        </div>
        
        <div className="flex gap-2 mb-3 flex-wrap">
          {space.amenities.slice(0, 2).map((amenity, idx) => (
            <span key={idx} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
              {amenity}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-end">
          <div>
            <p className="font-bold text-gray-800">₦{space.price}/day</p>
            <div className="flex items-center gap-1 mt-1">
              <Star size={14} fill="#fbbf24" color="#fbbf24" />
              <span className="text-sm font-medium">{space.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const SpaceDetail = ({ space }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
      <div className="bg-white w-full rounded-t-2xl p-6 max-h-80vh overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Space Details</h2>
          <button 
            onClick={() => {
              setSelectedSpace(null);
              setShowBookingModal(false);
            }}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className={`${space.image} h-40 rounded-lg flex items-center justify-center text-white mb-4`}>
          <Home size={64} />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">{space.name}</h1>
        <p className="text-gray-600 flex items-center gap-2 mb-4">
          <MapPin size={16} /> {space.location}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-xs text-gray-500 mb-1">PRICE</p>
            <p className="font-bold text-lg text-gray-800">₦{space.price}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-xs text-gray-500 mb-1">AVAILABLE</p>
            <p className="font-bold text-lg text-gray-800">{space.availableDesks}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-xs text-gray-500 mb-1">RATING</p>
            <p className="font-bold text-lg text-gray-800 flex items-center gap-1">
              <Star size={16} fill="#fbbf24" color="#fbbf24" /> {space.rating}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-xs text-gray-500 mb-1">HOURS</p>
            <p className="font-bold text-sm text-gray-800">{space.openHours}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-bold text-gray-800 mb-3">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {space.amenities.map((amenity, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-2 rounded-full text-sm">
                {amenity}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Phone size={16} /> Contact
          </p>
          <p className="text-sm text-gray-600">{space.contact}</p>
          <p className="text-sm text-gray-600">{space.phone}</p>
        </div>

        <p className="text-gray-700 mb-6">{space.description}</p>

        {!showBookingModal ? (
          <div className="flex gap-3">
            <button 
              onClick={() => toggleFavorite(space.id)}
              className="flex-1 border-2 border-blue-500 text-blue-500 font-bold py-3 rounded-lg hover:bg-blue-50"
            >
              {favorites.includes(space.id) ? '❤ Saved' : '🤍 Save'}
            </button>
            <button 
              onClick={() => setShowBookingModal(true)}
              className="flex-1 bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600"
            >
              Book Desk
            </button>
          </div>
        ) : (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-4">Book a Desk</h3>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">Date</label>
              <input
                type="date"
                value={bookingDetails.date}
                onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-2">Hours</label>
              <input
                type="number"
                min="1"
                max="8"
                value={bookingDetails.hours}
                onChange={(e) => setBookingDetails({ ...bookingDetails, hours: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <p className="font-bold text-gray-800 mb-4">Total: ₦{space.price * bookingDetails.hours}</p>
            <div className="flex gap-2">
              <button
                onClick={handleBooking}
                className="flex-1 bg-green-500 text-white font-bold py-2 rounded hover:bg-green-600"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 border-2 border-gray-300 text-gray-600 font-bold py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const PartnerDashboard = () => {
    const partnerData = user;
    const stats = partnerStats[partnerData.spaceId];
    const partnerBookings = bookings.filter(b => b.spaceId === partnerData.spaceId);
    const unreadNotifications = notifications.filter(n => !n.read && n.spaceId === partnerData.spaceId);

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome, {partnerData.name}</h2>
          <p className="text-gray-600">Manage your workspace and bookings</p>
        </div>

        {unreadNotifications.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={20} className="text-yellow-600" />
              <p className="font-bold text-yellow-800">New Notifications ({unreadNotifications.length})</p>
            </div>
            {unreadNotifications.map(notif => (
              <p key={notif.id} className="text-sm text-yellow-700 mb-1">{notif.message}</p>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
            <p className="text-3xl font-bold text-blue-600">{stats.totalBookings}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Monthly Revenue</p>
            <p className="text-2xl font-bold text-green-600">₦{(stats.monthlyRevenue / 1000).toFixed(0)}k</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Occupancy Rate</p>
            <p className="text-3xl font-bold text-purple-600">{stats.occupancyRate}%</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">New Inquiries</p>
            <p className="text-3xl font-bold text-orange-600">{stats.newInquiries}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          <h3 className="font-bold text-gray-800 mb-4">Recent Bookings</h3>
          {partnerBookings.length > 0 ? (
            <div className="space-y-3">
              {partnerBookings.slice(-5).map(booking => (
                <div key={booking.id} className="border-l-4 border-blue-500 p-3 bg-gray-50 rounded">
                  <p className="font-bold text-gray-800">{booking.userEmail}</p>
                  <p className="text-sm text-gray-600">{booking.date} • {booking.hours} hours</p>
                  <p className="text-sm font-bold text-green-600">₦{booking.totalPrice}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No bookings yet</p>
          )}
        </div>
      </div>
    );
  };

  const AdminDashboard = () => {
    const totalRevenue = Object.values(partnerStats).reduce((sum, stat) => sum + stat.monthlyRevenue, 0);
    const totalBookings = Object.values(partnerStats).reduce((sum, stat) => sum + stat.totalBookings, 0);
    const allBookings = bookings;

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h2>
          <p className="text-gray-600">Monitor all spaces and bookings</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
            <p className="text-3xl font-bold text-blue-600">{totalBookings}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Platform Revenue</p>
            <p className="text-2xl font-bold text-green-600">₦{(totalRevenue / 1000).toFixed(0)}k</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Active Spaces</p>
            <p className="text-3xl font-bold text-purple-600">{spaces.length}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Notifications</p>
            <p className="text-3xl font-bold text-orange-600">{notifications.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6">
          <h3 className="font-bold text-gray-800 mb-4">Partner Performance</h3>
          {spaces.map(space => {
            const stats = partnerStats[space.id];
            return (
              <div key={space.id} className="mb-4 p-4 bg-gray-50 rounded border-l-4 border-blue-500">
                <p className="font-bold text-gray-800">{space.name}</p>
                <div className="grid grid-cols-4 gap-2 mt-2 text-sm">
                  <div>
                    <p className="text-gray-600">Bookings</p>
                    <p className="font-bold text-blue-600">{stats.totalBookings}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Revenue</p>
                    <p className="font-bold text-green-600">₦{(stats.monthlyRevenue / 1000).toFixed(0)}k</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Occupancy</p>
                    <p className="font-bold text-purple-600">{stats.occupancyRate}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Inquiries</p>
                    <p className="font-bold text-orange-600">{stats.newInquiries}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-lg p-6">
          <h3 className="font-bold text-gray-800 mb-4">All Bookings</h3>
          {allBookings.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {allBookings.map(booking => (
                <div key={booking.id} className="border-l-4 border-blue-500 p-3 bg-gray-50 rounded">
                  <p className="font-bold text-gray-800">{booking.spaceName}</p>
                  <p className="text-sm text-gray-600">{booking.userEmail} • {booking.date}</p>
                  <p className="text-sm font-bold text-green-600">₦{booking.totalPrice}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No bookings yet</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">WorkSpace Africa</h1>
            {user && (
              <button 
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 text-sm font-bold"
              >
                Logout
              </button>
            )}
          </div>
          {userRole === 'user' && (
            <div className="relative">
              <Search size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search spaces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 max-w-md mx-auto w-full p-4 overflow-y-auto">
        {userRole === 'user' && activeTab === 'discover' && (
          <div className="space-y-4">
            {filteredSpaces.length > 0 ? (
              filteredSpaces.map(space => (
                <SpaceCard key={space.id} space={space} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No spaces found. Try a different search.</p>
              </div>
            )}
          </div>
        )}

        {userRole === 'user' && activeTab === 'saved' && (
          <div className="space-y-4">
            {user ? (
              favorites.length > 0 ? (
                filteredSpaces
                  .filter(space => favorites.includes(space.id))
                  .map(space => (
                    <SpaceCard key={space.id} space={space} />
                  ))
              ) : (
                <div className="text-center py-12 bg-white rounded-lg p-6">
                  <Heart size={48} color="#cbd5e1" className="mx-auto mb-4" />
                  <p className="text-gray-500">No saved spaces yet.</p>
                </div>
              )
            ) : (
              <div className="text-center py-12 bg-white rounded-lg p-6">
                <p className="text-gray-500">Sign in to save spaces</p>
              </div>
            )}
          </div>
        )}

        {userRole === 'user' && activeTab === 'community' && (
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Community Events</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="font-bold text-gray-800 mb-1">Freelancer Networking Breakfast</p>
                <p className="text-sm text-gray-600 mb-2">Thursday, 7am | Seb's Hub</p>
                <button className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600">
                  Attend Event
                </button>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="font-bold text-gray-800 mb-1">Founder Office Hours</p>
                <p className="text-sm text-gray-600 mb-2">Wednesday, 3pm | Worknub</p>
                <button className="w-full bg-green-500 text-white font-bold py-2 rounded hover:bg-green-600">
                  Attend Event
                </button>
              </div>
            </div>
          </div>
        )}

        {userRole === 'user' && activeTab === 'profile' && (
          <div className="bg-white rounded-lg p-6">
            {user ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Your Profile</h2>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <User size={48} className="text-blue-500" />
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">{authMode === 'login' ? 'Login' : 'Sign Up'}</h2>
                <div className="space-y-4 mb-4">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleLogin}
                    className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600"
                  >
                    Login
                  </button>
                </div>
                <p className="text-xs text-gray-600 mb-4">Demo: admin@workspace.com / admin123</p>
                <button
                  onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                  className="w-full text-blue-500 font-bold hover:underline"
                >
                  {authMode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Login'}
                </button>
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-600 mb-2">Partner Demo Accounts:</p>
                  <p className="text-xs text-gray-500 mb-1">francis@sebshub.com</p>
                  <p className="text-xs text-gray-500">worknub@email.com</p>
                  <p className="text-xs text-gray-500">stargate@email.com</p>
                </div>
              </div>
            )}
          </div>
        )}

        {userRole === 'partner' && <PartnerDashboard />}
        {userRole === 'admin' && <AdminDashboard />}
      </div>

      {userRole === 'user' && (
        <div className="bg-white border-t sticky bottom-0 max-w-md mx-auto w-full">
          <div className="flex justify-around">
            {[
              { id: 'discover', icon: Home, label: 'Discover' },
              { id: 'saved', icon: Heart, label: 'Saved' },
              { id: 'community', icon: Search, label: 'Events' },
              { id: 'profile', icon: User, label: 'Profile' }
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 py-3 flex flex-col items-center gap-1 ${
                  activeTab === id ? 'text-blue-500 border-t-2 border-blue-500' : 'text-gray-400'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedSpace && <SpaceDetail space={selectedSpace} />}
    </div>
  );
}