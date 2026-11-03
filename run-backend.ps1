# CivicVote – Backend Microservices Launcher
# Starts Eureka Server, API Gateway, Auth, Election, Voting, and Result services

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "       Starting CivicVote Backend Microservices           " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Start Eureka Server (Port 8761)
Write-Host "[1/6] Starting Eureka Discovery Server on Port 8761..." -ForegroundColor Yellow
Start-Process -FilePath "java" -ArgumentList "-Xms128m -Xmx256m -jar $scriptDir\eureka-server\target\eureka-server-0.0.1-SNAPSHOT.jar" -WindowStyle Minimized
Start-Sleep -Seconds 6

# 2. Start API Gateway (Port 8080)
Write-Host "[2/6] Starting API Gateway on Port 8080..." -ForegroundColor Yellow
Start-Process -FilePath "java" -ArgumentList "-Xms128m -Xmx256m -jar $scriptDir\api-gateway\target\api-gateway-0.0.1-SNAPSHOT.jar" -WindowStyle Minimized
Start-Sleep -Seconds 4

# 3. Start Auth Service (Port 8081)
Write-Host "[3/6] Starting Auth Service on Port 8081..." -ForegroundColor Yellow
Start-Process -FilePath "java" -ArgumentList "-Xms128m -Xmx256m -jar $scriptDir\auth-service\target\auth-service-0.0.1-SNAPSHOT.jar" -WindowStyle Minimized

# 4. Start Election Service (Port 8082)
Write-Host "[4/6] Starting Election Service on Port 8082..." -ForegroundColor Yellow
Start-Process -FilePath "java" -ArgumentList "-Xms128m -Xmx256m -jar $scriptDir\election-service\target\election-service-0.0.1-SNAPSHOT.jar" -WindowStyle Minimized

# 5. Start Result Service (Port 8084)
Write-Host "[5/6] Starting Result Service on Port 8084..." -ForegroundColor Yellow
Start-Process -FilePath "java" -ArgumentList "-Xms128m -Xmx256m -jar $scriptDir\result-service\target\result-service-0.0.1-SNAPSHOT.jar" -WindowStyle Minimized

# 6. Start Voting Service (Port 8083)
Write-Host "[6/6] Starting Voting Service on Port 8083..." -ForegroundColor Yellow
Start-Process -FilePath "java" -ArgumentList "-Xms128m -Xmx256m -jar $scriptDir\voting-service\target\voting-service-0.0.1-SNAPSHOT.jar" -WindowStyle Minimized
Start-Sleep -Seconds 4

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  All 6 Backend Microservices Launched!                   " -ForegroundColor Green
Write-Host "  • Eureka Dashboard:   http://localhost:8761             " -ForegroundColor White
Write-Host "  • API Gateway:        http://localhost:8080             " -ForegroundColor White
Write-Host "  • Auth Service:       http://localhost:8081             " -ForegroundColor White
Write-Host "  • Election Service:   http://localhost:8082             " -ForegroundColor White
Write-Host "  • Voting Service:     http://localhost:8083             " -ForegroundColor White
Write-Host "  • Result Service:     http://localhost:8084             " -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan
