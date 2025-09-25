import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Mail, Lock, User } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'farmer' as 'farmer' | 'buyer',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData.email, formData.password, formData.role);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Leaf className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Bienvenido a BioTrazo</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your sustainable agriculture platform
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am a
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'farmer' }))}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors duration-200 ${
                    formData.role === 'farmer'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 hover:border-gray-400 text-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Leaf className="h-5 w-5" />
                    <span className="font-medium">Farmer</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'buyer' }))}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors duration-200 ${
                    formData.role === 'buyer'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400 text-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <User className="h-5 w-5" />
                    <span className="font-medium">Buyer</span>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500">
          <p>Demo credentials: Use any email/password combination</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;