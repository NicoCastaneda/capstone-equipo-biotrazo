import { Lot } from '../types';

const API_URL = 'http://127.0.0.1:5000/api';

interface CreateLotData {
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
  sustainabilityMetrics?: {
    carbonSaved: number;
    waterSaved: number;
    emissionsReduced: number;
  };
}

class LotsService {
  private getAuthToken(): string {
    const token = localStorage.getItem('agrotraceToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return token;
  }

  async createLot(data: CreateLotData): Promise<Lot> {
    try {
      console.log('📤 Enviando datos al backend:', data);
  
      // Solo enviar campos que el backend soporta
      const backendData = {
        crop_type: data.type,
        quantity: data.quantity,
        unit: data.unit,
        location: data.location,
        harvest_date: data.harvestDate,
      };
  
      console.log('🔄 Datos transformados para backend:', backendData);

      const response = await fetch(`${API_URL}/lots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(backendData),
      });

      const result = await response.json();
      console.log('📥 Respuesta del backend:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Error al crear lote');
      }

      // Transformar respuesta del backend al formato del frontend
      const backendLot = result.lot;
      const frontendLot: Lot = {
        id: backendLot.id,
        farmerId: backendLot.farmer_uid,
        farmerName: data.farmerName,
        type: backendLot.crop_type,
        quantity: backendLot.quantity,
        unit: backendLot.unit,
        harvestDate: backendLot.harvest_date || data.harvestDate,
        location: backendLot.location,
        certifications: data.certifications,
        price: data.price,
        currency: data.currency,
        status: backendLot.status,
        qrCode: backendLot.qr_code,
        createdAt: backendLot.created_at,
        sustainabilityMetrics: data.sustainabilityMetrics || {
          carbonSaved: 0,
          waterSaved: 0,
          emissionsReduced: 0,
        },
      };

      console.log('✅ Lote creado exitosamente:', frontendLot);
      return frontendLot;

    } catch (error: any) {
      console.error('❌ Error al crear lote:', error);
      throw new Error(error.message || 'Error al crear lote');
    }
  }

  async getLots(): Promise<Lot[]> {
    try {
      const response = await fetch(`${API_URL}/lots`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al obtener lotes');
      }

      // Transformar lotes del backend al formato del frontend
      return result.lots.map((backendLot: any) => ({
        id: backendLot.id,
        farmerId: backendLot.farmer_uid,
        farmerName: 'Agricultor', // Puedes obtener esto de otro lugar
        type: backendLot.crop_type,
        quantity: backendLot.quantity,
        unit: backendLot.unit,
        harvestDate: backendLot.harvest_date,
        location: backendLot.location,
        certifications: [],
        price: backendLot.price,
        currency: 'COP',
        status: backendLot.status,
        qrCode: backendLot.qr_code,
        traceabilityCode: backendLot.traceability_code,
        createdAt: backendLot.created_at,
        sustainabilityMetrics: {
          carbonSaved: 0,
          waterSaved: 0,
          emissionsReduced: 0,
        },
      }));

    } catch (error: any) {
      console.error('❌ Error al obtener lotes:', error);
      throw new Error(error.message || 'Error al obtener lotes');
    }
  }

  async deleteLot(lotId: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/lots/${lotId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al eliminar lote');
      }

    } catch (error: any) {
      console.error('❌ Error al eliminar lote:', error);
      throw new Error(error.message || 'Error al eliminar lote');
    }
  }
}

export const lotsService = new LotsService();
