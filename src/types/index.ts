export type City = 'Douala' | 'Yaoundé' | 'Kribi' | 'Limbé' | 'All';

export type PaymentProvider = 'MTN_MOMO' | 'ORANGE_MONEY' | 'CASH';

export type LeadStatus = 'hot' | 'warm' | 'cold';

export interface Property {
  id: string;
  name: string;
  city: 'Douala' | 'Yaoundé' | 'Kribi' | 'Limbé';
  neighborhood: string;
  type: 'Villa' | 'Appartement' | 'Studio VIP' | 'Penthouse';
  pricePerNight: number; // in FCFA
  bedrooms: number;
  bathrooms: number;
  capacity: number;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  occupancyRate: number; // percentage
  status: 'available' | 'occupied' | 'maintenance';
  amenities: {
    generator: boolean; // Groupe électrogène
    generatorKva?: number;
    waterReserve: boolean; // Forage / Cuve d'eau
    waterCapacityLiters?: number;
    starlinkWifi: boolean; // Starlink ou Fibre Optique
    airConditioning: boolean; // Climatisation
    security24h: boolean; // Gardiennage 24/7
    airportShuttle: boolean; // Navette aéroport
    smartTv: boolean;
    equippedKitchen: boolean;
    pool?: boolean;
    seaView?: boolean;
  };
  fuelLevelPercentage: number; // Generator fuel
  waterLevelPercentage: number; // Water reserve
  description: string;
}

export interface Transaction {
  id: string;
  propertyId: string;
  propertyName: string;
  guestName: string;
  guestPhone: string;
  provider: PaymentProvider;
  amount: number; // Gross FCFA
  ttaTax: number; // 0.2% TTA
  operatorFee: number; // 1% for MOMO/OM, 0 for CASH
  netAmount: number; // Net for host
  status: 'completed' | 'pending' | 'failed';
  date: string;
  nights: number;
  reference: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  isDiaspora: boolean;
  diasporaCountry?: string; // e.g. France, USA, Canada
  targetCity: 'Douala' | 'Yaoundé' | 'Kribi' | 'Limbé';
  budget: number; // FCFA
  nights: number;
  dates: string;
  intentScore: number; // 0-100
  status: LeadStatus;
  keyRequirements: string[];
  recommendedPropertyId?: string;
  lastMessage: string;
  lastMessageTime: string;
}

export interface LogisticsTask {
  id: string;
  propertyId: string;
  propertyName: string;
  type: 'FUEL_REFILL' | 'CLEANING' | 'WATER_CHECK' | 'STARLINK_CHECK' | 'MAINTENANCE';
  title: string;
  description: string;
  assignedTo: string;
  status: 'pending' | 'in_progress' | 'completed';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  dueDate: string;
  estimatedCostFCFA?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  propertySuggestion?: Property;
  qualificationData?: LeadQualification;
  isPaymentPrompt?: boolean;
  amountToPay?: number;
}

export interface LeadQualification {
  intentScore: number;
  status: LeadStatus;
  budgetEstimatedFCFA: number;
  targetCity: string;
  durationNights: number;
  isDiaspora: boolean;
  summary: string;
  detectedNeeds: string[];
  suggestedPropertyId?: string;
}
