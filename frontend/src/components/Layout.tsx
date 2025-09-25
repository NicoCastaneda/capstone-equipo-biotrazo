import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Leaf } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <>{children}</>;
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <Leaf className="h-8 w-8 text-green-600" />
                <span className="text-xl font-bold text-gray-900">AgroTrace</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      location.pathname === item.href
                        ? 'text-green-600 border-b-2 border-green-600'
                        : 'text-gray-500 hover:text-gray-700'
                    } px-3 py-2 text-sm font-medium transition-colors duration-200`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {user.avatar ? (
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={user.avatar}
                      alt={user.name}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-700">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;