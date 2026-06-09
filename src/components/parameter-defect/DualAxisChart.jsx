import React from 'react'
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine, ResponsiveContainer,
} from 'recharts'
import { useDashboard } from '../../context/DashboardContext'
import { useParameterDefect } from '../../hooks/useParameterDefect'

const PARAM_COLOR = {
  viscosity_v0:  '#4F8EE8',
  viscosity_v30: '#7C5CBF',
  temperature:   '#F59E0B',
  concentration: '#10B981',
  casting_rate:  '#EF4444',
  yield_value:   '#06B6D4',
  thixo:         '#F97316',
}
const PARAM_LABEL = {
  viscosity_v0:  'Viscosity V0',
  viscosity_v30: 'Viscosity V30',
  temperature:   'Temperature',
  concentration: 'Concentration',
  casting_rate:  'Casting Rate',
  yield_value:   'Yield',
  thixo:         'Thixotropy',
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
          <span className="font-bold tabular-nums text-[var(--text-primary)]">
            {entry.value != null ? entry.value.toLocaleString() : '—'}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function DualAxisChart() {
  const { selectedParameter } = useDashboard()
  const { chartData, ucl, lcl, loading } = useParameterDefect()

  if (loading && chartData.length === 0) {
    return (
      <div className="h-[280px] w-full flex items-center justify-center">
        <span className="text-[12px] text-[var(--text-secondary)] animate-pulse">Loading chart data…</span>
      </div>
    )
  }

  if (!loading && chartData.length === 0) {
    return (
      <div className="h-[280px] w-full flex items-center justify-center">
        <span className="text-[12px] text-[var(--text-secondary)]">No data for selected range</span>
      </div>
    )
  }

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: 'var(--text-secondary)', fontFamily: 'Inter' }}
            tickLine={false}
            axisLine={{ stroke: 'var(--border)' }}
            interval="preserveStartEnd"
          />
          <YAxis
            yAxisId="param"
            orientation="left"
            tick={{ fontSize: 10, fill: 'var(--text-secondary)', fontFamily: 'Inter' }}
            tickLine={false} axisLine={false} width={40}
          />
          <YAxis
            yAxisId="defect"
            orientation="right"
            tick={{ fontSize: 10, fill: 'var(--text-secondary)', fontFamily: 'Inter' }}
            tickLine={false} axisLine={false} width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} iconType="circle"
            wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />

          {/* UCL/LCL only when exactly 1 parameter is selected */}
          {(selectedParameter || []).length === 1 && (() => {
            const pk = selectedParameter[0]
            return ucl[pk] != null ? (
              <React.Fragment>
                <ReferenceLine yAxisId="param" y={ucl[pk]} stroke="#DC2626" strokeDasharray="4 4" strokeWidth={1.5}
                  label={{ value: 'UCL', position: 'right', fontSize: 9, fill: '#DC2626' }} />
                {lcl[pk] != null && (
                  <ReferenceLine yAxisId="param" y={lcl[pk]} stroke="#D97706" strokeDasharray="4 4" strokeWidth={1.5}
                    label={{ value: 'LCL', position: 'right', fontSize: 9, fill: '#D97706' }} />
                )}
              </React.Fragment>
            ) : null
          })()}

          {/* Defect bar (right Y-axis) */}
          <Bar yAxisId="defect" dataKey="defect" name="Defect Count"
            fill="#FCA5A5" opacity={0.75} radius={[2, 2, 0, 0]} />

          {/* Parameter lines (left Y-axis) */}
          {(selectedParameter || []).map(pk => (
            <Line
              key={pk}
              yAxisId="param"
              type="monotone"
              dataKey={pk}
              name={PARAM_LABEL[pk] ?? pk}
              stroke={PARAM_COLOR[pk] ?? '#4F8EE8'}
              strokeWidth={2}
              dot={false}
              connectNulls={true}
              activeDot={{ r: 5, fill: PARAM_COLOR[pk] ?? '#4F8EE8' }}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
