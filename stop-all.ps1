# CivicVote – Stop All Microservices and Frontend

$ports = @(8761, 8080, 8081, 8082, 8083, 8084, 5173)

Write-Host "Stopping CivicVote services on ports: $($ports -join ', ')..." -ForegroundColor Yellow

foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
    if ($connections) {
        foreach ($conn in $connections) {
            $pidToKill = $conn.OwningProcess
            try {
                Stop-Process -Id $pidToKill -Force -ErrorAction SilentlyContinue
                Write-Host "Stopped process $pidToKill listening on port $port." -ForegroundColor Green
            } catch {
                Write-Host "Could not stop process $pidToKill on port $port." -ForegroundColor Red
            }
        }
    } else {
        Write-Host "No process listening on port $port." -ForegroundColor DarkGray
    }
}

Write-Host "All CivicVote services stopped." -ForegroundColor Cyan
