#!/usr/bin/env node

const { spawn } = require('child_process');

// ─── Colors ──────────────────────────────────────────────────
const C = {
  R: '\x1b[0m', B: '\x1b[1m', D: '\x1b[2m', I: '\x1b[3m',
  RED: '\x1b[31m', GREEN: '\x1b[32m', YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m', MAGENTA: '\x1b[35m', CYAN: '\x1b[36m',
  WHITE: '\x1b[37m', BG: '\x1b[48;5;235m', BG2: '\x1b[48;5;236m',
};

const APPS = [
  { name: 'landing', label: 'Landing', color: C.CYAN,   icon: '◉', port: 3000, cwd: 'apps/landing' },
  { name: 'admin',   label: 'Admin',   color: C.MAGENTA, icon: '◉', port: 3001, cwd: 'apps/admin' },
  { name: 'api',     label: 'API',     color: C.YELLOW,  icon: '◉', port: 4000, cwd: 'apps/api' },
];

const state = {};
let selectedApp = null; // null = all
const COLS = () => process.stdout.columns || 120;
const ROWS = () => process.stdout.rows || 40;

// ─── Utilities ───────────────────────────────────────────────
function ts() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;
}

function pad(s, len) { return s.length >= len ? s.slice(0, len) : s + ' '.repeat(len - s.length); }
function rpad(s, len) { return s.length >= len ? s.slice(0, len) : ' '.repeat(len - s.length) + s; }

// ─── Draw ────────────────────────────────────────────────────
function render() {
  const cols = COLS();
  const rows = ROWS();
  const leftW = 30;
  const rightW = cols - leftW - 3;
  const logRows = Math.max(5, rows - 16);

  // Move cursor to top-left
  process.stdout.write('\x1b[H');

  // Header
  process.stdout.write(`${C.GREEN}${C.BG}                                                                              ${C.R}\n`);
  process.stdout.write(`${C.GREEN}${C.BG}${C.B}   🚀 DIGITAL SHEBA — DEV DASHBOARD                                         ${C.R}\n`);
  process.stdout.write(`${C.GREEN}${C.BG}   All apps running simultaneously                                           ${C.R}\n`);
  process.stdout.write(`${C.GREEN}${C.BG}                                                                              ${C.R}\n`);
  process.stdout.write('\n');

  // Left panel header
  process.stdout.write(`${C.BG2}${C.B} 📋 APPS STATUS  ${C.R} ${C.BG2}${' '.repeat(leftW - 18)}${C.R}\n`);
  process.stdout.write(`${C.D}  ${'─'.repeat(leftW - 4)}${C.R}\n`);

  for (const app of APPS) {
    const s = state[app.name];
    const isSel = selectedApp === app.name;
    const marker = isSel ? `${C.B}▸${C.R} ` : '  ';
    const statusColor = s?.status === 'running' ? C.GREEN : s?.status === 'starting' ? C.YELLOW : s?.status === 'error' ? C.RED : C.D;
    const statusText = s?.status === 'running' ? 'RUNNING' : s?.status === 'starting' ? 'STARTING' : s?.status === 'error' ? 'ERROR' : 'STOPPED';
    const uptime = s?.startTime ? calcUptime(Date.now() - s.startTime) : '';
    const errCount = s?.errors?.length || 0;
    const errBadge = errCount > 0 ? ` ${C.RED}(${errCount})${C.R}` : '';

    const line1 = `${marker}${app.color}${app.icon} ${app.label}${C.R}  ${C.D}:${app.port}${C.R}`;
    const line2 = `    ${statusColor}${statusText}${C.R}${errBadge}  ${C.D}${uptime}${C.R}`;
    process.stdout.write(`${line1}\n`);
    process.stdout.write(`${line2}\n`);
  }

  process.stdout.write('\n');

  // Commands
  process.stdout.write(`${C.D}  [1]Landing [2]Admin [3]API [A]All [E]Errors [Q]Quit${C.R}\n`);
  process.stdout.write(`${C.D}  ${'─'.repeat(leftW - 4)}${C.R}\n\n`);

  // Right panel header
  const logTitle = selectedApp ? `LOGS — ${selectedApp.toUpperCase()}` : 'LOGS — ALL APPS';
  process.stdout.write(`${C.BG2}${C.B} 📜 ${logTitle}  ${C.R}${C.BG2}${' '.repeat(Math.max(0, rightW - logTitle.length - 6))}${C.R}\n`);
  process.stdout.write(`${C.D}  ${'─'.repeat(rightW - 4)}${C.R}\n`);

  // Collect logs
  const allLogs = [];
  for (const app of APPS) {
    if (selectedApp && selectedApp !== app.name) continue;
    const s = state[app.name];
    if (!s) continue;
    for (const line of s.lines) {
      allLogs.push({ app, line });
    }
  }

  const recent = allLogs.slice(-logRows);
  if (recent.length === 0) {
    process.stdout.write(`${C.D}  Waiting for logs...${C.R}\n`);
  } else {
    for (const { app, line } of recent) {
      const tag = `${app.color}${pad(app.label, 7)}${C.R}`;
      const maxLen = rightW - 14;
      const truncated = line.length > maxLen ? line.slice(0, maxLen) + '…' : line;
      process.stdout.write(`  ${C.D}${ts()}${C.R} ${tag} ${truncated}\n`);
    }
  }

  // Fill remaining rows
  const drawn = recent.length;
  for (let i = drawn; i < logRows; i++) {
    process.stdout.write('\n');
  }

  // Footer
  const totalErrors = APPS.reduce((s, a) => s + (state[a.name]?.errors?.length || 0), 0);
  process.stdout.write(`${C.D}  ${'─'.repeat(cols - 8)}${C.R}\n`);
  if (totalErrors > 0) {
    process.stdout.write(`${C.RED}${C.B}  ⚠  ${totalErrors} error(s) — press [E] to filter errors only${C.R}\n`);
  } else {
    process.stdout.write(`${C.GREEN}  ✓ All systems operational${C.R}\n`);
  }
}

function calcUptime(ms) {
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

// ─── Process Management ──────────────────────────────────────
function startApp(app) {
  const proc = spawn('bun', ['run', 'dev'], {
    cwd: app.cwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, FORCE_COLOR: '1' },
    shell: true,
  });

  state[app.name] = { proc, status: 'starting', lines: [], errors: [], startTime: Date.now() };

  const onLine = (stream) => (buf) => {
    const text = buf.toString().replace(/\r?\n$/, '');
    if (!text) return;
    const s = state[app.name];

    if (/ready|started|listening|compiled|running|API running|port \d/i.test(text)) {
      if (s.status === 'starting') s.status = 'running';
    }
    if (/error|fail|exception|crash|EADDRINUSE/i.test(text)) {
      s.errors.push(text);
    }
    s.lines.push(text);
  };

  proc.stdout.on('data', onLine('stdout'));
  proc.stderr.on('data', onLine('stderr'));
  proc.on('close', () => { state[app.name].status = 'stopped'; });
  proc.on('error', () => { state[app.name].status = 'error'; });
}

function shutdown() {
  process.stdout.write('\x1b[?25h'); // show cursor
  console.log(`\n  ${C.D}Shutting down...${C.R}`);
  for (const app of APPS) {
    state[app.name]?.proc?.kill('SIGTERM');
  }
  setTimeout(() => process.exit(0), 800);
}

// ─── Main ────────────────────────────────────────────────────
function main() {
  // Hide cursor, clear screen
  process.stdout.write('\x1b[?25l');
  process.stdout.write('\x1b[2J');

  console.log(`\n  ${C.GREEN}${C.B}🚀 Digital Sheba Dev Server${C.R}`);
  console.log(`  ${C.D}Starting all apps...${C.R}\n`);

  for (const app of APPS) {
    process.stdout.write(`  ${app.color}${app.icon} ${app.label}${C.R} ... `);
    startApp(app);
    process.stdout.write(`${C.GREEN}launched${C.R}\n`);
  }

  console.log(`\n  ${C.GREEN}${C.B}✓ All apps launched!${C.R}\n`);

  // Wait for processes to start
  setTimeout(() => {
    render();

    // Auto-refresh
    setInterval(render, 1500);

    // Keyboard input
    process.stdin.setRawMode?.(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (key) => {
      switch (key) {
        case '1': selectedApp = selectedApp === 'landing' ? null : 'landing'; render(); break;
        case '2': selectedApp = selectedApp === 'admin' ? null : 'admin'; render(); break;
        case '3': selectedApp = selectedApp === 'api' ? null : 'api'; render(); break;
        case 'a': case 'A': selectedApp = null; render(); break;
        case 'e': case 'E': selectedApp = selectedApp === 'errors' ? null : 'errors'; render(); break;
        case 'q': case 'Q': case '\u0003': shutdown(); break;
      }
    });
  }, 2500);

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main();
