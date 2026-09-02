import React, { useState } from 'react';
import { 
  Fuel, 
  Droplets, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Send, 
  Wrench, 
  Sparkles, 
  Building, 
  DollarSign 
} from 'lucide-react';
import { Property, LogisticsTask, City } from '../types';
import { formatFCFA } from '../utils/formatters';

interface LogisticsViewProps {
  properties: Property[];
  tasks: LogisticsTask[];
  selectedCity: City;
  onAddTask: (newTask: Omit<LogisticsTask, 'id'>) => void;
  onUpdateTaskStatus: (taskId: string, status: 'pending' | 'in_progress' | 'completed') => void;
}

export const LogisticsView: React.FC<LogisticsViewProps> = ({
  properties,
  tasks,
  selectedCity,
  onAddTask,
  onUpdateTaskStatus,
}) => {
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPropId, setTaskPropId] = useState(properties[0]?.id || '');
  const [taskType, setTaskType] = useState<LogisticsTask['type']>('FUEL_REFILL');
  const [taskAssignee, setTaskAssignee] = useState('Jean-Luc (Régisseur Yaoundé)');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskUrgency, setTaskUrgency] = useState<LogisticsTask['urgency']>('high');
  const [taskCost, setTaskCost] = useState(30000);

  const filteredProperties = selectedCity === 'All'
    ? properties
    : properties.filter(p => p.city === selectedCity);

  const filteredTasks = selectedCity === 'All'
    ? tasks
    : tasks.filter(t => {
        const p = properties.find(prop => prop.id === t.propertyId);
        return p?.city === selectedCity;
      });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const prop = properties.find(p => p.id === taskPropId);
    onAddTask({
      propertyId: taskPropId,
      propertyName: prop?.name || 'Propriété AfriHost',
      type: taskType,
      title: taskTitle || 'Mission Logistique',
      description: taskDesc,
      assignedTo: taskAssignee,
      status: 'pending',
      urgency: taskUrgency,
      dueDate: 'Aujourd\'hui',
      estimatedCostFCFA: Number(taskCost),
    });
    setShowNewTaskModal(false);
    setTaskTitle('');
    setTaskDesc('');
  };

  const getUrgencyBadge = (urgency: LogisticsTask['urgency']) => {
    switch (urgency) {
      case 'critical':
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">Urgent</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Moyen</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">Normal</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Fuel className="w-5 h-5 text-amber-400" />
            Logistique Terrain : Groupes Électrogènes & Forages
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Surveillance en temps réel des cuves de gasoil (30kVA à 80kVA), entretien des filtres à eau et dispatching d'équipes.
          </p>
        </div>

        <button
          onClick={() => setShowNewTaskModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/50 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle Mission Terrain</span>
        </button>
      </div>

      {/* Fuel & Generator Gauge Monitor Cards */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          État des Réserves Énergétiques par Résidence
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProperties.map((prop) => {
            const isLowFuel = prop.fuelLevelPercentage < 50;
            return (
              <div
                key={prop.id}
                className={`glass-panel p-4 rounded-2xl border transition-all ${
                  isLowFuel ? 'border-rose-500/40 bg-rose-950/10' : 'border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-sm text-white">{prop.name}</h3>
                    <p className="text-xs text-slate-400">📍 {prop.neighborhood} ({prop.city})</p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    ⚡ {prop.amenities.generatorKva} kVA
                  </span>
                </div>

                {/* Fuel Gauge */}
                <div className="space-y-1.5 mb-3 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                      <Fuel className="w-3.5 h-3.5 text-amber-400" />
                      Gasoil Groupe (Autonomie ~{Math.round(prop.fuelLevelPercentage * 0.4)}h)
                    </span>
                    <span className={`font-mono font-bold ${isLowFuel ? 'text-rose-400' : 'text-amber-300'}`}>
                      {prop.fuelLevelPercentage}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isLowFuel ? 'bg-gradient-to-r from-rose-600 to-rose-400 animate-pulse' : 'bg-gradient-to-r from-amber-600 to-amber-400'
                      }`}
                      style={{ width: `${prop.fuelLevelPercentage}%` }}
                    ></div>
                  </div>
                  {isLowFuel && (
                    <div className="text-[11px] text-rose-400 flex items-center gap-1 mt-1 font-semibold">
                      <AlertTriangle className="w-3 h-3" />
                      Ravitaillement recommandé urgemment !
                    </div>
                  )}
                </div>

                {/* Water Gauge */}
                <div className="space-y-1.5 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                      <Droplets className="w-3.5 h-3.5 text-blue-400" />
                      Cuve Forage ({prop.amenities.waterCapacityLiters}L)
                    </span>
                    <span className="font-mono font-bold text-blue-300">
                      {prop.waterLevelPercentage}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                      style={{ width: `${prop.waterLevelPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Field Operations Tasks Table */}
      <div className="glass-panel p-5 rounded-2xl border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-emerald-400" />
              Missions Terrain & Interventions Planifiées
            </h3>
            <p className="text-xs text-slate-400">Suivi des régisseurs et prestataires techniques</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 pr-4">Mission</th>
                <th className="pb-3 px-4">Propriété</th>
                <th className="pb-3 px-4">Responsable</th>
                <th className="pb-3 px-4">Urgence</th>
                <th className="pb-3 px-4">Échéance</th>
                <th className="pb-3 px-4 text-right">Coût Est.</th>
                <th className="pb-3 pl-4 text-center">Action / Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 pr-4">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      {task.type === 'FUEL_REFILL' && '⛽'}
                      {task.type === 'CLEANING' && '🧹'}
                      {task.type === 'WATER_CHECK' && '💧'}
                      {task.type === 'STARLINK_CHECK' && '🛰️'}
                      {task.title}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 max-w-xs">{task.description}</div>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-slate-200">
                    {task.propertyName}
                  </td>

                  <td className="py-3.5 px-4 text-slate-300">
                    {task.assignedTo}
                  </td>

                  <td className="py-3.5 px-4">
                    {getUrgencyBadge(task.urgency)}
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                    {task.dueDate}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-300">
                    {task.estimatedCostFCFA ? formatFCFA(task.estimatedCostFCFA) : '—'}
                  </td>

                  <td className="py-3.5 pl-4 text-center">
                    {task.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                        <CheckCircle2 className="w-4 h-4" /> Effectué
                      </span>
                    ) : (
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onUpdateTaskStatus(task.id, 'completed')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-colors"
                        >
                          Valider
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-emerald-400" />
              Créer une Mission Logistique
            </h3>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Titre de la mission</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ravitaillement Gasoil 50L Groupe"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Résidence concernée</label>
                <select
                  value={taskPropId}
                  onChange={(e) => setTaskPropId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.city})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Type d'intervention</label>
                  <select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value as LogisticsTask['type'])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="FUEL_REFILL">⛽ Carburant Groupe</option>
                    <option value="CLEANING">🧹 Ménage & Blanchisserie</option>
                    <option value="WATER_CHECK">💧 Pompe & Forage</option>
                    <option value="STARLINK_CHECK">🛰️ Starlink & Wi-Fi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Urgence</label>
                  <select
                    value={taskUrgency}
                    onChange={(e) => setTaskUrgency(e.target.value as LogisticsTask['urgency'])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="critical">Critique (Immédiat)</option>
                    <option value="high">Haute</option>
                    <option value="medium">Moyenne</option>
                    <option value="low">Basse</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Responsable assigné</label>
                <input
                  type="text"
                  value={taskAssignee}
                  onChange={(e) => setTaskAssignee(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Coût Estimé (FCFA)</label>
                <input
                  type="number"
                  value={taskCost}
                  onChange={(e) => setTaskCost(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Créer & Assigner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
