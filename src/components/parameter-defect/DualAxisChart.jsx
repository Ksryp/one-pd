import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine, ResponsiveContainer,
} from 'recharts'
import { useDashboard } from '../../context/DashboardContext'
import { parameterDefect } from '../../data/mock'

const PARAM_COLORS = {
  viscosity_v0:  '#4F8EE8',
  viscosity_v30: '#7C5CBF',
  temperature:   '#F59E0B',
  moisture:      '#10B981',
}

const PARAM_KEYS = {
  viscosity_v0:  'viscosity',
  viscosity_v30: 'viscosity',
  temperature:   'temperature',
  moisture:      'moisture',
}


const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3 shadow-2xl text-xs space-y-1">
      <p className="font-bold text-[var(--text-primary)] mb-2">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-[var(--text-secondary)]">{entry.name}</span>
          </span>
          <span className="font-bold tabular-nums text-[var(--text-primary)]">{entry.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

export default function DualAxisChart() {
  const { selectedParameter } = useDashboard()
  const { timeseries, ucl, lcl } = parameterDefect

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={timeseries} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
          <XAxis
            dataKey="hour"
            tick={{ fontSize: 10, fill: 'var(--text-secondary)', fontFamily: 'Inter' }}
            tickLine={false}
            axisLine={{ stroke: 'var(--border)' }}
          />
          <YAxis
            yAxisId="param"
            orientation="left"
            tick={{ fontSize: 10, fill: 'var(--text-secondary)', fontFamily: 'Inter' }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <YAxis
            yAxisId="defect"
            orientation="right"
            tick={{ fontSize: 10, fill: 'var(--text-secondary)', fontFamily: 'Inter' }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />

          {/* UCL/LCL for first selected param */}
          {selectedParameter.includes('viscosity_v0') && (
            <>
              <ReferenceLine yAxisId="param" y={ucl.viscosity} stroke="#DC2626" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: 'UCL', position: 'right', fontSize: 9, fill: '#DC2626' }} />
              <ReferenceLine yAxisId="param" y={lcl.viscosity} stroke="#D97706" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: 'LCL', position: 'right', fontSize: 9, fill: '#D97706' }} />
            </>
          )}

          {/* Defect Bar */}
          <Bar
            yAxisId="defect"
            dataKey="defect"
            name="Defect Count"
            fill="#FCA5A5"
            opacity={0.7}
            radius={[2, 2, 0, 0]}
          />

          {/* Parameter Lines */}
          {selectedParameter.map(pk => {
            const dataKey = PARAM_KEYS[pk] || pk
            const color = PARAM_COLORS[pk] || '#4F8EE8'
            return (
              <Line
                key={pk}
                yAxisId="param"
                type="monotone"
                dataKey={dataKey}
                name={pk.replace('_', ' ').toUpperCase()}
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5, fill: color }}
              />
            )
          })}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
