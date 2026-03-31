'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface SkillsWorkspaceSectionProps {
  skills: Record<string, string[]>;
}

type FileId = 'frontend' | 'backend' | 'ai' | 'cloud' | 'data';

type FileConfig = {
  id: FileId;
  name: string;
  tabLabel: string;
  path: string;
  sourceKey: string;
  summary: string;
  role: string;
  accent: '#00E5FF' | '#7B61FF';
  language: 'tsx' | 'ts' | 'py' | 'yml';
};

type FileWithTechnologies = FileConfig & {
  technologies: string[];
};

const FILES: FileConfig[] = [
  {
    id: 'frontend',
    name: 'frontend.systems.tsx',
    tabLabel: 'Frontend',
    path: 'src/ui/frontend.systems.tsx',
    sourceKey: 'Frontend Systems',
    summary: 'Interface engineering focused on speed, clarity, and maintainability.',
    role: 'Owns rendering architecture, UX motion quality, and component ergonomics.',
    accent: '#00E5FF',
    language: 'tsx',
  },
  {
    id: 'backend',
    name: 'backend.api.ts',
    tabLabel: 'Backend',
    path: 'src/server/backend.api.ts',
    sourceKey: 'Backend & APIs',
    summary: 'Service contracts and orchestration for resilient product workflows.',
    role: 'Owns domain logic, endpoint reliability, and integration boundaries.',
    accent: '#7B61FF',
    language: 'ts',
  },
  {
    id: 'ai',
    name: 'ai.pipeline.py',
    tabLabel: 'AI',
    path: 'src/ai/ai.pipeline.py',
    sourceKey: 'AI Engineering',
    summary: 'Practical intelligence systems for retrieval and inference behavior.',
    role: 'Owns prompt strategy, model interfaces, and output consistency.',
    accent: '#00E5FF',
    language: 'py',
  },
  {
    id: 'cloud',
    name: 'cloud.delivery.yml',
    tabLabel: 'Cloud',
    path: 'ops/cloud.delivery.yml',
    sourceKey: 'Cloud & Delivery',
    summary: 'Release pipelines and runtime discipline for predictable deployments.',
    role: 'Owns CI/CD quality gates, deployment reliability, and operations flow.',
    accent: '#7B61FF',
    language: 'yml',
  },
  {
    id: 'data',
    name: 'data.storage.ts',
    tabLabel: 'Data',
    path: 'src/data/data.storage.ts',
    sourceKey: 'Data & Storage',
    summary: 'Structured persistence decisions for product correctness and scale.',
    role: 'Owns schema consistency, access patterns, and storage tradeoffs.',
    accent: '#00E5FF',
    language: 'ts',
  },
];

const easeSmooth: [number, number, number, number] = [0.22, 1, 0.36, 1];

function buildCodeLines(file: FileConfig, technologies: string[]) {
  const list = technologies.length ? technologies : ['System foundations', 'Execution strategy', 'Production delivery'];

  if (file.language === 'py') {
    return [
      `# ${file.summary}`,
      `${file.id}_stack = {`,
      `    'path': '${file.path}',`,
      `    'language': '${file.language}',`,
      "    'technologies': [",
      ...list.map((item) => `        '${item}',`),
      '    ],',
      `    'role': '${file.role}',`,
      "    'quality_gate': 'production-ready',",
      '}',
    ];
  }

  if (file.language === 'yml') {
    return [
      `# ${file.summary}`,
      `${file.id}_stack:`,
      `  path: "${file.path}"`,
      `  language: ${file.language}`,
      '  technologies:',
      ...list.map((item) => `    - ${item}`),
      `  role: "${file.role}"`,
      '  quality_gate: production-ready',
    ];
  }

  return [
    `// ${file.summary}`,
    `export const ${file.id}Stack = {`,
    `  path: '${file.path}',`,
    `  language: '${file.language}',`,
    '  technologies: [',
    ...list.map((item) => `    '${item}',`),
    '  ],',
    `  role: '${file.role}',`,
    "  qualityGate: 'production-ready',",
    '};',
  ];
}

function SkillsTabs({
  files,
  activeFileId,
  onActivate,
}: {
  files: FileWithTechnologies[];
  activeFileId: FileId;
  onActivate: (fileId: FileId) => void;
}) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-white/10 px-2 py-2 sm:px-3">
      {files.map((file) => {
        const isActive = file.id === activeFileId;

        return (
          <button
            key={file.id}
            type="button"
            onMouseEnter={() => onActivate(file.id)}
            onFocus={() => onActivate(file.id)}
            onClick={() => onActivate(file.id)}
            className="group flex shrink-0 items-center gap-2 rounded-md border px-3 py-2 text-left transition-colors duration-200"
            style={{
              borderColor: isActive ? `${file.accent}80` : 'rgba(255,255,255,0.12)',
              background: isActive ? 'rgba(15, 23, 42, 0.9)' : 'rgba(2, 6, 23, 0.55)',
            }}
            aria-pressed={isActive}
          >
            <span
              aria-hidden="true"
              className="rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase leading-none tracking-[0.08em]"
              style={{
                color: isActive ? '#E6EDF3' : 'rgba(230, 237, 243, 0.74)',
                borderColor: isActive ? `${file.accent}88` : 'rgba(255,255,255,0.18)',
                background: isActive ? `${file.accent}22` : 'rgba(15, 23, 42, 0.68)',
              }}
            >
              {file.language}
            </span>
            <span className="text-[11px] font-medium sm:text-xs" style={{ color: isActive ? '#E6EDF3' : 'rgba(230, 237, 243, 0.72)' }}>
              {file.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function SkillsCodePanel({ activeFile }: { activeFile: FileWithTechnologies }) {
  const lines = buildCodeLines(activeFile, activeFile.technologies);

  return (
    <div className="relative border-b border-white/10 bg-[#020617]/70 p-4 sm:p-5 lg:border-b-0 lg:border-r">
      <div className="mb-3 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.14em]" style={{ color: 'rgba(230, 237, 243, 0.58)' }}>
        <span className="min-w-0 flex-1 truncate">{activeFile.path}</span>
        <span>{activeFile.language}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeFile.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: easeSmooth }}
          className="font-mono text-[11px] leading-6 sm:text-xs"
        >
          {lines.map((line, index) => (
            <div key={`${activeFile.id}-line-${index}`} className="grid grid-cols-[26px_minmax(0,1fr)] gap-3">
              <span className="select-none text-right" style={{ color: 'rgba(230, 237, 243, 0.32)' }}>
                {index + 1}
              </span>
              <span className="wrap-break-word whitespace-pre-wrap" style={{ color: index === 0 ? activeFile.accent : '#C9D3DE' }}>
                {line}
              </span>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SkillsMetaPanel({ activeFile }: { activeFile: FileWithTechnologies }) {
  const technologies = activeFile.technologies.length ? activeFile.technologies : ['Core delivery', 'System ownership', 'Platform quality'];

  return (
    <aside className="bg-slate-950/80 p-4 sm:p-5">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeFile.id}-meta`}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.25, ease: easeSmooth }}
        >
          <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: activeFile.accent }}>
            Active Module
          </p>
          <h3 className="mt-2 text-xl font-semibold" style={{ color: '#E6EDF3' }}>
            {activeFile.name}
          </h3>
          <p className="mt-3 text-sm" style={{ color: 'rgba(230, 237, 243, 0.8)' }}>
            {activeFile.summary}
          </p>

          <div className="mt-4 rounded-xl border border-white/10 bg-black/25 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'rgba(230, 237, 243, 0.6)' }}>
              System Role
            </p>
            <p className="mt-2 text-sm" style={{ color: '#C9D3DE' }}>
              {activeFile.role}
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-black/25 p-3">
            <p className="text-[10px] uppercase tracking-[0.14em]" style={{ color: 'rgba(230, 237, 243, 0.6)' }}>
              Technologies
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <span
                  key={`${activeFile.id}-${tech}`}
                  className="rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.08em]"
                  style={{
                    borderColor: `${activeFile.accent}66`,
                    color: activeFile.accent,
                    background: 'rgba(2, 6, 23, 0.65)',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </aside>
  );
}

export default function SkillsWorkspaceSection({ skills }: SkillsWorkspaceSectionProps) {
  const [selectedFileId, setSelectedFileId] = useState<FileId>('frontend');

  const files = useMemo(
    () =>
      FILES.map((file) => ({
        ...file,
        technologies: skills[file.sourceKey] ?? [],
      })),
    [skills]
  );

  const activeFileId = selectedFileId;
  const activeFile = files.find((file) => file.id === activeFileId) ?? files[0];

  return (
    <section id="skills" className="relative w-full px-4 py-16 sm:py-20">
      <div className="container relative z-10">
        <div className="mb-8 max-w-3xl sm:mb-10">
          <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: '#00E5FF' }}>
            Skills Workspace
          </p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl" style={{ color: '#E6EDF3' }}>
            IDE Architecture View
          </h2>
          <p className="mt-3 text-sm sm:text-base" style={{ color: 'rgba(230, 237, 243, 0.78)' }}>
            A code-editor style technical map where each file represents a core capability. Hover or click any file tab to switch modules and inspect the stack like a live workspace.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-cyan-400/20 bg-slate-950/75 shadow-[0_0_0_1px_rgba(0,229,255,0.12)] backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 sm:px-5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: 'rgba(230, 237, 243, 0.64)' }}>
              adityan-skills.workspace
            </p>
          </div>

          <SkillsTabs
            files={files}
            activeFileId={activeFileId}
            onActivate={setSelectedFileId}
          />

          <div className="grid lg:grid-cols-[minmax(0,1fr)_320px]">
            <SkillsCodePanel activeFile={activeFile} />
            <SkillsMetaPanel activeFile={activeFile} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-2 sm:px-5">
            <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: 'rgba(230, 237, 243, 0.54)' }}>
              Hover or click tabs to switch active file
            </p>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em]" style={{ color: 'rgba(230, 237, 243, 0.62)' }}>
              <span className="h-2 w-2 rounded-full" style={{ background: activeFile.accent }} />
              <span>{activeFile.language}</span>
              <span>•</span>
              <span>{activeFile.technologies.length || 3} symbols</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
