import { Property, Transaction, InboundLead, OutboundContact, LogisticsTask, SaasSettings } from '../types';
import { calculateFinancialBreakdown } from '../utils/formatters';

export const MOCK_PROPERTIES: Property[] = [
  // 1. Independent Villa (Bonapriso Douala)
  {
    id: 'prop-douala-01',
    name: 'Villa Royale Bonapriso',
    city: 'Douala',
    neighborhood: 'Bonapriso (Rue Njo-Njo)',
    propertyKind: 'independent',
    type: 'Villa',
    pricePerNight: 120000,
    bedrooms: 3,
    bathrooms: 3,
    capacity: 6,
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
    ],
    rating: 4.95,
    reviewsCount: 42,
    occupancyRate: 88,
    status: 'occupied',
    amenities: {
      generator: true,
      generatorKva: 60,
      waterReserve: true,
      waterCapacityLiters: 5000,
      starlinkWifi: true,
      airConditioning: true,
      security24h: true,
      airportShuttle: true,
      smartTv: true,
      equippedKitchen: true,
      pool: true,
      seaView: false,
    },
    fuelLevelPercentage: 85,
    waterLevelPercentage: 92,
    description: 'Prestigieuse villa meublée avec piscine à Bonapriso. Autonomie totale 24/7 : Groupe électrogène insonorisé 60kVA, Forage automatisé avec double filtration, Starlink Très Haut Débit. Idéal séjour d\'affaires ou vacances en famille diaspora.',
  },

  // 2. Hotel & Suites (Douala Bonanjo / Akwa) - MULTI-ROOM CATEGORIES
  {
    id: 'prop-douala-hotel-01',
    name: 'Hôtel Le Grand Wouri & Suites',
    city: 'Douala',
    neighborhood: 'Bonanjo / Akwa (Vue Fleuve Wouri)',
    propertyKind: 'hotel_residence',
    type: 'Hôtel',
    pricePerNight: 55000, // starting from
    bedrooms: 28,
    bathrooms: 28,
    capacity: 65,
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.90,
    reviewsCount: 114,
    occupancyRate: 75,
    status: 'available',
    totalRooms: 28,
    availableRooms: 9,
    roomCategories: [
      {
        id: 'cat-gw-01',
        name: 'Chambre Deluxe Affaires',
        type: 'Deluxe',
        totalInventory: 14,
        availableInventory: 5,
        pricePerNight: 55000,
        capacity: 2,
        bedType: '1 Grand Lit King Size (200x200)',
        amenities: ['Climatisation Inverter', 'Smart TV 50" Netflix/Canal+', 'Bureau ergonomique', 'Wi-Fi Starlink 250Mbps', 'Douche Italienne'],
        images: [
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Chambre insonorisée conçue pour les professionnels et cadres en mission à Douala. Petit-déjeuner buffet inclus.'
      },
      {
        id: 'cat-gw-02',
        name: 'Suite Exécutive VIP Wouri',
        type: 'Suite VIP',
        totalInventory: 10,
        availableInventory: 3,
        pricePerNight: 95000,
        capacity: 3,
        bedType: '1 Lit King Size + 1 Canapé-lit VIP',
        amenities: ['Salon privé séparé', 'Balcon panoramique fleuve Wouri', 'Baignoire balnéothérapie', 'Machine Nespresso', 'Minibar garni'],
        images: [
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Suite spacieuse de 55m² avec espace salon pour recevoir vos partenaires d\'affaires ou vous détendre.'
      },
      {
        id: 'cat-gw-03',
        name: 'Suite Présidentielle Diplomatique',
        type: 'Suite Présidentielle',
        totalInventory: 4,
        availableInventory: 1,
        pricePerNight: 165000,
        capacity: 4,
        bedType: '1 Lit King Size Royal + 2 Lits d\'appoint',
        amenities: ['Superficie 95m²', 'Service majordome dédié H24', 'Navette aéroport offerte en SUV VIP', 'Jacuzzi privatif', 'Check-out tardif 16h'],
        images: [
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Le summum du luxe hôtelier camerounais. Vue imprenable à 180° sur le port et le pont du Wouri.'
      }
    ],
    amenities: {
      generator: true,
      generatorKva: 120, // Grand groupe 120 kVA
      waterReserve: true,
      waterCapacityLiters: 15000, // 15 000 Litres
      starlinkWifi: true,
      airConditioning: true,
      security24h: true,
      airportShuttle: true,
      smartTv: true,
      equippedKitchen: false,
      pool: true,
      seaView: false,
      restaurantBar: true,
      conferenceRoom: true,
    },
    fuelLevelPercentage: 95,
    waterLevelPercentage: 90,
    description: 'Complexe hôtelier 4 étoiles de 28 clés au cœur administratif de Douala. Autonomie industrielle : Groupe 120kVA à déclenchement automatique, Forage 15 000L filtré, Restaurant gastronomique, Bar Lounge & Navette aéroport DLA.',
  },

  // 3. Multi-Room Apart-Hotel (Yaoundé Bastos)
  {
    id: 'prop-yaounde-residence-01',
    name: 'Résidence Hôtelière Bastos Palace',
    city: 'Yaoundé',
    neighborhood: 'Bastos (Face Ambassade des USA)',
    propertyKind: 'hotel_residence',
    type: 'Résidence Hôtelière',
    pricePerNight: 45000,
    bedrooms: 16,
    bathrooms: 16,
    capacity: 36,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.88,
    reviewsCount: 68,
    occupancyRate: 81,
    status: 'available',
    totalRooms: 16,
    availableRooms: 5,
    roomCategories: [
      {
        id: 'cat-bp-01',
        name: 'Studio Meublé Supérieur',
        type: 'Studio Meublé',
        totalInventory: 10,
        availableInventory: 3,
        pricePerNight: 45000,
        capacity: 2,
        bedType: '1 Lit Queen Size confort hôtel',
        amenities: ['Kitchenette équipée', 'Smart TV Canal+', 'Fibre Starlink', 'Climatisation'],
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Studio indépendant de standing tout équipé avec coin cuisine pour courts ou moyens séjours.'
      },
      {
        id: 'cat-bp-02',
        name: 'Appartement 2 Pièces Diplomate',
        type: 'Suite VIP',
        totalInventory: 6,
        availableInventory: 2,
        pricePerNight: 85000,
        capacity: 4,
        bedType: '1 Lit King Size + 1 Canapé Lit Double',
        amenities: ['Grand Salon avec table repas', 'Cuisine américaine complète', 'Balcon', 'Machine à laver'],
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Véritable appartement T2 privatif de 65m² sécurisé avec badge d\'accès électronique.'
      }
    ],
    amenities: {
      generator: true,
      generatorKva: 80,
      waterReserve: true,
      waterCapacityLiters: 10000,
      starlinkWifi: true,
      airConditioning: true,
      security24h: true,
      airportShuttle: true,
      smartTv: true,
      equippedKitchen: true,
      pool: false,
      seaView: false,
      restaurantBar: false,
      conferenceRoom: false,
    },
    fuelLevelPercentage: 80,
    waterLevelPercentage: 85,
    description: '16 appart-hôtels sécurisés dans le quartier diplomatique de Bastos à Yaoundé. Idéal pour consultants internationaux, ONG et séjours diaspora longue durée.',
  },

  // 4. Independent Penthouse (Douala Akwa)
  {
    id: 'prop-douala-02',
    name: 'Executive Penthouse Akwa',
    city: 'Douala',
    neighborhood: 'Akwa (Boulevard de la Liberté)',
    propertyKind: 'independent',
    type: 'Penthouse',
    pricePerNight: 85000,
    bedrooms: 2,
    bathrooms: 2,
    capacity: 4,
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    rating: 4.88,
    reviewsCount: 31,
    occupancyRate: 76,
    status: 'available',
    amenities: {
      generator: true,
      generatorKva: 40,
      waterReserve: true,
      waterCapacityLiters: 3000,
      starlinkWifi: true,
      airConditioning: true,
      security24h: true,
      airportShuttle: true,
      smartTv: true,
      equippedKitchen: true,
      pool: false,
      seaView: false,
    },
    fuelLevelPercentage: 65,
    waterLevelPercentage: 80,
    description: 'Appartement de haut standing au cœur du quartier d\'affaires d\'Akwa. Vue panoramique sur le Wouri, climatisation intégrale, gardien H24, groupe automatique à déclenchement immédiat.',
  },

  // 5. Independent Villa (Yaoundé Bastos)
  {
    id: 'prop-yaounde-01',
    name: 'Résidence Diplomatique Bastos',
    city: 'Yaoundé',
    neighborhood: 'Bastos (Proche Ambassades)',
    propertyKind: 'independent',
    type: 'Villa',
    pricePerNight: 135000,
    bedrooms: 4,
    bathrooms: 4,
    capacity: 8,
    imageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
    rating: 4.98,
    reviewsCount: 56,
    occupancyRate: 92,
    status: 'occupied',
    amenities: {
      generator: true,
      generatorKva: 80,
      waterReserve: true,
      waterCapacityLiters: 8000,
      starlinkWifi: true,
      airConditioning: true,
      security24h: true,
      airportShuttle: true,
      smartTv: true,
      equippedKitchen: true,
      pool: true,
      seaView: false,
    },
    fuelLevelPercentage: 90,
    waterLevelPercentage: 95,
    description: 'Somptueuse résidence sécurisée dans le quartier chic de Bastos. Navette VIP depuis l\'aéroport Nsimalen comprise pour les séjours > 5 jours. Forage professionnel, groupe 80kVA, Starlink 250 Mbps.',
  },

  // 6. Independent Villa (Kribi Ngoye Plage)
  {
    id: 'prop-kribi-01',
    name: 'Lodge Pieds-dans-l\'Eau Ngoye',
    city: 'Kribi',
    neighborhood: 'Ngoye Plage (Front de Mer)',
    propertyKind: 'independent',
    type: 'Villa',
    pricePerNight: 95000,
    bedrooms: 3,
    bathrooms: 3,
    capacity: 6,
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    rating: 4.92,
    reviewsCount: 38,
    occupancyRate: 85,
    status: 'occupied',
    amenities: {
      generator: true,
      generatorKva: 45,
      waterReserve: true,
      waterCapacityLiters: 4000,
      starlinkWifi: true,
      airConditioning: true,
      security24h: true,
      airportShuttle: true,
      smartTv: true,
      equippedKitchen: true,
      pool: false,
      seaView: true,
    },
    fuelLevelPercentage: 75,
    waterLevelPercentage: 88,
    description: 'Accès direct à la plage de sable blanc de Kribi, barbecue de crevettes géantes face au coucher du soleil. Climatisation, groupe automatique silencieux et Starlink.',
  },

  // 7. Independent Villa (Limbé Bota)
  {
    id: 'prop-limbe-01',
    name: 'Atlantic View Villa Bota',
    city: 'Limbé',
    neighborhood: 'Bota (Vue Volcan & Océan)',
    propertyKind: 'independent',
    type: 'Villa',
    pricePerNight: 70000,
    bedrooms: 2,
    bathrooms: 2,
    capacity: 4,
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    rating: 4.80,
    reviewsCount: 22,
    occupancyRate: 68,
    status: 'available',
    amenities: {
      generator: true,
      generatorKva: 35,
      waterReserve: true,
      waterCapacityLiters: 3000,
      starlinkWifi: true,
      airConditioning: true,
      security24h: true,
      airportShuttle: false,
      smartTv: true,
      equippedKitchen: true,
      pool: false,
      seaView: true,
    },
    fuelLevelPercentage: 55,
    waterLevelPercentage: 65,
    description: 'Magnifique villa surplombant l\'océan Atlantique et le mont Cameroun. Sable noir volcanique, cadre reposant, groupe électrogène et réserve d\'eau garantis.',
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  (() => {
    const amount = 360000;
    const provider = 'MTN_MOMO';
    const breakdown = calculateFinancialBreakdown(amount, provider);
    return {
      id: 'tx-237-901',
      propertyId: 'prop-douala-01',
      propertyName: 'Villa Royale Bonapriso',
      guestName: 'Christian Mbarga',
      guestPhone: '+33 6 45 89 12 34',
      provider,
      amount,
      ttaTax: breakdown.ttaTax,
      operatorFee: breakdown.operatorFee,
      netAmount: breakdown.netAmount,
      status: 'completed',
      date: '2026-09-02T11:45:00Z',
      nights: 3,
      reference: 'MOMO-CI-892183921',
    };
  })(),
  (() => {
    const amount = 285000;
    const provider = 'ORANGE_MONEY';
    const breakdown = calculateFinancialBreakdown(amount, provider);
    return {
      id: 'tx-237-902',
      propertyId: 'prop-douala-hotel-01',
      propertyName: 'Hôtel Le Grand Wouri & Suites',
      roomCategoryName: 'Suite Exécutive VIP Wouri (3 nuits)',
      guestName: 'Dr. Valérie Eyenga (Diaspora Canada)',
      guestPhone: '+1 514 890 2314',
      provider,
      amount,
      ttaTax: breakdown.ttaTax,
      operatorFee: breakdown.operatorFee,
      netAmount: breakdown.netAmount,
      status: 'completed',
      date: '2026-09-01T16:20:00Z',
      nights: 3,
      reference: 'OM-TX-472910384',
    };
  })(),
  (() => {
    const amount = 190000;
    const provider = 'ORANGE_MONEY';
    const breakdown = calculateFinancialBreakdown(amount, provider);
    return {
      id: 'tx-237-903',
      propertyId: 'prop-kribi-01',
      propertyName: 'Lodge Pieds-dans-l\'Eau Ngoye',
      guestName: 'Dr. Boris Kamga',
      guestPhone: '+237 699 44 22 11',
      provider,
      amount,
      ttaTax: breakdown.ttaTax,
      operatorFee: breakdown.operatorFee,
      netAmount: breakdown.netAmount,
      status: 'completed',
      date: '2026-08-31T09:15:00Z',
      nights: 2,
      reference: 'OM-TX-109283741',
    };
  })(),
  (() => {
    const amount = 255000;
    const provider = 'MTN_MOMO';
    const breakdown = calculateFinancialBreakdown(amount, provider);
    return {
      id: 'tx-237-904',
      propertyId: 'prop-douala-02',
      propertyName: 'Executive Penthouse Akwa',
      guestName: 'Sarah Ngo Bikoi',
      guestPhone: '+237 677 88 99 00',
      provider,
      amount,
      ttaTax: breakdown.ttaTax,
      operatorFee: breakdown.operatorFee,
      netAmount: breakdown.netAmount,
      status: 'completed',
      date: '2026-08-30T14:10:00Z',
      nights: 3,
      reference: 'MOMO-CI-773829102',
    };
  })(),
  (() => {
    const amount = 90000;
    const provider = 'CASH';
    const breakdown = calculateFinancialBreakdown(amount, provider);
    return {
      id: 'tx-237-905',
      propertyId: 'prop-yaounde-residence-01',
      propertyName: 'Résidence Hôtelière Bastos Palace',
      roomCategoryName: 'Studio Meublé Supérieur',
      guestName: 'Patrice Ondoa',
      guestPhone: '+237 655 12 34 56',
      provider,
      amount,
      ttaTax: breakdown.ttaTax,
      operatorFee: breakdown.operatorFee,
      netAmount: breakdown.netAmount,
      status: 'completed',
      date: '2026-08-29T18:00:00Z',
      nights: 2,
      reference: 'CASH-REC-00892',
    };
  })(),
  (() => {
    const amount = 675000;
    const provider = 'MTN_MOMO';
    const breakdown = calculateFinancialBreakdown(amount, provider);
    return {
      id: 'tx-237-906',
      propertyId: 'prop-yaounde-01',
      propertyName: 'Résidence Diplomatique Bastos',
      guestName: 'Jean-Paul Fotso (Bruxelles)',
      guestPhone: '+32 470 12 34 56',
      provider,
      amount,
      ttaTax: breakdown.ttaTax,
      operatorFee: breakdown.operatorFee,
      netAmount: breakdown.netAmount,
      status: 'completed',
      date: '2026-08-28T10:30:00Z',
      nights: 5,
      reference: 'MOMO-CI-334455667',
    };
  })(),
];

// Inbound Leads (Inquiries received via WhatsApp AI Concierge)
export const MOCK_LEADS: InboundLead[] = [
  {
    id: 'lead-01',
    name: 'Samuel Eto\'o Junior',
    phone: '+33 6 12 34 56 78',
    isDiaspora: true,
    diasporaCountry: 'France',
    targetCity: 'Douala',
    budget: 850000,
    nights: 7,
    dates: '15 Sep - 22 Sep 2026',
    intentScore: 96,
    status: 'hot',
    keyRequirements: ['Groupe électrogène indispensable', 'Navette aéroport Douala', 'Piscine privée'],
    recommendedPropertyId: 'prop-douala-01',
    lastMessage: 'Bonjour, je rentre de Paris pour une semaine de vacances. Est-ce que le groupe tourne en continu si Eneo coupe ? Je peux verser l\'acompte par Orange Money tout de suite.',
    lastMessageTime: 'Il y a 10 min',
    preferredType: 'independent'
  },
  {
    id: 'lead-02',
    name: 'Marcelle Nguemo (Délégation MTN)',
    phone: '+1 301 555 0199',
    isDiaspora: true,
    diasporaCountry: 'USA (Maryland)',
    targetCity: 'Douala',
    budget: 650000,
    nights: 5,
    dates: '20 Sep - 25 Sep 2026',
    intentScore: 94,
    status: 'hot',
    keyRequirements: ['3 Chambres Affaires ou Suites', 'Starlink haute vitesse pour visios', 'Facture conforme DGI'],
    recommendedPropertyId: 'prop-douala-hotel-01',
    lastMessage: 'Nous sommes une équipe de 3 personnes en mission à Douala. Avez-vous 3 Suites Exécutives au Grand Wouri avec petit déjeuner et facture DGI ?',
    lastMessageTime: 'Il y a 25 min',
    preferredType: 'hotel'
  },
  {
    id: 'lead-03',
    name: 'Dr. Hervé Tchinda',
    phone: '+237 699 00 11 22',
    isDiaspora: false,
    targetCity: 'Kribi',
    budget: 200000,
    nights: 2,
    dates: '12 Sep - 14 Sep 2026',
    intentScore: 78,
    status: 'warm',
    keyRequirements: ['Vue mer', 'Barbecue', 'Climatisation'],
    recommendedPropertyId: 'prop-kribi-01',
    lastMessage: 'Bonjour AfriHost, vous avez une disponibilité les 12 et 13 septembre pour un weekend détente à Kribi ?',
    lastMessageTime: 'Il y a 2h',
    preferredType: 'independent'
  },
  {
    id: 'lead-04',
    name: 'Armand Bisseck',
    phone: '+49 176 88990011',
    isDiaspora: true,
    diasporaCountry: 'Allemagne (Berlin)',
    targetCity: 'Yaoundé',
    budget: 450000,
    nights: 6,
    dates: 'Octobre 2026',
    intentScore: 60,
    status: 'warm',
    keyRequirements: ['Studio meublé Bastos', 'Wi-Fi rapide', 'Groupe automatique'],
    recommendedPropertyId: 'prop-yaounde-residence-01',
    lastMessage: 'Je planifie un voyage pour octobre à Yaoundé, quel est le tarif pour un studio à la résidence Bastos Palace ?',
    lastMessageTime: 'Hier',
    preferredType: 'hotel'
  }
];

// Outbound Contacts Database (for CSV/Excel importation and WhatsApp broadcast campaigns)
export const MOCK_OUTBOUND_CONTACTS: OutboundContact[] = [
  {
    id: 'out-01',
    name: 'Serge Manga (Directeur Audit TotalEnergies)',
    phone: '+237 699 11 22 33',
    segment: 'Affaires & Entreprises',
    city: 'Douala',
    lastStayDate: 'Juillet 2026',
    estimatedBudgetFCFA: 600000,
    status: 'to_contact',
    tags: ['Entreprise', 'Habitué Wouri', 'Facture DGI'],
    notes: 'Réserve régulièrement des suites pour missions d\'audit.'
  },
  {
    id: 'out-02',
    name: 'Carine Mbida (Diaspora Paris 15e)',
    phone: '+33 6 78 90 12 34',
    segment: 'Diaspora France/Europe',
    city: 'Yaoundé',
    lastStayDate: 'Août 2025',
    estimatedBudgetFCFA: 950000,
    status: 'to_contact',
    tags: ['Diaspora VIP', 'Famille 5 pers', 'Navette Nsimalen'],
    notes: 'Rentre au Cameroun chaque fin d\'année pour les fêtes.'
  },
  {
    id: 'out-03',
    name: 'Stéphane Bell (Diaspora Montréal)',
    phone: '+1 514 234 5678',
    segment: 'Diaspora USA/Canada',
    city: 'Douala',
    lastStayDate: 'Décembre 2025',
    estimatedBudgetFCFA: 1200000,
    status: 'contacted',
    tags: ['Diaspora Canada', 'Villa Bonapriso', 'MoMo Pay'],
    notes: 'Très sensible à la qualité de la climatisation et à la piscine.'
  },
  {
    id: 'out-04',
    name: 'Mireille Kotto (Club Vacances Kribi)',
    phone: '+237 677 33 44 55',
    segment: 'Tourisme & Vacances',
    city: 'Kribi',
    lastStayDate: 'Mai 2026',
    estimatedBudgetFCFA: 350000,
    status: 'to_contact',
    tags: ['Weekend Plage', 'Barbecue', 'Orange Money'],
    notes: 'Aime louer le lodge Ngoye pour des anniversaires.'
  },
  {
    id: 'out-05',
    name: 'Fabrice Nguena (Cabinet Juridique Bastos)',
    phone: '+237 655 88 99 00',
    segment: 'Affaires & Entreprises',
    city: 'Yaoundé',
    lastStayDate: 'Juin 2026',
    estimatedBudgetFCFA: 480000,
    status: 'to_contact',
    tags: ['Avocats', 'Bastos', 'Starlink Urgent'],
    notes: 'Recherche uniquement des logements avec Starlink pour réunions.'
  },
  {
    id: 'out-06',
    name: 'Nadine Tchakounté (Diaspora Bruxelles)',
    phone: '+32 485 12 34 56',
    segment: 'Diaspora France/Europe',
    city: 'Douala',
    lastStayDate: 'Février 2026',
    estimatedBudgetFCFA: 750000,
    status: 'to_contact',
    tags: ['Diaspora Belgique', 'Penthouse Akwa'],
    notes: 'Cherche un meublé pour le salon Promote.'
  },
  {
    id: 'out-07',
    name: 'Gaston Ekotto (Clients Fidèles AfriHost)',
    phone: '+237 690 44 55 66',
    segment: 'Clients Fidèles',
    city: 'Limbé',
    lastStayDate: 'Août 2026',
    estimatedBudgetFCFA: 300000,
    status: 'booked',
    tags: ['Fidèle VIP', 'Limbé Bota'],
    notes: 'Client récurrent depuis 2 ans.'
  }
];

export const MOCK_LOGISTICS_TASKS: LogisticsTask[] = [
  {
    id: 'task-01',
    propertyId: 'prop-douala-hotel-01',
    propertyName: 'Hôtel Le Grand Wouri & Suites',
    type: 'FUEL_REFILL',
    title: 'Ravitaillement Cuve Gasoil 120kVA (150L)',
    description: 'Niveau cuve principale à 65%. Approvisionner 150L Gasoil chez Total Bonanjo avant le weekend.',
    assignedTo: 'Équipe Technique Wouri',
    status: 'pending',
    urgency: 'high',
    dueDate: 'Aujourd\'hui avant 17h',
    estimatedCostFCFA: 127500,
  },
  {
    id: 'task-02',
    propertyId: 'prop-douala-01',
    propertyName: 'Villa Royale Bonapriso',
    type: 'CLEANING',
    title: 'Ménage Approfondi & Blanchisserie Check-in',
    description: 'Nettoyage des 3 chambres, changement des draps brodés, stérilisation vaisselle avant arrivée de Samuel Eto\'o Jr.',
    assignedTo: 'Marie & Chantal (Équipe Ménage Douala)',
    status: 'in_progress',
    urgency: 'high',
    dueDate: 'Demain à 10h',
    estimatedCostFCFA: 15000,
  },
  {
    id: 'task-03',
    propertyId: 'prop-yaounde-residence-01',
    propertyName: 'Résidence Hôtelière Bastos Palace',
    type: 'WATER_CHECK',
    title: 'Contrôle Filtres Forage & Pression Cuve 10 000L',
    description: 'Remplacement de la cartouche filtrante sédiment 5 microns et dosage chlore régulé.',
    assignedTo: 'Plomberie Pro Bastos',
    status: 'completed',
    urgency: 'medium',
    dueDate: 'Effectué ce matin',
    estimatedCostFCFA: 25000,
  },
  {
    id: 'task-04',
    propertyId: 'prop-kribi-01',
    propertyName: 'Lodge Pieds-dans-l\'Eau Ngoye',
    type: 'STARLINK_CHECK',
    title: 'Alignement Parabole Starlink Maritime',
    description: 'Test débit 220 Mbps après fortes pluies côtières. Latence optimale confirmée.',
    assignedTo: 'Technicien Réseau Kribi',
    status: 'completed',
    urgency: 'low',
    dueDate: 'Hier',
    estimatedCostFCFA: 0,
  }
];

export const DEFAULT_SAAS_SETTINGS: SaasSettings = {
  plan: 'pro',
  billingCycle: 'monthly',
  renewalDate: '2026-10-02',
  whatsappStatus: 'connected',
  whatsappPhoneNumber: '+237 699 00 00 00',
  whatsappInstanceName: 'AfriHost-Cameroon-Primary',
  aiAutoReply: true,
  aiResponseDelaySeconds: 3,
  momoMerchantId: 'MOMO-MERCHANT-237-8899',
  orangeMoneyMerchantId: 'OM-PAY-CM-44321',
  hostPayoutPhone: '+237 699 44 22 11',
  hostPayoutName: 'AfriHost Group SARL',
  niuTaxNumber: 'M052319028120K',
  dgiTaxCenter: 'Centre des Impôts des Moyennes Entreprises (CIME) Douala 1er',
};
