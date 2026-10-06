import { ModularSubscriptionConfig, SubscriptionPlan } from '../types/pipeline';
import {
  STRIPE_OFFICIAL_TIERS,
  FREE_STARTER_PLAN,
  BASIC_TRIAL_PLAN,
  PRESET_MODULAR_PLANS,
  formatEur,
  getUnifiedPlanPrice,
} from '../config/stripeUnifiedConfig';

export {
  STRIPE_OFFICIAL_TIERS,
  FREE_STARTER_PLAN,
  BASIC_TRIAL_PLAN,
  PRESET_MODULAR_PLANS,
  formatEur,
  getUnifiedPlanPrice,
};

export function calculateModularPrice(config: ModularSubscriptionConfig): { monthly: number; annual: number; annualPerMonth: number } {
  const level = config.tierLevel || 2;
  const tier = STRIPE_OFFICIAL_TIERS[level] || STRIPE_OFFICIAL_TIERS[2];
  return {
    monthly: tier.monthlyPriceEur,
    annual: tier.annualPriceEur,
    annualPerMonth: tier.annualMonthlyEquivalentEur,
  };
}

export function calculateGoogleSystemCostsAndFairProfit(clipsCount: number, planPriceEur: number) {
  const computeCosts = (clipsCount * 0.005);
  const aiCosts = (clipsCount * 0.003);
  const storageCosts = 0.00; // 0 MB RAM Ephemeral
  const totalGoogleCosts = computeCosts + aiCosts + storageCosts;
  const profitEur = Math.max(0, planPriceEur - totalGoogleCosts);
  const marginPercent = planPriceEur > 0 ? (profitEur / planPriceEur) * 100 : 0;

  return {
    computeCosts,
    aiCosts,
    storageCosts,
    totalGoogleCosts,
    profitEur,
    marginPercent: Math.round(marginPercent),
  };
}
