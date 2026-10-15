# DeepFakeShield — Automated GitHub Deployment Script
$Token = $env:GITHUB_TOKEN
if (-not $Token) {
    $Token = Read-Host "Enter your GitHub Personal Access Token"
}
$RepoName = "deepfakeshield"
$Headers = @{
    "Authorization" = "Bearer $Token"
    "Accept"        = "application/vnd.github.v3+json"
    "User-Agent"    = "DeepFakeShield-Deployer"
}

Write-Host "[1/4] Verifying GitHub User..." -ForegroundColor Cyan
try {
    $User = Invoke-RestMethod -Uri "https://api.github.com/user" -Headers $Headers -Method Get
    $Username = $User.login
    Write-Host "Authenticated as: $Username" -ForegroundColor Green
} catch {
    Write-Host "Authentication failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host "[2/4] Ensuring GitHub Repository '$RepoName' exists..." -ForegroundColor Cyan
$RepoBody = @{
    name        = $RepoName
    description = "DeepFakeShield — Enterprise AI Media Forensics Platform for detecting deepfakes, synthetic manipulation, and voice cloning."
    private     = $false
    auto_init   = $false
} | ConvertTo-Json

try {
    $Repo = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Headers $Headers -Method Post -Body $RepoBody -ContentType "application/json"
    Write-Host "Created repo: $($Repo.html_url)" -ForegroundColor Green
} catch {
    Write-Host "Repository already exists or configured, proceeding..." -ForegroundColor Yellow
}

Write-Host "[3/4] Initializing Git and Pushing Code..." -ForegroundColor Cyan
git init
git config user.name "$Username"
git config user.email "$Username@users.noreply.github.com"
git checkout -B main
git add .
git commit -m "DeepFakeShield — Initial Production Release"
git remote remove origin 2>$null
git remote add origin "https://x-access-token:$Token@github.com/$Username/$RepoName.git"
git push -u origin main --force

# Sanitize remote URL
git remote set-url origin "https://github.com/$Username/$RepoName.git"

Write-Host "[4/4] Enabling GitHub Pages..." -ForegroundColor Cyan
$PagesBody = @{
    source = @{
        branch = "main"
        path   = "/"
    }
} | ConvertTo-Json

try {
    $Pages = Invoke-RestMethod -Uri "https://api.github.com/repos/$Username/$RepoName/pages" -Headers $Headers -Method Post -Body $PagesBody -ContentType "application/json"
    Write-Host "GitHub Pages successfully activated!" -ForegroundColor Green
} catch {
    Write-Host "GitHub Pages activation status: $_" -ForegroundColor Yellow
}

$LiveUrl = "https://$($Username.ToLower()).github.io/$RepoName/"
Write-Host "`n========================================================" -ForegroundColor Green
Write-Host "REPOSITORY: https://github.com/$Username/$RepoName" -ForegroundColor Cyan
Write-Host "LIVE LINK:  $LiveUrl" -ForegroundColor Yellow
Write-Host "========================================================`n" -ForegroundColor Green
