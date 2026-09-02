import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Zap, 
  Droplets, 
  Wifi, 
  Wind, 
  ShieldCheck, 
  Car, 
  Tv, 
  Utensils, 
  Waves, 
  Eye, 
  Fuel, 
  CheckCircle, 
  Star, 
  Smartphone, 
  Bot,
  Search,
  SlidersHorizontal,
  Plus,
  Bed,
  Image as ImageIcon,
  Layers,
  ChevronDown,
  ChevronUp,
  X,
  Hotel
} from 'lucide-react';
import { Property, City, RoomCategory, PropertyKind } from '../types';
import { formatFCFA } from '../utils/formatters';

interface PropertiesViewProps {
  properties: Property[];
  selectedCity: City;
  setSelectedCity: (city: City) => void;
  onOpenUSSD: (prop: Property, roomCategory?: RoomCategory) => void;
  onSelectForChat: (prop: Property) => void;
  onAddProperty: (newProp: Property) => void;
}

export const PropertiesView: React.FC<PropertiesViewProps> = ({
  properties,
  selectedCity,
  setSelectedCity,
  onOpenUSSD,
  onSelectForChat,
  onAddProperty,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [kindFilter, setKindFilter] = useState<'all' | 'independent' | 'hotel_residence'>('all');
  const [filterAmenity, setFilterAmenity] = useState<'all' | 'generator' | 'starlink' | 'pool' | 'shuttle'>('all');
  
  // Selected hotel for category modal
  const [selectedHotelForCategories, setSelectedHotelForCategories] = useState<Property | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Property Form State
  const [newPropKind, setNewPropKind] = useState<PropertyKind>('independent');
  const [newPropName, setNewPropName] = useState('');
  const [newPropCity, setNewPropCity] = useState<'Douala' | 'Yaoundé' | 'Kribi' | 'Limbé'>('Douala');
  const [newPropNeighborhood, setNewPropNeighborhood] = useState('');
  const [newPropPrice, setNewPropPrice] = useState(75000);
  const [newPropImg, setNewPropImg] = useState('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80');
  const [newPropGenKva, setNewPropGenKva] = useState(45);
  const [newPropWaterLiters, setNewPropWaterLiters] = useState(3000);
  const [newPropDesc, setNewPropDesc] = useState('');

  // Categories for new hotel
  const [newCategories, setNewCategories] = useState<Omit<RoomCategory, 'id'>[]>([
    {
      name: 'Chambre Standard Confort',
      type: 'Standard',
      totalInventory: 10,
      availableInventory: 6,
      pricePerNight: 45000,
      capacity: 2,
      bedType: '1 Grand Lit Queen Size',
      amenities: ['Climatisation', 'Smart TV', 'Wi-Fi Starlink'],
      images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'],
      description: 'Chambre moderne tout confort avec salle de bain privée.'
    },
    {
      name: 'Suite VIP Exécutive',
      type: 'Suite VIP',
      totalInventory: 4,
      availableInventory: 2,
      pricePerNight: 85000,
      capacity: 3,
      bedType: '1 Lit King Size + Salon',
      amenities: ['Salon privé', 'Baignoire balnéo', 'Wi-Fi Starlink', 'Petit déjeuner inclus'],
      images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'],
      description: 'Suite spacieuse avec salon privatif et vue dégagée.'
    }
  ]);

  const filtered = properties.filter((p) => {
    const matchesCity = selectedCity === 'All' || p.city === selectedCity;
    const matchesKind = kindFilter === 'all' || p.propertyKind === kindFilter;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.roomCategories && p.roomCategories.some(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())));
    
    let matchesAmenity = true;
    if (filterAmenity === 'generator') matchesAmenity = p.amenities.generator;
    if (filterAmenity === 'starlink') matchesAmenity = p.amenities.starlinkWifi;
    if (filterAmenity === 'pool') matchesAmenity = Boolean(p.amenities.pool);
    if (filterAmenity === 'shuttle') matchesAmenity = p.amenities.airportShuttle;

    return matchesCity && matchesKind && matchesSearch && matchesAmenity;
  });

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    const isHotel = newPropKind === 'hotel_residence';
    const totalRooms = isHotel ? newCategories.reduce((acc, c) => acc + c.totalInventory, 0) : 1;
    const availableRooms = isHotel ? newCategories.reduce((acc, c) => acc + c.availableInventory, 0) : 1;
    const startingPrice = isHotel 
      ? Math.min(...newCategories.map(c => c.pricePerNight))
      : Number(newPropPrice);

    const generatedProp: Property = {
      id: `prop-${newPropCity.toLowerCase()}-${Date.now().toString().slice(-4)}`,
      name: newPropName,
      city: newPropCity,
      neighborhood: newPropNeighborhood || `${newPropCity} Centre`,
      propertyKind: newPropKind,
      type: isHotel ? 'Hôtel' : 'Villa',
      pricePerNight: startingPrice,
      bedrooms: totalRooms,
      bathrooms: totalRooms,
      capacity: isHotel ? totalRooms * 2 : 6,
      imageUrl: newPropImg,
      galleryImages: [newPropImg],
      rating: 4.9,
      reviewsCount: 1,
      occupancyRate: isHotel ? Math.round(((totalRooms - availableRooms) / totalRooms) * 100) : 0,
      status: 'available',
      totalRooms: isHotel ? totalRooms : undefined,
      availableRooms: isHotel ? availableRooms : undefined,
      roomCategories: isHotel ? newCategories.map((c, idx) => ({ ...c, id: `cat-${Date.now()}-${idx}` })) : undefined,
      amenities: {
        generator: true,
        generatorKva: Number(newPropGenKva),
        waterReserve: true,
        waterCapacityLiters: Number(newPropWaterLiters),
        starlinkWifi: true,
        airConditioning: true,
        security24h: true,
        airportShuttle: true,
        smartTv: true,
        equippedKitchen: !isHotel,
        pool: false,
        seaView: newPropCity === 'Kribi' || newPropCity === 'Limbé',
      },
      fuelLevelPercentage: 90,
      waterLevelPercentage: 90,
      description: newPropDesc || `${newPropName} — Hébergement de haut standing à ${newPropCity} avec autonomie 24/7 garantie.`,
    };

    onAddProperty(generatedProp);
    setShowAddModal(false);
    setNewPropName('');
    setNewPropNeighborhood('');
    setNewPropDesc('');
  };

  const handleAddCategoryRow = () => {
    setNewCategories([
      ...newCategories,
      {
        name: `Nouvelle Catégorie ${newCategories.length + 1}`,
        type: 'Standard',
        totalInventory: 5,
        availableInventory: 3,
        pricePerNight: 50000,
        capacity: 2,
        bedType: '1 Grand Lit King Size',
        amenities: ['Climatisation', 'Starlink', 'Smart TV'],
        images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'],
        description: 'Chambre tout équipée de grand standing.'
      }
    ]);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-black text-white">
              Parc Immobilier, Hôtels & Autonomie 24/7
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gestion unifiée : Meublés indépendants (villas/studios) et Hôtels multi-chambres avec inventaire en temps réel.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/50 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter Logement / Hôtel</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
        
        {/* Kind Filters */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setKindFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              kindFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tous ({properties.length})
          </button>
          <button
            onClick={() => setKindFilter('independent')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              kindFilter === 'independent' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Meublés Indépendants ({properties.filter(p => p.propertyKind === 'independent').length})</span>
          </button>
          <button
            onClick={() => setKindFilter('hotel_residence')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              kindFilter === 'hotel_residence' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Hotel className="w-3.5 h-3.5" />
            <span>Hôtels & Multi-Chambres ({properties.filter(p => p.propertyKind === 'hotel_residence').length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par nom, quartier, suite..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        </div>

      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((property) => {
          const isHotel = property.propertyKind === 'hotel_residence';

          return (
            <div
              key={property.id}
              className={`glass-panel rounded-2xl overflow-hidden border transition-all flex flex-col justify-between group shadow-lg ${
                isHotel ? 'border-purple-500/30 hover:border-purple-500/60' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Image & Header Badges */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                  <img
                    src={property.imageUrl}
                    alt={property.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Top Left: City & Property Kind Pill */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-950/85 backdrop-blur-md text-white border border-slate-700 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      {property.city}
                    </span>
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold backdrop-blur-md border ${
                      isHotel
                        ? 'bg-purple-950/90 text-purple-300 border-purple-700'
                        : 'bg-slate-900/90 text-slate-300 border-slate-700'
                    }`}>
                      {property.type}
                    </span>
                  </div>

                  {/* Top Right: Status / Inventory Badge */}
                  <div className="absolute top-3 right-3">
                    {isHotel ? (
                      <div className="px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider backdrop-blur-md bg-emerald-500/90 text-slate-950 shadow-md flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse"></span>
                        <span>{property.availableRooms}/{property.totalRooms} Disponibles</span>
                      </div>
                    ) : (
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-md ${
                        property.status === 'available'
                          ? 'bg-emerald-500/90 text-white'
                          : 'bg-amber-500/90 text-slate-950'
                      }`}>
                        {property.status === 'available' ? 'Disponible' : 'Occupé'}
                      </span>
                    )}
                  </div>

                  {/* Bottom Right: Price Badge */}
                  <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-lg">
                    <div className="text-sm font-mono font-black text-amber-300">
                      {isHotel && <span className="text-[10px] text-slate-400 font-sans font-normal mr-1">Dès</span>}
                      {formatFCFA(property.pricePerNight)}
                      <span className="text-[10px] text-slate-400 font-sans font-normal ml-1">/nuit</span>
                    </div>
                  </div>

                  {/* Bottom Left: Rating */}
                  <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md px-2 py-1 rounded-lg border border-slate-700/80 flex items-center gap-1 text-xs font-semibold text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{property.rating}</span>
                    <span className="text-[10px] text-slate-400">({property.reviewsCount})</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-3.5">
                  <div>
                    <h3 className="font-extrabold text-base text-white group-hover:text-emerald-300 transition-colors">
                      {property.name}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {property.neighborhood}
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {property.description}
                  </p>

                  {/* Room Categories Preview for Hotels */}
                  {isHotel && property.roomCategories && (
                    <div className="p-3 rounded-xl bg-slate-950/90 border border-purple-900/30 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-purple-300 uppercase tracking-wider">
                        <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5" /> Inventaire par Catégorie :</span>
                        <span className="font-mono text-white">{property.roomCategories.length} types</span>
                      </div>

                      <div className="space-y-1.5">
                        {property.roomCategories.map((cat) => (
                          <div key={cat.id} className="flex items-center justify-between text-xs bg-slate-900 p-2 rounded-lg border border-slate-800">
                            <div>
                              <div className="font-semibold text-white">{cat.name}</div>
                              <div className="text-[10px] text-slate-400">{cat.bedType}</div>
                            </div>
                            <div className="text-right">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                {cat.availableInventory}/{cat.totalInventory} dispo
                              </span>
                              <div className="font-mono font-bold text-amber-300 text-[11px] mt-0.5">
                                {formatFCFA(cat.pricePerNight)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => setSelectedHotelForCategories(property)}
                        className="w-full py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-semibold text-xs border border-purple-500/30 flex items-center justify-center gap-1 transition-colors mt-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Voir Galeries Photos & Tarifs Détallés</span>
                      </button>
                    </div>
                  )}

                  {/* Autonomy and Amenities Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {property.amenities.generator && (
                      <span className="px-2 py-1 rounded-lg text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-400" />
                        Groupe {property.amenities.generatorKva} kVA
                      </span>
                    )}

                    {property.amenities.waterReserve && (
                      <span className="px-2 py-1 rounded-lg text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 font-medium flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-blue-400" />
                        Cuve {property.amenities.waterCapacityLiters}L
                      </span>
                    )}

                    {property.amenities.starlinkWifi && (
                      <span className="px-2 py-1 rounded-lg text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium flex items-center gap-1">
                        <Wifi className="w-3 h-3 text-purple-400" />
                        Starlink
                      </span>
                    )}

                    {property.amenities.airportShuttle && (
                      <span className="px-2 py-1 rounded-lg text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                        <Car className="w-3 h-3 text-emerald-400" /> Navette VIP
                      </span>
                    )}

                    {property.amenities.pool && (
                      <span className="px-2 py-1 rounded-lg text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20">
                        🏊 Piscine
                      </span>
                    )}
                  </div>

                  {/* Fuel & Water Status Gauges */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                    <div>
                      <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span className="flex items-center gap-1">
                          <Fuel className="w-3 h-3 text-amber-400" /> Gasoil
                        </span>
                        <span className="font-mono font-bold text-white">{property.fuelLevelPercentage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${property.fuelLevelPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span className="flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-blue-400" /> Forage
                        </span>
                        <span className="font-mono font-bold text-white">{property.waterLevelPercentage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-400 rounded-full"
                          style={{ width: `${property.waterLevelPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-5 pt-0 grid grid-cols-2 gap-3">
                <button
                  onClick={() => onSelectForChat(property)}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Bot className="w-4 h-4 text-emerald-400" />
                  <span>Tester Bot IA</span>
                </button>

                <button
                  onClick={() => onOpenUSSD(property)}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-md shadow-amber-950/40"
                >
                  <Smartphone className="w-4 h-4 text-slate-950" />
                  <span>Paiement MoMo/OM</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hotel Room Categories Details Modal */}
      {selectedHotelForCategories && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative bg-slate-900 border border-purple-500/40 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in text-slate-100 my-8">
            
            <button
              onClick={() => setSelectedHotelForCategories(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
                <Hotel className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">{selectedHotelForCategories.name}</h3>
                <p className="text-xs text-slate-400">
                  📍 {selectedHotelForCategories.neighborhood} ({selectedHotelForCategories.city}) — {selectedHotelForCategories.totalRooms} Chambres & Suites
                </p>
              </div>
            </div>

            {/* Categories List */}
            <div className="space-y-4">
              {selectedHotelForCategories.roomCategories?.map((cat) => (
                <div key={cat.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-white">{cat.name}</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {cat.availableInventory} / {cat.totalInventory} Disponibles
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{cat.bedType} • Jusqu'à {cat.capacity} personnes</p>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-mono font-black text-amber-300">
                        {formatFCFA(cat.pricePerNight)} <span className="text-xs text-slate-400 font-normal">/nuit</span>
                      </div>
                      <div className="text-[10px] text-slate-500">TTA 0.2% incluse</div>
                    </div>
                  </div>

                  {/* Category Photos Gallery */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {cat.images.map((img, idx) => (
                      <div key={idx} className="h-24 rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
                        <img src={img} alt={cat.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </div>
                    ))}
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {cat.amenities.map((am, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md text-[11px] bg-slate-900 text-slate-300 border border-slate-800">
                        ✓ {am}
                      </span>
                    ))}
                  </div>

                  {/* Direct USSD Action for this Category */}
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        const hotel = selectedHotelForCategories;
                        setSelectedHotelForCategories(null);
                        onOpenUSSD(hotel, cat);
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Réserver & Payer cette Suite en USSD ({formatFCFA(cat.pricePerNight)})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* Add Property / Hotel Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in text-slate-100 my-8">
            
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Plus className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Ajouter un Hébergement ou Hôtel</h3>
                <p className="text-xs text-slate-400">Meublé indépendant ou Complexe hôtelier avec catégories de chambres.</p>
              </div>
            </div>

            <form onSubmit={handleCreateProperty} className="space-y-4 text-xs">
              
              {/* Kind selection */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Type d'Établissement</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewPropKind('independent')}
                    className={`p-3 rounded-xl border flex items-center gap-2 transition-all ${
                      newPropKind === 'independent'
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    <div className="text-left">
                      <div className="font-bold">Meublé Indépendant</div>
                      <div className="text-[10px] text-slate-400">Villa, Penthouse, Studio</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewPropKind('hotel_residence')}
                    className={`p-3 rounded-xl border flex items-center gap-2 transition-all ${
                      newPropKind === 'hotel_residence'
                        ? 'bg-purple-500/10 border-purple-500 text-purple-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Hotel className="w-4 h-4 text-purple-400" />
                    <div className="text-left">
                      <div className="font-bold">Hôtel / Résidence Multi-chambres</div>
                      <div className="text-[10px] text-slate-400">Gestion par catégories & stock</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Nom du logement / complexe</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Résidence Serena Bonapriso"
                    value={newPropName}
                    onChange={(e) => setNewPropName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Ville au Cameroun</label>
                  <select
                    value={newPropCity}
                    onChange={(e) => setNewPropCity(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Douala">Douala</option>
                    <option value="Yaoundé">Yaoundé</option>
                    <option value="Kribi">Kribi</option>
                    <option value="Limbé">Limbé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Quartier précis</label>
                  <input
                    type="text"
                    placeholder="Ex: Bastos, Bonanjo, Ngoye Plage"
                    value={newPropNeighborhood}
                    onChange={(e) => setNewPropNeighborhood(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {newPropKind === 'independent' ? (
                  <div>
                    <label className="block text-slate-400 mb-1">Tarif par Nuitée (FCFA)</label>
                    <input
                      type="number"
                      value={newPropPrice}
                      onChange={(e) => setNewPropPrice(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-slate-400 mb-1">Nombre total de catégories</label>
                    <div className="text-white font-bold p-2 bg-slate-950 rounded-xl border border-slate-800">
                      {newCategories.length} catégories définies
                    </div>
                  </div>
                )}
              </div>

              {/* If Hotel, Categories Builder */}
              {newPropKind === 'hotel_residence' && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-purple-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-300">Catégories de Chambres & Inventaire :</span>
                    <button
                      type="button"
                      onClick={handleAddCategoryRow}
                      className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Ajouter Catégorie
                    </button>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {newCategories.map((cat, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                        <input
                          type="text"
                          value={cat.name}
                          onChange={(e) => {
                            const updated = [...newCategories];
                            updated[idx].name = e.target.value;
                            setNewCategories(updated);
                          }}
                          placeholder="Nom Catégorie"
                          className="bg-slate-950 border border-slate-750 rounded-lg px-2 py-1 text-white"
                        />
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400 text-[10px]">Stock:</span>
                          <input
                            type="number"
                            value={cat.totalInventory}
                            onChange={(e) => {
                              const updated = [...newCategories];
                              updated[idx].totalInventory = Number(e.target.value);
                              updated[idx].availableInventory = Number(e.target.value);
                              setNewCategories(updated);
                            }}
                            className="w-14 bg-slate-950 border border-slate-750 rounded-lg px-2 py-1 text-white font-mono"
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400 text-[10px]">FCFA:</span>
                          <input
                            type="number"
                            value={cat.pricePerNight}
                            onChange={(e) => {
                              const updated = [...newCategories];
                              updated[idx].pricePerNight = Number(e.target.value);
                              setNewCategories(updated);
                            }}
                            className="w-full bg-slate-950 border border-slate-750 rounded-lg px-2 py-1 text-amber-300 font-mono"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Autonomy specs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Puissance Groupe (kVA)</label>
                  <input
                    type="number"
                    value={newPropGenKva}
                    onChange={(e) => setNewPropGenKva(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Cuve Réserve Eau (Litres)</label>
                  <input
                    type="number"
                    value={newPropWaterLiters}
                    onChange={(e) => setNewPropWaterLiters(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">URL Photo Principale</label>
                <input
                  type="text"
                  value={newPropImg}
                  onChange={(e) => setNewPropImg(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Enregistrer l'Établissement
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
