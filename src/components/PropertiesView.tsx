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
  SlidersHorizontal
} from 'lucide-react';
import { Property, City } from '../types';
import { formatFCFA } from '../utils/formatters';

interface PropertiesViewProps {
  properties: Property[];
  selectedCity: City;
  setSelectedCity: (city: City) => void;
  onOpenUSSD: (prop: Property) => void;
  onSelectForChat: (prop: Property) => void;
}

export const PropertiesView: React.FC<PropertiesViewProps> = ({
  properties,
  selectedCity,
  setSelectedCity,
  onOpenUSSD,
  onSelectForChat,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAmenity, setFilterAmenity] = useState<'all' | 'generator' | 'starlink' | 'pool' | 'shuttle'>('all');

  const filtered = properties.filter((p) => {
    const matchesCity = selectedCity === 'All' || p.city === selectedCity;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesAmenity = true;
    if (filterAmenity === 'generator') matchesAmenity = p.amenities.generator;
    if (filterAmenity === 'starlink') matchesAmenity = p.amenities.starlinkWifi;
    if (filterAmenity === 'pool') matchesAmenity = Boolean(p.amenities.pool);
    if (filterAmenity === 'shuttle') matchesAmenity = p.amenities.airportShuttle;

    return matchesCity && matchesSearch && matchesAmenity;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header and Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            Parc Immobilier de Haut Standing au Cameroun
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Garantie triple autonomie : ⚡ Groupe électrogène automatique | 💧 Forage d'eau | 🛰️ Starlink
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par quartier, villa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 w-52 sm:w-64"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setFilterAmenity('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterAmenity === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilterAmenity('generator')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
                filterAmenity === 'generator' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3 h-3 text-amber-400" /> ⚡ Groupe
            </button>
            <button
              onClick={() => setFilterAmenity('starlink')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterAmenity === 'starlink' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🛰️ Starlink
            </button>
            <button
              onClick={() => setFilterAmenity('pool')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterAmenity === 'pool' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              🏊 Piscine
            </button>
          </div>
        </div>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((property) => (
          <div
            key={property.id}
            className="glass-panel rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col justify-between group shadow-lg"
          >
            <div>
              {/* Image & Badges */}
              <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                <img
                  src={property.imageUrl}
                  alt={property.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-950/80 backdrop-blur-md text-white border border-slate-700 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    {property.city}
                  </span>
                  <span className="px-2 py-1 rounded-lg text-xs font-bold bg-slate-900/90 text-slate-300 border border-slate-700">
                    {property.type}
                  </span>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-md ${
                    property.status === 'available'
                      ? 'bg-emerald-500/90 text-white'
                      : 'bg-amber-500/90 text-slate-950'
                  }`}>
                    {property.status === 'available' ? 'Disponible' : 'Occupé'}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-lg">
                  <div className="text-sm font-mono font-black text-amber-300">
                    {formatFCFA(property.pricePerNight)}
                    <span className="text-[10px] text-slate-400 font-sans font-normal ml-1">/nuit</span>
                  </div>
                  <div className="text-[9px] text-slate-400 text-right">
                    TTA 0.2% incluse
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md px-2 py-1 rounded-lg border border-slate-700/80 flex items-center gap-1 text-xs font-semibold text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{property.rating}</span>
                  <span className="text-[10px] text-slate-400">({property.reviewsCount})</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
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

                {/* Capacity Chips */}
                <div className="flex items-center gap-4 text-xs text-slate-400 border-y border-slate-800/80 py-2.5">
                  <span>🛏️ {property.bedrooms} Chambres</span>
                  <span>🚿 {property.bathrooms} Salles de bain</span>
                  <span>👥 {property.capacity} Invités max</span>
                </div>

                {/* Triple Autonomy & Amenities Chips */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Équipements & Garanties Clés :
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {property.amenities.generator && (
                      <span className="px-2 py-1 rounded-lg text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-400" />
                        Groupe {property.amenities.generatorKva} kVA (Auto)
                      </span>
                    )}

                    {property.amenities.waterReserve && (
                      <span className="px-2 py-1 rounded-lg text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 font-medium flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-blue-400" />
                        Forage & Cuve {property.amenities.waterCapacityLiters}L
                      </span>
                    )}

                    {property.amenities.starlinkWifi && (
                      <span className="px-2 py-1 rounded-lg text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium flex items-center gap-1">
                        <Wifi className="w-3 h-3 text-purple-400" />
                        Starlink 250 Mbps
                      </span>
                    )}

                    {property.amenities.airConditioning && (
                      <span className="px-2 py-1 rounded-lg text-xs bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1">
                        <Wind className="w-3 h-3" /> Clim Inverter
                      </span>
                    )}

                    {property.amenities.security24h && (
                      <span className="px-2 py-1 rounded-lg text-xs bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" /> Gardien H24
                      </span>
                    )}

                    {property.amenities.airportShuttle && (
                      <span className="px-2 py-1 rounded-lg text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                        <Car className="w-3 h-3 text-emerald-400" /> Navette Aéroport VIP
                      </span>
                    )}

                    {property.amenities.pool && (
                      <span className="px-2 py-1 rounded-lg text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 flex items-center gap-1">
                        <Waves className="w-3 h-3 text-blue-400" /> Piscine Privée
                      </span>
                    )}

                    {property.amenities.seaView && (
                      <span className="px-2 py-1 rounded-lg text-xs bg-teal-500/10 text-teal-300 border border-teal-500/20 flex items-center gap-1">
                        🌊 Bord de Mer
                      </span>
                    )}
                  </div>
                </div>

                {/* Real-time Fuel & Water Status */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <div>
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="flex items-center gap-1">
                        <Fuel className="w-3 h-3 text-amber-400" /> Gasoil Groupe
                      </span>
                      <span className="font-mono font-bold text-white">{property.fuelLevelPercentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${property.fuelLevelPercentage < 50 ? 'bg-rose-500' : 'bg-amber-400'}`}
                        style={{ width: `${property.fuelLevelPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-blue-400" /> Réserve Forage
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
                <span>Tester Concierge IA</span>
              </button>

              <button
                onClick={() => onOpenUSSD(property)}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-md shadow-amber-950/40"
              >
                <Smartphone className="w-4 h-4 text-slate-950" />
                <span>Paiement MoMo / OM</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
