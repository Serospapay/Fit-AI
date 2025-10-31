# Script perevirky gotovnosti seredovyscha rozrobky
# Zapustit cherez PowerShell: .\check-setup.ps1

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Perevirka zasobiv rozrobky" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$allInstalled = $true

# Perevirka Node.js
Write-Host "[1/5] Perevirka Node.js..." -NoNewline
try {
    $nodeVersion = node --version
    Write-Host " OK Ustanovleno: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host " NE vstanovleno" -ForegroundColor Red
    Write-Host "   Zavantazhte z: https://nodejs.org/" -ForegroundColor Yellow
    $allInstalled = $false
}

# Perevirka npm
Write-Host "[2/5] Perevirka npm..." -NoNewline
try {
    $npmVersion = npm --version
    Write-Host " OK Ustanovleno: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host " NE vstanovleno" -ForegroundColor Red
    $allInstalled = $false
}

# Perevirka Python
Write-Host "[3/5] Perevirka Python..." -NoNewline
try {
    $pythonVersion = python --version 2>&1
    Write-Host " OK Ustanovleno: $pythonVersion" -ForegroundColor Green
    
    # Perevirka pip
    Write-Host "[3.1] Perevirka pip..." -NoNewline
    try {
        $pipVersion = pip --version
        Write-Host " OK Ustanovleno" -ForegroundColor Green
    } catch {
        Write-Host " pip ne znaydeno" -ForegroundColor Red
        $allInstalled = $false
    }
} catch {
    Write-Host " NE vstanovleno" -ForegroundColor Red
    Write-Host "   Zavantazhte z: https://www.python.org/downloads/" -ForegroundColor Yellow
    Write-Host "   Vazhlyvo: Postavte galochku 'Add Python to PATH'" -ForegroundColor Yellow
    $allInstalled = $false
}

# Perevirka Git
Write-Host "[4/5] Perevirka Git..." -NoNewline
try {
    $gitVersion = git --version
    Write-Host " OK Ustanovleno: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host " NE vstanovleno" -ForegroundColor Red
    Write-Host "   Zavantazhte z: https://git-scm.com/download/win" -ForegroundColor Yellow
    $allInstalled = $false
}

# Perevirka PostgreSQL
Write-Host "[5/5] Perevirka PostgreSQL..." -NoNewline
try {
    $pgService = Get-Service -Name "*postgresql*" -ErrorAction SilentlyContinue
    if ($pgService) {
        Write-Host " OK Servis znaydeno: $($pgService.Name)" -ForegroundColor Green
    } else {
        Write-Host " Servis ne znaydeno (mozhe buty cherez Docker)" -ForegroundColor Yellow
        Write-Host "   Abo vstanovit PostgreSQL z: https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    }
} catch {
    Write-Host " Ne vdalosya pereviriti PostgreSQL" -ForegroundColor Yellow
    Write-Host "   Mozhna vstanoviti piznishe abo vykoristati Docker" -ForegroundColor Yellow
}

# Pidsumok
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
if ($allInstalled) {
    Write-Host "OK Vsi osnovni instrumenty vstanovleni!" -ForegroundColor Green
    Write-Host "   Mozhna prodovzhuvati nastroyuvannya proektu." -ForegroundColor Green
} else {
    Write-Host "Deiaki instrumenty ne vstanovleni." -ForegroundColor Yellow
    Write-Host "   Vstanovit vidsutni instrumenty ta zapustit script znovu." -ForegroundColor Yellow
}
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Detalni instruktsii divit sya u fayli SETUP.md" -ForegroundColor Cyan
Write-Host ""

