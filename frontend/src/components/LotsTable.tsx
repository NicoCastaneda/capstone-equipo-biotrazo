import React from 'react';
import { Lot } from '../types';
import { MapPin, Calendar, Award, QrCode } from 'lucide-react';

interface LotsTableProps {
  lots: Lot[];
  showActions?: boolean;
  onOfferClick?: (lot: Lot) => void;
}

const LotsTable: React.FC<LotsTableProps> = ({ lots, showActions = false, onOfferClick }) => {
  if (lots.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">Sin lotes disponibles</div>
        <div className="text-gray-500 text-sm">
          {showActions ? 'Vuelve más tarde para ver nuevos anuncios' : 'Crea tu primer lote para comenzar'}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {lots.map((lot) => (
        <div key={lot.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{lot.type}</h3>
                <p className="text-sm text-gray-600">{lot.farmerName}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                lot.status === 'available' ? 'bg-green-100 text-green-800' :
                lot.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {lot.status}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                {lot.location}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                Cosechado: {new Date(lot.harvestDate).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <QrCode className="h-4 w-4 mr-2" />
                Cantidad: {lot.quantity} {lot.unit}
              </div>
            </div>

            {lot.certifications.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Award className="h-4 w-4 mr-2" />
                  Certificaciones
                </div>
                <div className="flex flex-wrap gap-1">
                  {lot.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">Precio por {lot.unit}</span>
                <span className="text-lg font-bold text-gray-900">
                  ${lot.price} {lot.currency}
                </span>
              </div>

              {!showActions && (
                <div className="flex items-center justify-center">
                  <img
                    src={lot.qrCode}
                    alt="QR Code"
                    className="h-20 w-20"
                  />
                </div>
              )}

              {showActions && onOfferClick && (
                <button
                  onClick={() => onOfferClick(lot)}
                  disabled={lot.status !== 'available'}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md transition-colors duration-200"
                >
                  {lot.status === 'available' ? 'Hacer Oferta' : 'No Disponible'}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LotsTable;