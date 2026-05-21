const FORMS = [
  {
    id: 'body-slip',
    title: 'Body Slip Parameter',
    subtitle: 'SNK — Slip Preparation',
    description: 'บันทึกค่าพารามิเตอร์ Body Slip ประจำวัน เช่น Viscosity, Concentration, Casting Rate และ Temperature',
    url: 'https://teams.microsoft.com/l/message/48:notes/1779310942343?context=%7B%22contextType%22%3A%22chat%22%2C%22oid%22%3A%228%3Aorgid%3A744e8bef-91d0-4710-80f4-c1825b9a8e26%22%7D',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <line x1="10" y1="9" x2="8" y2="9"/>
      </svg>
    ),
    color: '#1E6FCC',
    bgLight: '#EFF6FF',
    tag: 'Microsoft Teams',
  },
  {
    id: 'glaze-slip',
    title: 'Glaze Slip Data',
    subtitle: 'SNK — Glaze Preparation',
    description: 'บันทึกข้อมูล Glaze Slip ประจำวัน เช่น Concentration, Particle Size, Thickness และ Residue',
    url: 'https://forms.office.com/r/CRaB7JDX3x',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        <line x1="13" y1="15" x2="17" y2="15"/>
        <line x1="13" y1="19" x2="17" y2="19"/>
        <line x1="13" y1="12" x2="13.01" y2="12"/>
      </svg>
    ),
    color: '#7C3AED',
    bgLight: '#F5F3FF',
    tag: 'Microsoft Forms',
  },
]

export default function ManualKeyIn() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-full bg-[var(--bg-page)] flex flex-col">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-fluid-2xl font-black text-[var(--text-primary)] mb-2">Manual Key-In</h1>
        <p className="text-fluid-sm text-[var(--text-secondary)]">
          เลือกหัวข้อที่ต้องการกรอกข้อมูล — ระบบจะเปิด Microsoft Forms สำหรับบันทึก
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
        {FORMS.map((form) => (
          <a
            key={form.id}
            href={form.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-sm
                       hover:shadow-md hover:border-[var(--accent)] transition-all duration-200
                       cursor-pointer flex flex-col overflow-hidden no-underline"
          >
            {/* Card Top Bar */}
            <div
              className="h-1.5 w-full"
              style={{ backgroundColor: form.color }}
            />

            <div className="p-6 flex flex-col gap-4 flex-1">
              {/* Icon + Tag row */}
              <div className="flex items-start justify-between">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                  style={{ backgroundColor: form.bgLight, color: form.color }}
                >
                  {form.icon}
                </div>
                <span
                  className="text-[11px] font-bold px-2.5 py-1 rounded-full border"
                  style={{
                    color: form.color,
                    backgroundColor: form.bgLight,
                    borderColor: form.color + '33',
                  }}
                >
                  {form.tag}
                </span>
              </div>

              {/* Text */}
              <div>
                <h2 className="text-[17px] font-black text-[var(--text-primary)] mb-0.5 group-hover:text-[var(--accent)] transition-colors">
                  {form.title}
                </h2>
                <p className="text-[12px] font-semibold text-[var(--text-secondary)] mb-3">
                  {form.subtitle}
                </p>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  {form.description}
                </p>
              </div>

              {/* CTA */}
              <div className="mt-auto pt-2 flex items-center gap-1.5 text-[13px] font-bold" style={{ color: form.color }}>
                <span>เปิดแบบฟอร์ม</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  className="transform group-hover:translate-x-1 transition-transform duration-200">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
