export type City = 'Douala' | 'Yaoundé' | 'Kribi' | 'Limbé' | 'All';

export type PaymentProvider = 'MTN_MOMO' | 'ORANGE_MONEY' | 'CASH';

export type LeadStatus = 'hot' | 'warm' | 'cold';

export type PropertyKind = 'independent' | 'hotel_residence';

export interface RoomCategory {
  id: string;
  name: string; // e.g. "Chambre Standard", "Suite VIP Wouri", "Appartement 2 Pièces"
  type: 'Standard' | 'Deluxe' | 'Suite VIP' | 'Suite Présidentielle' | 'Chambre Familiale' | 'Studio Meublé';
  totalInventory: number;
  availableInventory: number;
  pricePerNight: number; // in FCFA
  capacity: number;
  bedType: string;
  amenities: string[];
  images: string[];
  description: string;
}

export interface Property {
  id: string;
  name: string;
  city: 'Douala' | 'Yaoundé' | 'Kribi' | 'Limbé';
  neighborhood: string;
  propertyKind: PropertyKind;
  type: 'Villa' | 'Appartement' | 'Studio VIP' | 'Penthouse' | 'Hôtel' | 'Résidence Hôtelière';
  pricePerNight: number; // In FCFA (Base price for independent, Starting price for hotel)
  bedrooms: number;
  bathrooms: number;
  capacity: number;
  imageUrl: string;
  galleryImages?: string[];
  rating: number;
  reviewsCount: number;
  occupancyRate: number; // percentage
  status: 'available' | 'occupied' | 'maintenance'; // For independent
  // Hotel / Multi-room residence specific fields
  roomCategories?: RoomCategory[];
  totalRooms?: number;
  availableRooms?: number;
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
    restaurantBar?: boolean;
    conferenceRoom?: boolean;
  };
  fuelLevelPercentage: number; // Generator fuel
  waterLevelPercentage: number; // Water reserve
  description: string;
}

export interface Transaction {
  id: string;
  propertyId: string;
  propertyName: string;
  roomCategoryName?: string;
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

export interface InboundLead {
  id: string;
  name: string;
  phone: string;
  isDiaspora: boolean;
  diasporaCountry?: string; // e.g. France, USA, Canada, Belgique
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
  preferredType?: 'independent' | 'hotel';
}

export type Lead = InboundLead; // Backward compatibility

export interface OutboundContact {
  id: string;
  name: string;
  phone: string;
  segment: 'Diaspora France/Europe' | 'Diaspora USA/Canada' | 'Affaires & Entreprises' | 'Tourisme & Vacances' | 'Clients Fidèles';
  city: 'Douala' | 'Yaoundé' | 'Kribi' | 'Limbé';
  lastStayDate?: string;
  estimatedBudgetFCFA: number;
  status: 'to_contact' | 'contacted' | 'booked' | 'unresponsive';
  tags: string[];
  notes?: string;
}

export interface WhatsAppCampaign {
  id: string;
  title: string;
  templateKey: string;
  targetSegment: string;
  messagePreview: string;
  recipientsCount: number;
  sentAt: string;
  status: 'draft' | 'sending' | 'completed';
  openedCount: number;
  repliedCount: number;
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
  roomCategorySuggestion?: RoomCategory;
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
  suggestedRoomCategoryName?: string;
}

export type SaasPlanType = 'starter' | 'pro' | 'premium';

export interface SaasSettings {
  plan: SaasPlanType;
  billingCycle: 'monthly' | 'yearly';
  renewalDate: string;
  whatsappStatus: 'connected' | 'disconnected' | 'connecting';
  whatsappPhoneNumber: string;
  whatsappInstanceName: string;
  aiAutoReply: boolean;
  aiResponseDelaySeconds: number;
  momoMerchantId: string;
  orangeMoneyMerchantId: string;
  hostPayoutPhone: string;
  hostPayoutName: string;
  niuTaxNumber: string;
  dgiTaxCenter: string;
}
