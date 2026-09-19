```powershell
# Digital Sheba Dev Server - Split Pane View
# Requires: Windows Terminal or PowerShell 7+

$Host.UI.RawUI.WindowTitle = "Digital Sheba - Dev Server"

Write-Host ""
Write-Host "  ==========================================" -ForegroundColor Green
Write-Host "       Digital Sheba Dev Server" -ForegroundColor Green
Write-Host "  ==========================================" -ForegroundColor Green
Write-Host ""

Write-Host "  Starting all apps in separate windows..." -ForegroundColor Cyan
Write-Host ""

$root = (Get-Location).Path

# Start Landing
$landingCommand = @"
`$Host.UI.RawUI.WindowTitle = 'Landing | Port 3000'
`$Host.UI.RawUI.BackgroundColor = 'Black'
`$Host.UI.RawUI.ForegroundColor = 'Cyan'
Write-Host ''
Write-Host '  LANDING - Port 3000' -ForegroundColor Cyan
Write-Host '  -------------------' -ForegroundColor DarkGray
Set-Location '$root\apps\landing'
bun run dev
"@

$landing = Start-Process powershell `
    -ArgumentList "-NoExit", "-Command", $landingCommand `
    -PassThru


# Start Admin
$adminCommand = @"
`$Host.UI.RawUI.WindowTitle = 'Admin | Port 3001'
`$Host.UI.RawUI.BackgroundColor = 'Black'
`$Host.UI.RawUI.ForegroundColor = 'Magenta'
Write-Host ''
Write-Host '  ADMIN - Port 3001' -ForegroundColor Magenta
Write-Host '  -----------------' -ForegroundColor DarkGray
Set-Location '$root\apps\admin'
bun run dev
"@

$admin = Start-Process powershell `
    -ArgumentList "-NoExit", "-Command", $adminCommand `
    -PassThru


# Start API
$apiCommand = @"
`$Host.UI.RawUI.WindowTitle = 'API | Port 4000'
`$Host.UI.RawUI.BackgroundColor = 'Black'
`$Host.UI.RawUI.ForegroundColor = 'Yellow'
Write-Host ''
Write-Host '  API - Port 4000' -ForegroundColor Yellow
Write-Host '  ---------------' -ForegroundColor DarkGray
Set-Location '$root\apps\api'
bun run dev
"@

$api = Start-Process powershell `
    -ArgumentList "-NoExit", "-Command", $apiCommand `
    -PassThru


Write-Host ""
Write-Host "  ------------------------------------------" -ForegroundColor DarkGray
Write-Host "  Apps launched in 3 separate windows:" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  Landing  -> http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Admin    -> http://localhost:3001" -ForegroundColor Magenta
Write-Host "  API      -> http://localhost:4000" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Press Ctrl+C to stop all apps" -ForegroundColor DarkGray
Write-Host "  ------------------------------------------" -ForegroundColor DarkGray
Write-Host ""


# Wait and cleanup on exit
try {
    while ($true) {
        Start-Sleep -Seconds 5

        foreach ($p in @($landing, $admin, $api)) {
            if ($p.HasExited) {
                Write-Host "  Process $($p.ProcessName) exited." -ForegroundColor Yellow
            }
        }
    }
}
finally {
    Write-Host ""
    Write-Host "  Stopping all apps..." -ForegroundColor Yellow

    @($landing, $admin, $api) | ForEach-Object {
        if ($null -ne $_ -and !$_.HasExited) {
            Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
        }
    }

    Write-Host "  Done." -ForegroundColor Green
}

