export interface PricingStrategy {
  calculate(basePrice: number): number;
}

export class RegularPricingStrategy implements PricingStrategy {
  calculate(basePrice: number): number {
    return basePrice;
  }
}

export class EmergencyPricingStrategy implements PricingStrategy {
  calculate(basePrice: number): number {
    return basePrice * 1.5;
  }
}
