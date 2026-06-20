param()
$ErrorActionPreference = "Continue"

$CMS   = "https://directus-production-7860.up.railway.app"
$TOKEN = "WvEjkm9_tLZEvOvYAzPycqwp6dLJGVS5"

function Invoke-Dir {
    param([string]$Method, [string]$Path, [object]$Body)
    $uri = "$CMS$Path"
    $json = if ($Body) { $Body | ConvertTo-Json -Depth 10 -Compress } else { $null }
    try {
        $args = @{ Method=$Method; Uri=$uri; Headers=@{ Authorization="Bearer $TOKEN" } }
        if ($json) { $args.Body = $json; $args.ContentType = "application/json" }
        $r = Invoke-RestMethod @args
        return $r
    } catch {
        try { $msg = ($_.ErrorDetails.Message | ConvertFrom-Json).errors[0].message }
        catch { $msg = $_.Exception.Message }
        Write-Host "  [skip] $Method $Path => $msg" -ForegroundColor Yellow
        return $null
    }
}

function New-Singleton([string]$name, [string]$note) {
    Write-Host "`nCreando coleccion: $name" -ForegroundColor Cyan
    Invoke-Dir POST "/collections" @{
        collection = $name
        meta       = @{ singleton = $true; icon = "article"; note = $note }
        schema     = @{ name = $name }
    }
}

function Add-Str([string]$col, [string]$field, [string]$width = "full") {
    Invoke-Dir POST "/fields/$col" @{
        field  = $field; type = "string"
        meta   = @{ interface = "input"; width = $width }
        schema = @{ is_nullable = $true; max_length = 1024 }
    }
}

function Add-Float([string]$col, [string]$field) {
    Invoke-Dir POST "/fields/$col" @{
        field  = $field; type = "float"
        meta   = @{ interface = "input"; width = "half" }
        schema = @{ is_nullable = $true }
    }
}

function Add-Bool([string]$col, [string]$field) {
    Invoke-Dir POST "/fields/$col" @{
        field  = $field; type = "boolean"
        meta   = @{ interface = "boolean"; width = "half" }
        schema = @{ is_nullable = $true }
    }
}

function Add-FileImage([string]$col, [string]$field) {
    $r = Invoke-Dir POST "/fields/$col" @{
        field  = $field; type = "uuid"
        meta   = @{ interface = "file-image"; special = @("file"); width = "full" }
        schema = @{ is_nullable = $true }
    }
    if ($r) {
        Invoke-Dir POST "/relations" @{
            collection = $col; field = $field; related_collection = "directus_files"
        } | Out-Null
        Write-Host "  + file-image $field -> directus_files" -ForegroundColor Green
    }
}

function Add-File([string]$col, [string]$field) {
    $r = Invoke-Dir POST "/fields/$col" @{
        field  = $field; type = "uuid"
        meta   = @{ interface = "file"; special = @("file"); width = "full" }
        schema = @{ is_nullable = $true }
    }
    if ($r) {
        Invoke-Dir POST "/relations" @{
            collection = $col; field = $field; related_collection = "directus_files"
        } | Out-Null
        Write-Host "  + file $field -> directus_files" -ForegroundColor Green
    }
}

# Standard hero block for all pages
function Add-HeroBlock([string]$col) {
    foreach ($f in @("hero_eyebrow","hero_title","hero_subtitle")) { Add-Str $col $f }
    Add-FileImage $col "hero_image"
    Add-Str       $col "hero_image_url"
    Add-File      $col "hero_video"
    Add-Str       $col "hero_video_url"
    Add-Str       $col "hero_bg_color"   "half"
    Add-Float     $col "hero_overlay_opacity"
    Add-Bool      $col "hero_show_grid"
    Add-Str       $col "hero_watermark"  "half"
}

# ── 1. predicas_page ──────────────────────────────────────
New-Singleton "predicas_page" "Pagina de Predicas"
Add-HeroBlock "predicas_page"

Invoke-Dir PATCH "/items/predicas_page" @{
    hero_eyebrow = "Predicas"
    hero_title   = "La Palabra donde estes."
    hero_subtitle = "Accede al archivo completo de nuestras predicas. Escucha, medita y crece en la fe."
}

# ── 2. eventos_page ───────────────────────────────────────
New-Singleton "eventos_page" "Pagina de Eventos"
Add-HeroBlock "eventos_page"

Invoke-Dir PATCH "/items/eventos_page" @{
    hero_eyebrow  = "Eventos · Agenda 2026"
    hero_title    = "Lo que se viene."
    hero_subtitle = "Mantente al dia con nuestras actividades, servicios y eventos especiales."
}

# ── 3. devocionales_page ──────────────────────────────────
New-Singleton "devocionales_page" "Pagina de Devocionales"
Add-HeroBlock "devocionales_page"

Invoke-Dir PATCH "/items/devocionales_page" @{
    hero_eyebrow  = "Reflexiones · Devocionales"
    hero_title    = "Palabra para hoy."
    hero_subtitle = "Reflexiones escritas por nuestros lideres para nutrir tu vida espiritual cada dia."
}

# ── 4. publicaciones_page ─────────────────────────────────
New-Singleton "publicaciones_page" "Pagina de Publicaciones"
Add-HeroBlock "publicaciones_page"

Invoke-Dir PATCH "/items/publicaciones_page" @{
    hero_eyebrow  = "Noticias · Publicaciones"
    hero_title    = "Lo que esta pasando."
    hero_subtitle = "Noticias, anuncios y recursos de la comunidad El Manantial."
}

Write-Host "`nListo! 4 colecciones de paginas creadas." -ForegroundColor Green
