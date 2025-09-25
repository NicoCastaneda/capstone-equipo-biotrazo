import { Lot } from '../types';

const generateQRCode = (lotId: string): string => {
  // Mock QR code generation - replace with actual QR code library
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://agrotrace.com/lot/${lotId}`)}`;
};

export const lotsService = {
  async createLot(lotData: Omit<Lot, 'id' | 'qrCode' | 'createdAt' | 'status'>): Promise<Lot> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const id = Math.random().toString(36).substr(2, 9);
        const lot: Lot = {
          ...lotData,
          id,
          qrCode: generateQRCode(id),
          status: 'available',
          createdAt: new Date().toISOString(),
        };
        resolve(lot);
      }, 1000);
    });
  },

  async getLots(filters?: { farmerId?: string; status?: string }): Promise<Lot[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockLots: Lot[] = [
          {
            id: '1',
            farmerId: 'farmer1',
            farmerName: 'Green Valley Farm',
            type: 'Organic Tomatoes',
            quantity: 500,
            unit: 'kg',
            harvestDate: '2025-01-10',
            location: 'California, USA',
            certifications: ['Organic', 'Fair Trade'],
            price: 12.50,
            currency: 'USD',
            qrCode: generateQRCode('1'),
            sustainabilityMetrics: {
              carbonSaved: 45.5,
              waterSaved: 120,
              emissionsReduced: 23.2,
            },
            status: 'available',
            createdAt: '2025-01-01T00:00:00.000Z',
          },
          {
            id: '2',
            farmerId: 'farmer2',
            farmerName: 'Sustainable Harvest Co.',
            type: 'Free-range Eggs',
            quantity: 1200,
            unit: 'dozen',
            harvestDate: '2025-01-12',
            location: 'Vermont, USA',
            certifications: ['Free Range', 'Organic'],
            price: 8.75,
            currency: 'USD',
            qrCode: generateQRCode('2'),
            sustainabilityMetrics: {
              carbonSaved: 32.1,
              waterSaved: 85,
              emissionsReduced: 18.7,
            },
            status: 'available',
            createdAt: '2025-01-02T00:00:00.000Z',
          },
        ];
        resolve(mockLots);
      }, 800);
    });
  },

  async getLotById(id: string): Promise<Lot | null> {
    const lots = await this.getLots();
    return lots.find(lot => lot.id === id) || null;
  },
};