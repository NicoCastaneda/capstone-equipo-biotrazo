import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { lotsService } from '../services/lots';
import { Lot } from '../types';
import { Plus, X } from 'lucide-react';

interface LotFormProps {
  onLotCreated: (lot: Lot) => void;
}

const LotForm: React.FC<LotFormProps> = ({ onLotCreated }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    quantity: '',
    unit: 'kg',
    harvestDate: '',
    location: '',
    price: '',
    certifications: [] as string[],
  });

  const certificationOptions = [
    'Orgánico',
    'Comercio Justo',
    'Pastoreo Libre',
    'Sin OGM',
    'Sostenible',
    'Cultivado Localmente',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const lot = await lotsService.createLot({
        farmerId: user.id,
        farmerName: user.name,
        type: formData.type,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        harvestDate: formData.harvestDate,
        location: formData.location,
        certifications: formData.certifications,
        price: Number(formData.price),
        currency: 'COP',
        sustainabilityMetrics: {
          carbonSaved: Math.random() * 50 + 20,
          waterSaved: Math.random() * 100 + 50,
          emissionsReduced: Math.random() * 30 + 15,
        },
      });

      onLotCreated(lot);
      setIsOpen(false);
      setFormData({
        type: '',
        quantity: '',
        unit: 'kg',
        harvestDate: '',
        location: '',
        price: '',
        certifications: [],
      });
    } catch (error) {
      console.error('Error creating lot:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCertification = (cert: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert],
    }));
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
      >
        <Plus className="h-4 w-4 mr-2" />
        Crear nuevo lote
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-medium text-gray-900">Crear nuevo lote</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de producto *
                </label>
                <input
                  type="text"
                  required
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  placeholder="ej. Residuos de caña"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unidad
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                    <option value="dozen">docena</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de cosecha *
                </label>
                <input
                  type="date"
                  required
                  value={formData.harvestDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, harvestDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="ej. Vereda El Paraíso, Valle del Cauca"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio por {formData.unit} (COP) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certificaciones
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {certificationOptions.map((cert) => (
                    <button
                      key={cert}
                      type="button"
                      onClick={() => toggleCertification(cert)}
                      className={`px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                        formData.certifications.includes(cert)
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : 'bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {cert}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {loading ? 'Creando...' : 'Crear Lote'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LotForm;