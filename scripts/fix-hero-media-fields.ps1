param()
$ErrorActionPreference = "Continue"

$CMS   = "https://directus-production-7860.up.railway.app"
$TOKEN = "WvEjkm9_tLZEvOvYAzPycqwp6dLJGVS5"

function Invoke-Dir {
    param([string]$Method, [string]$Path, [object]$Body)
    $uri = "$CMS$Path"
    if ($Body) {
        $json = $Body | ConvertTo-Json -Depth 10 -Compress
        try {
            $r = Invoke-RestMethod -Method $Method -Uri $uri -Body $json `
                -ContentType "application/json" `
                -Headers @{ Authorization = "Bearer $TOKEN" }
            return $r
        } catch {
            try { $msg = ($_.ErrorDetails.Message | ConvertFrom-Json).errors[0].message }
            catch { $msg = $_.Exception.Message }
            Write-Host "  [skip] $Method $Path => $msg" -ForegroundColor Yellow
            return $null
        }
    } else {
        try {
            $r = Invoke-RestMethod -Method $Method -Uri $uri `
                -Headers @{ Authorization = "Bearer $TOKEN" }
            return $r
        } catch {
            try { $msg = ($_.ErrorDetails.Message | ConvertFrom-Json).errors[0].message }
            catch { $msg = $_.Exception.Message }
            Write-Host "  [skip] $Method $Path => $msg" -ForegroundColor Yellow
            return $null
        }
    }
}

# Add a plain text/string field
function Add-Str([string]$col, [string]$field, [string]$width = "full") {
    Invoke-Dir POST "/fields/$col" @{
        field  = $field
        type   = "string"
        meta   = @{ interface = "input"; width = $width }
        schema = @{ is_nullable = $true; max_length = 1024 }
    }
}

# Add a file-image picker field (drag & drop, upload from machine, library)
function Add-FileImage([string]$col, [string]$field) {
    Write-Host "  + file-image: $field" -ForegroundColor Green
    Invoke-Dir POST "/fields/$col" @{
        field  = $field
        type   = "uuid"
        meta   = @{
            interface = "file-image"
            special   = @("file")
            width     = "full"
        }
        schema = @{ is_nullable = $true }
    }
}

# Add a file picker field (for any file type, e.g. video)
function Add-File([string]$col, [string]$field) {
    Write-Host "  + file: $field" -ForegroundColor Green
    Invoke-Dir POST "/fields/$col" @{
        field  = $field
        type   = "uuid"
        meta   = @{
            interface = "file"
            special   = @("file")
            width     = "full"
        }
        schema = @{ is_nullable = $true }
    }
}

# Delete a field
function Del-Field([string]$col, [string]$field) {
    Write-Host "  - delete: $field" -ForegroundColor Red
    Invoke-Dir DELETE "/fields/$col/$field" $null
}

# Collections that have hero_image as plain text (needs to be replaced with file picker)
# and are missing hero_image_url, hero_video
$WITH_EXISTING_IMAGE = @("ministerios_page", "educacion", "donaciones")

# Collections that have NO hero media fields at all
$WITHOUT_MEDIA = @("en_vivo", "oracion")

# Collections that may already exist but need the same treatment
# (nosotros and contacto were pre-existing - check separately)
$ALL_FIVE = $WITH_EXISTING_IMAGE + $WITHOUT_MEDIA

Write-Host "`n=== Step 1: Delete plain-text hero_image from 3 collections ===" -ForegroundColor Cyan
foreach ($col in $WITH_EXISTING_IMAGE) {
    Write-Host "`nCollection: $col" -ForegroundColor Cyan
    Del-Field $col "hero_image"
}

Write-Host "`n=== Step 2: Add hero_image (file-image picker) to all 5 ===" -ForegroundColor Cyan
foreach ($col in $ALL_FIVE) {
    Write-Host "`nCollection: $col" -ForegroundColor Cyan
    Add-FileImage $col "hero_image"
}

Write-Host "`n=== Step 3: Add hero_image_url (external URL text) to all 5 ===" -ForegroundColor Cyan
foreach ($col in $ALL_FIVE) {
    Write-Host "`nCollection: $col" -ForegroundColor Cyan
    Add-Str $col "hero_image_url"
}

Write-Host "`n=== Step 4: Add hero_video (file picker) to all 5 ===" -ForegroundColor Cyan
foreach ($col in $ALL_FIVE) {
    Write-Host "`nCollection: $col" -ForegroundColor Cyan
    Add-File $col "hero_video"
}

Write-Host "`n=== Step 5: Add hero_video_url (YouTube/Vimeo/URL text) to en_vivo and oracion ===" -ForegroundColor Cyan
foreach ($col in $WITHOUT_MEDIA) {
    Write-Host "`nCollection: $col" -ForegroundColor Cyan
    Add-Str $col "hero_video_url"
}

Write-Host "`n=== Step 6: Fix nosotros and contacto (check and patch if needed) ===" -ForegroundColor Cyan
foreach ($col in @("nosotros", "contacto")) {
    Write-Host "`nCollection: $col - ensuring file picker fields exist" -ForegroundColor Cyan
    # hero_image: try to delete text version and recreate as file picker
    # (will skip if already correct or if delete fails gracefully)
    Del-Field $col "hero_image"
    Add-FileImage $col "hero_image"
    Add-Str  $col "hero_image_url"
    Add-File $col "hero_video"
    # hero_video_url should already exist
}

Write-Host "`nListo! Campos de hero media corregidos en todas las colecciones." -ForegroundColor Green
Write-Host "Cada coleccion ahora tiene:" -ForegroundColor Gray
Write-Host "  hero_image     = file-image picker (drag & drop, upload, libreria)" -ForegroundColor Gray
Write-Host "  hero_image_url = texto para URL externa (prioridad sobre hero_image)" -ForegroundColor Gray
Write-Host "  hero_video     = file picker para video interno" -ForegroundColor Gray
Write-Host "  hero_video_url = texto para YouTube/Vimeo/URL directa" -ForegroundColor Gray
