# Digital Sheba - Dev Server Launcher
# Run: .\dev.ps1

$Host.UI.RawUI.WindowTitle = "Digital Sheba - Dev Launcher"

function Show-Menu {
    Clear-Host
    Write-Host ""
    Write-Host "  ╔══════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "  ║      🚀 Digital Sheba Dev Server         ║" -ForegroundColor Green
    Write-Host "  ╚══════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Choose how to run:" -ForegroundColor White
    Write-Host ""
    Write-Host "  [1] Single terminal (merged logs)" -ForegroundColor Cyan
    Write-Host "      → All logs in one terminal with color-coded prefixes" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "  [2] Split windows (3 separate windows)" -ForegroundColor Magenta
    Write-Host "      → Each app in its own terminal window" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "  [Q] Quit" -ForegroundColor Yellow
    Write-Host ""
}

function Start-SingleTerminal {
    Write-Host "`n  Starting all apps in single terminal...`n" -ForegroundColor Green
    node scripts/dev-logs.js
}

function Start-SplitWindows {
    Write-Host "`n  Opening 3 separate windows...`n" -ForegroundColor Green

    $baseDir = $PSScriptRoot

    Start-Process powershell -ArgumentList @(
        "-NoExit",
        "-Command",
        "`$Host.UI.RawUI.WindowTitle='Landing | Port 3000'; `$Host.UI.RawUI.ForegroundColor='Cyan'; Write-Host '  🌐 LANDING - Port 3000' -ForegroundColor Cyan; Write-Host '  ─────────────────────' -ForegroundColor DarkGray; Set-Location '$baseDir\apps\landing'; bun run dev"
    )

    Start-Process powershell -ArgumentList @(
        "-NoExit",
        "-Command",
        "`$Host.UI.RawUI.WindowTitle='Admin | Port 3001'; `$Host.UI.RawUI.ForegroundColor='Magenta'; Write-Host '  ⚙️  ADMIN - Port 3001' -ForegroundColor Magenta; Write-Host '  ─────────────────────' -ForegroundColor DarkGray; Set-Location '$baseDir\apps\admin'; bun run dev"
    )

    Start-Process powershell -ArgumentList @(
        "-NoExit",
        "-Command",
        "`$Host.UI.RawUI.WindowTitle='API | Port 4000'; `$Host.UI.RawUI.ForegroundColor='Yellow'; Write-Host '  🔗 API - Port 4000' -ForegroundColor Yellow; Write-Host '  ─────────────────────' -ForegroundColor DarkGray; Set-Location '$baseDir\apps\api'; bun run dev"
    )

    Write-Host "  ┌─────────────────────────────────────────┐" -ForegroundColor DarkGray
    Write-Host "  │  Three windows opened:                   │" -ForegroundColor DarkGray
    Write-Host "  │  🌐 Landing  → http://localhost:3000    │" -ForegroundColor Cyan
    Write-Host "  │  ⚙️  Admin    → http://localhost:3001    │" -ForegroundColor Magenta
    Write-Host "  │  🔗 API      → http://localhost:4000    │" -ForegroundColor Yellow
    Write-Host "  └─────────────────────────────────────────┘" -ForegroundColor DarkGray
    Write-Host ""
}

# Main loop
while ($true) {
    Show-Menu
    $choice = Read-Host "  Enter choice"

    switch ($choice) {
        "1" { Start-SingleTerminal; break }
        "2" { Start-SplitWindows; break }
        "Q" { "q" { exit }
        "q" { exit }
        default { Write-Host "`n  Invalid choice. Try again.`n" -ForegroundColor Red; Start-Sleep -Seconds 1 }
    }
}
