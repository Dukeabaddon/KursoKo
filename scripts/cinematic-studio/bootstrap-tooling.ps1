# Detect or install Graphify + Gate-MCP for frontend-cinematic-studio
# Run from repo root: .\scripts\bootstrap-tooling.ps1
# Agent may run this during skill preflight.

param(
    [string]$ProjectRoot = (Get-Location).Path
)

$ErrorActionPreference = "Continue"
Set-Location $ProjectRoot

function Test-Command($name) {
    if (Get-Command $name -ErrorAction SilentlyContinue) { return $true }
    try { python -m $name --version 2>$null | Out-Null; return $LASTEXITCODE -eq 0 } catch { return $false }
}

Write-Host "=== Cinematic Studio tooling bootstrap ===" -ForegroundColor Cyan

# --- Graphify ---
$graphifyOk = $false
try {
    $v = python -m graphify --version 2>&1
    if ($LASTEXITCODE -eq 0) { $graphifyOk = $true; Write-Host "[OK] Graphify: $v" -ForegroundColor Green }
} catch {}

if (-not $graphifyOk) {
    Write-Host "[..] Installing graphifyy from PyPI..." -ForegroundColor Yellow
    pip install graphifyy -q
    $v = python -m graphify --version 2>&1
    if ($LASTEXITCODE -eq 0) { $graphifyOk = $true; Write-Host "[OK] Graphify installed: $v" -ForegroundColor Green }
    else { Write-Host "[!!] Graphify install failed — need Python 3.10+" -ForegroundColor Red }
}

$graphOut = Join-Path $ProjectRoot "graphify-out\graph.json"
if (Test-Path $graphOut) {
    Write-Host "[OK] graphify-out/graph.json exists — reuse" -ForegroundColor Green
} elseif ($graphifyOk) {
    Write-Host "[..] No graph — run: python -m graphify ." -ForegroundColor Yellow
}

# --- Understand-Anything (optional alternate graph) ---
$uaGraph = Join-Path $ProjectRoot ".understand-anything\knowledge-graph.json"
if (Test-Path $uaGraph) {
    Write-Host "[OK] Understand-Anything graph found — prefer /understand-chat for map questions" -ForegroundColor Green
}

# --- Gate-MCP ---
$gateDist = Join-Path $ProjectRoot "tools\Gate-MCP\dist\main.js"
$mcpPath = Join-Path $ProjectRoot ".cursor\mcp.json"
$gateConfigured = $false

if (Test-Path $mcpPath) {
    $gateConfigured = $true
    Write-Host "[OK] .cursor/mcp.json exists" -ForegroundColor Green
} else {
    $example = Join-Path $ProjectRoot ".cursor\mcp.json.example"
    if (Test-Path $example) {
        Copy-Item $example $mcpPath
        Write-Host "[OK] Created .cursor/mcp.json from example — edit GATE_PROJECT_ROOT" -ForegroundColor Yellow
        $gateConfigured = $true
    }
}

if (-not (Test-Path $gateDist)) {
    $toolsDir = Join-Path $ProjectRoot "tools\Gate-MCP"
    if (-not (Test-Path $toolsDir)) {
        Write-Host "[..] Cloning Gate-MCP..." -ForegroundColor Yellow
        New-Item -ItemType Directory -Path (Join-Path $ProjectRoot "tools") -Force | Out-Null
        git clone https://github.com/Dukeabaddon/Gate-MCP.git $toolsDir 2>$null
    }
    if (Test-Path (Join-Path $toolsDir "package.json")) {
        Push-Location $toolsDir
        npm install --legacy-peer-deps -q 2>$null
        npm run build -q 2>$null
        Pop-Location
    }
}

if (Test-Path $gateDist) { Write-Host "[OK] Gate-MCP built at tools/Gate-MCP" -ForegroundColor Green }
else { Write-Host "[..] Gate fallback: npx -y @gatemcp/cli (needs Node 20+)" -ForegroundColor Yellow }

Write-Host ""
Write-Host "Next: Restart Cursor. MCP panel -> gatemcp green. Agent: gate_init" -ForegroundColor Cyan
