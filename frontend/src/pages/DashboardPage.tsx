import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { lotsService } from '../services/lots';
import { Lot } from '../types';
import Layout from '../components/Layout';
import LotForm from '../components/LotForm';
import LotsTable from '../components/LotsTable';
import SustainabilityImpactSection from '../components/SustainabilityImpact';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLots = async () => {
      try {
        const data = await lotsService.getLots(
          user?.role === 'farmer' ? { farmerId: user.id } : {}
        );
        setLots(data);
      } catch (error) {
        console.error('Error fetching lots:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLots();
  }, [user]);

  const handleLotCreated = (newLot: Lot) => {
    setLots(prev => [newLot, ...prev]);
  };

  const handleOfferClick = (lot: Lot) => {
    // Mock offer functionality
    alert(`Making an offer for ${lot.type} from ${lot.farmerName}`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-green-100 text-lg">
            {user?.role === 'farmer' 
              ? 'Manage your sustainable produce and track your environmental impact.'
              : 'Discover sustainable produce and support eco-friendly farming practices.'
            }
          </p>
        </div>

        {/* Sustainability Impact Section */}
        <SustainabilityImpactSection />

        {/* Lots Management Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {user?.role === 'farmer' ? 'Your Lots' : 'Available Lots'}
            </h2>
            {user?.role === 'farmer' && (
              <LotForm onLotCreated={handleLotCreated} />
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <LotsTable
              lots={lots}
              showActions={user?.role === 'buyer'}
              onOfferClick={user?.role === 'buyer' ? handleOfferClick : undefined}
            />
          </div>
        </div>

        {/* Quick Stats */}
        {user?.role === 'farmer' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {lots.filter(lot => lot.status === 'available').length}
              </div>
              <div className="text-sm text-gray-600">Available Lots</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {lots.filter(lot => lot.status === 'sold').length}
              </div>
              <div className="text-sm text-gray-600">Sold Lots</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-2xl font-bold text-gray-900 mb-2">
                ${lots.reduce((sum, lot) => sum + (lot.price * lot.quantity), 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Value</div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;