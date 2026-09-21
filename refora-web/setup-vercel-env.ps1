#!/usr/bin/env pwsh
# setup-vercel-env.ps1
# Run AFTER: vercel login && vercel link
# Usage: .\setup-vercel-env.ps1

$ErrorActionPreference = "Stop"

Write-Host "=== REFORA — Vercel Environment Setup ===" -ForegroundColor Cyan
Write-Host "This will add all required env vars to your Vercel project."
Write-Host ""

function AddEnv($name, $value, $env = "production") {
    if ($value -eq "" -or $value -eq "AWAITING_CLIENT") {
        Write-Host "SKIP $name (not set yet)" -ForegroundColor Yellow
        return
    }
    Write-Host "Adding $name..." -ForegroundColor Gray
    $value | vercel env add $name $env --force
}

# Required — already known
AddEnv "DATABASE_URL" "postgresql://neondb_owner:npg_0DFwCeRtgl6K@ep-withered-butterfly-azdhe1sz-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
AddEnv "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME" "dautrievu"
AddEnv "CLOUDINARY_API_KEY" "QMhLEN39qWJt_r8uWZsinXLTDKs"
AddEnv "SHIPROCKET_BASE_URL" "https://apiv2.shiprocket.in/v1/external"
AddEnv "EMAIL_FROM" "noreply@refora.in"
AddEnv "NEXT_PUBLIC_APP_URL" "https://refora.in"
AddEnv "NEXT_PUBLIC_APP_NAME" "REFORA"

# Auth secret — generate one
$authSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
AddEnv "AUTH_SECRET" $authSecret
AddEnv "AUTH_URL" "https://refora.in"

Write-Host ""
Write-Host "=== AWAITING CLIENT INPUT ===" -ForegroundColor Yellow
Write-Host "Add these manually once you have the credentials:"
Write-Host "  vercel env add CLOUDINARY_API_SECRET production"
Write-Host "  vercel env add RAZORPAY_KEY_ID production"
Write-Host "  vercel env add RAZORPAY_KEY_SECRET production"
Write-Host "  vercel env add NEXT_PUBLIC_RAZORPAY_KEY_ID production"
Write-Host "  vercel env add RESEND_API_KEY production"
Write-Host "  vercel env add NEXT_PUBLIC_WHATSAPP_NUMBER production"
Write-Host "  vercel env add NEXT_PUBLIC_GA4_ID production"
Write-Host "  vercel env add NEXT_PUBLIC_META_PIXEL_ID production"
Write-Host "  vercel env add SHIPROCKET_EMAIL production"
Write-Host "  vercel env add SHIPROCKET_PASSWORD production"
Write-Host ""
Write-Host "=== Done! Now run: vercel --prod ===" -ForegroundColor Green
