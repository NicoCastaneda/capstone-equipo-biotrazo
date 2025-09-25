import { SustainabilityImpact } from '../types';

export const reportsService = {
  async getSustainabilityImpact(userId: string): Promise<SustainabilityImpact> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalCarbonSaved: 234.8,
          totalEmissionsReduced: 156.3,
          totalWaterSaved: 1240,
          lotsCreated: 12,
          revenue: 15680.50,
        });
      }, 800);
    });
  },
};