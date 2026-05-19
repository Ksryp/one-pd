import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STAGES = [
  {
    id: 'prep-body',
    title: '1.1 Preparation - Body Slip',
    fields: [
      { id: 'moisture', label: '% Moisture Raw Material', placeholder: '24.5', unit: '%' },
      { id: 'concentration', label: 'Concentration', placeholder: '1.65', unit: 'g/cm³' },
      { id: 'v0', label: 'V0', placeholder: '120', unit: 'mL' },
      { id: 'v30', label: 'V30', placeholder: '135', unit: 'mL' },
      { id: 'rust', label: 'Rust Screening', placeholder: 'Pass', unit: '' },
      { id: 'temp', label: 'Temperature', placeholder: '28', unit: '°C' },
      { id: 'casting_rate', label: 'Casting Rate', placeholder: '4.5', unit: 'mm/min' },
      { id: 'viscosity', label: 'Viscosity', placeholder: '320', unit: 'Poise' },
      { id: 'thixo', label: 'Thixotrophy', placeholder: '15', unit: 'Poise' },
    ]
  },
  {
    id: 'prep-glaze',
    title: '1.2 Preparation - Glaze Slip',
    fields: [
      { id: 'glaze_conc', label: 'Concentration', placeholder: '1.80', unit: 'g/cm³' },
      { id: 'particle', label: '% Particle Size Distribution', placeholder: '1.2', unit: '%' },
      { id: 'glaze_v0', label: 'V0', placeholder: '115', unit: 'mL' },
      { id: 'glaze_v30', label: 'V30', placeholder: '125', unit: 'mL' },
      { id: 'glaze_rust', label: 'Rust Screening', placeholder: 'Pass', unit: '' },
      { id: 'thickness', label: 'Color Thickness', placeholder: '0.8', unit: 'mm' },
      { id: 'surface', label: 'Color & Surface Testing', placeholder: 'OK', unit: '' },
      { id: 'residue', label: '% Residue', placeholder: '0.05', unit: '%' },
    ]
  },
  {
    id: 'casting',
    title: '2. Casting',
    fields: [
      { id: 'cast_date', label: 'Casting Date', placeholder: 'DD/MM/YYYY', unit: '' },
      { id: 'caster_no', label: 'Caster NO.', placeholder: 'C-042', unit: '' },
      { id: 'mold_no', label: 'Mold NO.', placeholder: 'M-105', unit: '' },
      { id: 'mold_cycle', label: 'Mold Cycle', placeholder: '45', unit: 'cycles' },
    ]
  },
  {
    id: 'drying',
    title: '3. Drying',
    fields: [
      { id: 'drying_curve', label: 'Drying Curve', placeholder: 'Standard A', unit: '' },
      { id: 'moisture_content', label: '% Moisture Content', placeholder: '1.5', unit: '%' },
      { id: 'energy', label: 'Energy Consumption', placeholder: '1250', unit: 'kWh' },
    ]
  },
  {
    id: 'clay_insp',
    title: '4. Clay Inspection',
    fields: [
      { id: 'clay_yield', label: '% Yield', placeholder: '98.5', unit: '%' },
    ]
  },
  {
    id: 'spraying',
    title: '5. Spraying',
    fields: [
      { id: 'spray_shift', label: 'Spray Shift/Date', placeholder: 'Shift A - 19/05', unit: '' },
      { id: 'spray_thick', label: 'Thickness', placeholder: '0.85', unit: 'mm' },
      { id: 'sprayer_no', label: 'Sprayer NO.', placeholder: 'S-012', unit: '' },
      { id: 'robot_no', label: 'Robot NO.', placeholder: 'R-03', unit: '' },
    ]
  },
  {
    id: 'firing',
    title: '6. Firing',
    fields: [
      { id: 'fire_temp', label: 'Temperature', placeholder: '1200', unit: '°C' },
      { id: 'fire_cycle', label: 'Firing Cycle', placeholder: '12', unit: 'hrs' },
      { id: 'weight', label: 'Weight', placeholder: '18.5', unit: 'kg' },
      { id: 'smart_meter', label: 'Smart Meter', placeholder: '450', unit: 'kWh' },
    ]
  },
  {
    id: 'glost_insp',
    title: '7. Glost Inspection',
    fields: [
      { id: 'glost_yield', label: '% Yield', placeholder: '95.2', unit: '%' },
    ]
  }
]

export default function ManualKeyIn() {
  const navigate = useNavigate()
  const [activeStage, setActiveStage] = useState(STAGES[0].id)

  const currentStage = STAGES.find(s => s.id === activeStage)

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-full bg-[var(--bg-page)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-fluid-2xl font-black text-[var(--text-primary)] mb-2">Manual Data Entry</h1>
          <p className="text-fluid-sm text-[var(--text-secondary)]">Please input production parameters carefully.</p>
        </div>
        <button className="px-5 py-2.5 bg-[var(--accent)] hover:bg-[#155fc2] text-white font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          Save All Data
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Sidebar Nav for Stages */}
        <div className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-1">
          {STAGES.map((stage) => (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              className={`text-left px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 border ${
                activeStage === stage.id
                  ? 'bg-[var(--accent)] text-white border-transparent shadow-md'
                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--text-primary)]'
              }`}
            >
              {stage.title}
            </button>
          ))}
        </div>

        {/* Input Form Area */}
        <div className="flex-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-[var(--border)] bg-opacity-50">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">{currentStage.title}</h2>
          </div>
          
          <div className="p-5 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentStage.fields.map((field) => (
                <div key={field.id} className="flex flex-col gap-1.5">
                  <label htmlFor={field.id} className="text-[13px] font-bold text-[var(--text-primary)]">
                    {field.label}
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id={field.id}
                      type="text"
                      placeholder={`e.g. ${field.placeholder}`}
                      className="w-full bg-[var(--bg-page)] border border-[var(--border)] text-[var(--text-primary)] text-[15px] font-semibold tabular-nums rounded-lg pl-3 pr-12 py-2.5 outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
                    />
                    {field.unit && (
                      <span className="absolute right-3 text-[12px] font-bold text-[var(--text-secondary)] select-none pointer-events-none">
                        {field.unit}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
