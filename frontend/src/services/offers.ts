import { Offer } from '../types';

export const offersService = {
  async createOffer(offerData: Omit<Offer, 'id' | 'createdAt' | 'status'>): Promise<Offer> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const offer: Offer = {
          ...offerData,
          id: Math.random().toString(36).substr(2, 9),
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        resolve(offer);
      }, 1000);
    });
  },

  async getOffers(filters?: { buyerId?: string; lotId?: string }): Promise<Offer[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockOffers: Offer[] = [
          {
            id: '1',
            lotId: '1',
            buyerId: 'buyer1',
            buyerName: 'Fresh Market Chain',
            price: 12.00,
            quantity: 250,
            message: 'Interested in a long-term partnership',
            status: 'pending',
            createdAt: '2025-01-03T00:00:00.000Z',
          },
        ];
        resolve(mockOffers);
      }, 800);
    });
  },

  async updateOfferStatus(offerId: string, status: 'accepted' | 'rejected'): Promise<Offer> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: offerId,
          lotId: '1',
          buyerId: 'buyer1',
          buyerName: 'Fresh Market Chain',
          price: 12.00,
          quantity: 250,
          status,
          createdAt: '2025-01-03T00:00:00.000Z',
        });
      }, 1000);
    });
  },
};