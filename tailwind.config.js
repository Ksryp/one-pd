/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        accent: 'var(--accent)',
      },
      // ── Fluid Typography Scale ──────────────────────────────
      // clamp(min, preferred, max)
      // preferred ≈ vw ที่ทำให้ได้ค่าที่ต้องการที่ 1440px
      // e.g. 13px ÷ 14.4px/vw = 0.903vw ≈ 0.9vw
      fontSize: {
        // Label / caption — ขนาดเล็กมาก (fixed, ไม่ scale)
        'label-xs': ['10px',  { lineHeight: '1.4' }],
        'label-sm': ['11px',  { lineHeight: '1.4' }],
        'label':    ['12px',  { lineHeight: '1.4' }],

        // Body / subtitle — scale เล็กน้อย
        'fluid-xs':   ['clamp(10px, 0.78vw, 11px)',  { lineHeight: '1.4' }],  // 10→11px
        'fluid-sm':   ['clamp(11px, 0.9vw, 13px)',   { lineHeight: '1.4' }],  // 11→13px
        'fluid-base': ['clamp(12px, 0.97vw, 14px)',  { lineHeight: '1.5' }],  // 12→14px

        // Section heading / card subtitle
        'fluid-md':   ['clamp(13px, 1.04vw, 15px)',  { lineHeight: '1.4' }],  // 13→15px
        'fluid-lg':   ['clamp(14px, 1.18vw, 17px)',  { lineHeight: '1.3' }],  // 14→17px

        // Card values / small numbers
        'fluid-xl':   ['clamp(16px, 1.39vw, 20px)',  { lineHeight: '1.2' }],  // 16→20px
        'fluid-2xl':  ['clamp(18px, 1.67vw, 24px)',  { lineHeight: '1.15' }], // 18→24px

        // KPI numbers (Takt, MTTR)
        'fluid-3xl':  ['clamp(22px, 2.22vw, 32px)',  { lineHeight: '1.05' }], // 22→32px

        // Big KPI numbers (WIP, OEE center)
        'fluid-4xl':  ['clamp(25px, 2.64vw, 38px)',  { lineHeight: '1.0' }],  // 25→38px

        // Page heading / Slip Yield %
        'fluid-5xl':  ['clamp(20px, 2.22vw, 32px)',  { lineHeight: '1.0' }],  // 20→32px
      },
    },
  },
  plugins: [],
}
