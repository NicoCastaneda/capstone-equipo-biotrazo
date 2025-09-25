import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { reportsService } from '../services/reports';
import { SustainabilityImpact } from '../types';
import { Leaf, Droplets, Zap, Package, DollarSign } from 'lucide-react';

const SustainabilityImpactSection: React.FC = () => {
  const { user } = useAuth();
  const [impact, setImpact] = useState<SustainabilityImpact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImpact = async () => {
      if (!user) return;
      try {
        const data = await reportsService.getSustainabilityImpact(user.id);
        setImpact(data);
      } catch (error) {
        console.error('Error fetching sustainability impact:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImpact();
  }, [user]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-24"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!impact) return null;

  const metrics = [
    {
      title: 'Carbon Saved',
      value: `${impact.totalCarbonSaved} kg`,
      icon: Leaf,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Water Saved',
      value: `${impact.totalWaterSaved} L`,
      icon: Droplets,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Emissions Reduced',
      value: `${impact.totalEmissionsReduced} kg CO²`,
      icon: Zap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Lots Created',
      value: impact.lotsCreated.toString(),
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Total Revenue',
      value: `$${impact.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Your Sustainability Impact</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.title}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center">
                <div className={`rounded-lg p-3 ${metric.bgColor}`}>
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          🌱 Making a Difference
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p className="mb-2">
              <strong>Environmental Impact:</strong> Your sustainable farming practices have 
              contributed to a cleaner environment by reducing carbon emissions and conserving water.
            </p>
          </div>
          <div>
            <p>
              <strong>Community Benefits:</strong> By connecting directly with buyers, you're 
              supporting local food systems and providing transparency in the supply chain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SustainabilityImpactSection;