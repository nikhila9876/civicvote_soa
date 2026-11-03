# CivicVote – Full Stack Single-Command Launcher
# Starts Eureka, Gateway, Auth, Election, Voting, Result services and the Frontend

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   Starting CivicVote Tamper-Resistant Voting Platform    " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Start Eureka Server
Write-Host "[1/7] Starting Eureka Discovery Server (Port 8761)..." -ForegroundColor Yellow
Start-Process -FilePath "java" -ArgumentList "-Xms128m -Xmx256m -jar $scriptDir\eureka-server\target\eureka-server-0.0.1-SNAPSHOT.jar" -WindowStyle Minimized
Start-Sleep -Seconds 6

# 2. Start API Gateway
Write-Host "[2/7] Starting API Gateway (Port 8080)..." -ForegroundColor Yellow
Start-Process -FilePath "java" -ArgumentList "-Xms128m -Xmx256m -jar $scriptDir\api-gateway\target\api-gateway-0.0.1-SNAPSHOT.jar" -WindowStyle Minimized
Start-Sleep -Seconds 4

# 3. Start Auth Service
Write-Host "[3/7] Starting Auth Service (Port 8081)..." -ForegroundColor Yellow
Start-Process -FilePath "java" -ArgumentList "-Xms128m -Xmx256m -jar $scriptDir\auth-service\target\auth-service-0.0.1-SNAPSHOT.jar" -WindowStyle Minimized

# 4. Start Election Service
Write-Host "[4/7] Starting Election Service (Port 8082)..." -ForegroundColor Yellow
Start-Process -FilePath "java" -ArgumentList "-Xms128m -Xmx256m -jar $scriptDir\election-service\target\election-service-0.0.1-SNAPSHOT.jar" -WindowStyle Minimized

# 5. Start Result Service
Write-Host "[5/7] Starting Result Service (Port 8084)..." -ForegroundColor Yellow
Start-Process -FilePath "java" -ArgumentList "-Xms128m -Xmx256m -jar $scriptDir\result-service\target\result-service-0.0.1-SNAPSHOT.jar" -WindowStyle Minimized

# 6. Start Voting Service
Write-Host "[6/7] Starting Voting Service (Port 8083)..." -ForegroundColor Yellow
Start-Process -FilePath "java" -ArgumentList "-Xms128m -Xmx256m -jar $scriptDir\voting-service\target\voting-service-0.0.1-SNAPSHOT.jar" -WindowStyle Minimized
Start-Sleep -Seconds 4

# 7. Start Frontend (Vite)
Write-Host "[7/7] Starting Frontend Web Client (Port 5173)..." -ForegroundColor Yellow
Start-Process -FilePath "npm.cmd" -ArgumentList "run dev" -WorkingDirectory "$scriptDir\frontend" -WindowStyle Minimized

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  All services launched successfully!                    " -ForegroundColor Green
Write-Host "  • Frontend Web Client:   http://localhost:5173         " -ForegroundColor White
Write-Host "  • API Gateway:           http://localhost:8080         " -ForegroundColor White
Write-Host "  • Eureka Dashboard:      http://localhost:8761         " -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan
