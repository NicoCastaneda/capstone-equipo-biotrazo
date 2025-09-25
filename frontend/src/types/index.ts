export interface User {
  id: string;
  email: string;
  name: string;
  role: 'farmer' | 'buyer';
  avatar?: string;
}

export interface Lot {
  id: string;
  farmerId: string;
  farmerName: string;
  type: string;
  quantity: number;
  unit: string;
  harvestDate: string;
  location: string;
  certifications: string[];
  price: number;
  currency: string;
  qrCode: string;
  sustainabilityMetrics: {
    carbonSaved: number;
    waterSaved: number;
    emissionsReduced: number;
  };
  status: 'available' | 'reserved' | 'sold';
  createdAt: string;
}

export interface Offer {
  id: string;
  lotId: string;
  buyerId: string;
  buyerName: string;
  price: number;
  quantity: number;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface SustainabilityImpact {
  totalCarbonSaved: number;
  totalEmissionsReduced: number;
  totalWaterSaved: number;
  lotsCreated: number;
  revenue: number;
}