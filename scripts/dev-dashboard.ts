#!/usr/bin/env node

import { spawn, ChildProcess } from 'child_process';
import { createInterface, Interface } from 'readline';

const APPS = [
  { name: 'landing', label: 'Landing', color: '\x1b[36m', icon: '🌐', port: 3000, cwd: 'apps/landing' },
  { name: 'admin',   label: 'Admin',   color: '\x1b[35m', icon: '⚙️',  port: 3001, cwd: 'apps/admin' },
  { name: 'api',     label: 'API',     color: '\x1b[33m', icon: '🔗', port: 4000, cwd: 'apps/api' },
];

const RESET  = '\x1b[0m';
const BOLD   = '\x1b[1m';
const DIM    = '\x1b[2m';
const RED    = '\x1b[31m';
const GREEN  = '\x1b[32m';
const WHITE  = '\x1b[37m';
const BG_DARK = '\x1b[48;5;236m';
const BG_HEADER = '\x1b[48;5;22m';

type AppState = { process: ChildProcess | null; status: 'starting' | 'running' | 'stopped' | 'error'; lines: string[]; errors: string[]; startTime: number };

const states: Record<string, AppState> = {};

function clearScreen() {
  process.stdout.write('\x1b[2J\x1b[H');
}

function drawBox(title: string, width: number): string {
  const pad = width - title.length - 4;
  return `┌${'─'.repeat(2)} ${title} ${'─'.repeat(Math.max(0, pad))}┐`;
}

function drawLine(width: number): string {
  return `├${'─'.repeat(width - 2)}┤`;
}

function drawBottom(width: number): string {
  return `└${'─'.repeat(width - 2)}┘`;
}

function statusIcon(status: AppState['status']): string {
  switch (status) {
    case 'running': return `${GREEN}●${RESET}`;
    case 'starting': return `${'\x1b[33m'}◌${RESET}`;
    case 'error': return `${RED}✖${RESET}`;
    case 'stopped': return `${DIM}○${RESET}`;
  }
}

function drawDashboard(filter: string | null) {
  const width = process.stdout.columns || 100;
  const leftWidth = Math.min(35, Math.floor(width * 0.28));
  const rightWidth = width - leftWidth - 3;

  clearScreen();

  // Header
  console.log(`${BG_HEADER}${BOLD}${WHITE} 🚀 Digital Sheba — Dev Dashboard ${RESET}`);
  console.log(`${DIM}  bun run dev | All apps running simultaneously${RESET}`);
  console.log('');

  // Left panel — App status
  console.log(`${BOLD}${BG_DARK} 📋 APPS${RESET}`);
  console.log(`${DIM}  ─────────────────────────────────${RESET}`);

  for (const app of APPS) {
    const state = states[app.name];
    const icon = statusIcon(state?.status || 'stopped');
    const uptime = state?.startTime ? formatUptime(Date.now() - state.startTime) : '';
    const sel = filter === app.name ? `${BOLD}${'▸'}${RESET} ` : '  ';
    const label = filter === app.name ? `${BOLD}${app.color}${app.label}${RESET}` : `${app.color}${app.label}${RESET}`;
    const port = `${DIM}:${app.port}${RESET}`;
    const status = state?.status === 'running' ? `${GREEN}running${RESET}`
      : state?.status === 'starting' ? `${'\x1b[33m'}starting${RESET}`
      : state?.status === 'error' ? `${RED}error${RESET}`
      : `${DIM}stopped${RESET}`;
    const errCount = state?.errors.length ? ` ${RED}(${state.errors.length} errors)${RESET}` : '';

    console.log(`${sel}${app.icon} ${label} ${port}  ${status}${errCount} ${DIM}${uptime}${RESET}`);
  }

  console.log('');
  console.log(`${DIM}  Commands: ${BOLD}1${RESET}${DIM}=landing ${BOLD}2${RESET}${DIM}=admin ${BOLD}3${RESET}${DIM}=api ${BOLD}a${RESET}${DIM}=all ${BOLD}e${RESET}${DIM}=errors only ${BOLD}q${RESET}${DIM}=quit${RESET}`);
  console.log(`${DIM}  ─────────────────────────────────${RESET}`);

  // Right panel — Logs
  const logTitle = filter ? `LOGS — ${filter.toUpperCase()}` : 'LOGS — ALL APPS';
  console.log(`${BOLD}${BG_DARK} 📜 ${logTitle}${RESET}`);
  console.log(`${DIM}  ${'─'.repeat(Math.min(60, rightWidth))}${RESET}`);

  // Collect logs from all apps (or filtered)
  const allLogs: { app: string; color: string; line: string; time: number }[] = [];

  for (const app of APPS) {
    if (filter && filter !== app.name) continue;
    const state = states[app.name];
    if (!state) continue;
    const logs = filter === 'errors' ? state.errors : state.lines;
    for (const line of logs) {
      allLogs.push({ app: app.name, color: app.color, line, time: 0 });
    }
  }

  // Show last N lines
  const maxLines = Math.max(10, (process.stdout.rows || 24) - 16);
  const recent = allLogs.slice(-maxLines);

  if (recent.length === 0) {
    console.log(`${DIM}  Waiting for logs...${RESET}`);
  } else {
    for (const log of recent) {
      const prefix = `${log.color}[${log.app}]${RESET}`;
      // Truncate long lines
      const maxLen = (process.stdout.columns || 100) - 12;
      const truncated = log.line.length > maxLen ? log.line.slice(0, maxLen) + '...' : log.line;
      console.log(`  ${prefix} ${truncated}`);
    }
  }

  // Error summary
  const totalErrors = APPS.reduce((sum, app) => sum + (states[app.name]?.errors.length || 0), 0);
  if (totalErrors > 0) {
    console.log('');
    console.log(`${RED}${BOLD}  ⚠  ${totalErrors} error(s) found — press 'e' to view errors only${RESET}`);
  }
}

function formatUptime(ms: number): string {
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${s % 60}s`;
}

function startApp(app: typeof APPS[0]) {
  const proc = spawn('bun', ['run', 'dev'], {
    cwd: app.cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, FORCE_COLOR: '1' },
    shell: true,
  });

  states[app.name] = { process: proc, status: 'starting', lines: [], errors: [], startTime: Date.now() };

  const handleLine = (stream: 'stdout' | 'stderr') => (data: Buffer) => {
    const text = data.toString().replace(/\r?\n$/, '');
    if (!text) return;

    const state = states[app.name];
    const isReady = text.includes('Ready') || text.includes('ready')
      || text.includes('started') || text.includes('listening')
      || text.includes('compiled') || text.includes('port')
      || text.includes('API running') || text.includes('listening on');

    if (isReady && state.status === 'starting') {
      state.status = 'running';
    }

    if (stream === 'stderr' || text.toLowerCase().includes('error') || text.toLowerCase().includes('warn')) {
      state.errors.push(text);
    }
    state.lines.push(text);
  };

  proc.stdout?.on('data', handleLine('stdout'));
  proc.stderr?.on('data', handleLine('stderr'));

  proc.on('close', () => {
    states[app.name].status = 'stopped';
  });

  proc.on('error', () => {
    states[app.name].status = 'error';
  });
}

function shutdown() {
  console.log(`\n${DIM}Shutting down all apps...${RESET}`);
  for (const app of APPS) {
    const state = states[app.name];
    if (state?.process) {
      state.process.kill('SIGTERM');
    }
  }
  setTimeout(() => process.exit(0), 1000);
}

async function main() {
  clearScreen();

  console.log(`${BOLD}${GREEN}`);
  console.log(`  ╔══════════════════════════════════════════╗`);
  console.log(`  ║      🚀 Digital Sheba Dev Server         ║`);
  console.log(`  ║      Starting all apps...                ║`);
  console.log(`  ╚══════════════════════════════════════════╝`);
  console.log(`${RESET}`);
  console.log('');

  let currentFilter: string | null = null;
  let refreshInterval: NodeJS.Timeout | null = null;

  // Start all apps
  for (const app of APPS) {
    console.log(`  ${app.icon} Starting ${app.color}${app.label}${RESET} on port ${app.port}...`);
    startApp(app);
  }

  console.log('');
  console.log(`${DIM}  All apps started. Dashboard loading in 2 seconds...${RESET}`);

  // Wait a moment for processes to start
  await new Promise(r => setTimeout(r, 2000));

  // Initial draw
  drawDashboard(currentFilter);

  // Auto-refresh every 1.5s
  refreshInterval = setInterval(() => {
    drawDashboard(currentFilter);
  }, 1500);

  // Handle keyboard input
  process.stdin.setRawMode?.(true);
  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  process.stdin.on('data', (key: string) => {
    switch (key) {
      case '1': currentFilter = currentFilter === 'landing' ? null : 'landing'; drawDashboard(currentFilter); break;
      case '2': currentFilter = currentFilter === 'admin' ? null : 'admin'; drawDashboard(currentFilter); break;
      case '3': currentFilter = currentFilter === 'api' ? null : 'api'; drawDashboard(currentFilter); break;
      case 'a': case 'A': currentFilter = null; drawDashboard(currentFilter); break;
      case 'e': case 'E': currentFilter = currentFilter === 'errors' ? null : 'errors'; drawDashboard(currentFilter); break;
      case 'q': case 'Q': case '\u0003': shutdown(); break; // q, Ctrl+C
    }
  });

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch(console.error);
