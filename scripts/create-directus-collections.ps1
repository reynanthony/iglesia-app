param()
$ErrorActionPreference = "Continue"

$CMS   = "https://directus-production-7860.up.railway.app"
$TOKEN = "WvEjkm9_tLZEvOvYAzPycqwp6dLJGVS5"

function Invoke-Dir {
    param([string]$Method, [string]$Path, [object]$Body)
    $json = $Body | ConvertTo-Json -Depth 10 -Compress
    try {
        $r = Invoke-RestMethod -Method $Method -Uri "$CMS$Path" -Body $json `
            -ContentType "application/json" `
            -Headers @{ Authorization = "Bearer $TOKEN" }
        return $r
    } catch {
        try { $msg = ($_.ErrorDetails.Message | ConvertFrom-Json).errors[0].message }
        catch { $msg = $_.Exception.Message }
        Write-Host "  [skip] $Method $Path => $msg" -ForegroundColor Yellow
        return $null
    }
}

function New-Col([string]$name, [string]$note) {
    Write-Host "`nColeccion: $name" -ForegroundColor Cyan
    Invoke-Dir POST "/collections" @{
        collection = $name
        meta       = @{ singleton = $true; icon = "article"; note = $note }
        schema     = @{ name = $name }
    }
}

function Add-Str([string]$col, [string]$field, [string]$width = "full") {
    Invoke-Dir POST "/fields/$col" @{
        field  = $field
        type   = "string"
        meta   = @{ interface = "input"; width = $width }
        schema = @{ is_nullable = $true; max_length = 512 }
    }
}

function Add-Text([string]$col, [string]$field) {
    Invoke-Dir POST "/fields/$col" @{
        field  = $field
        type   = "text"
        meta   = @{ interface = "input-multiline"; width = "full" }
        schema = @{ is_nullable = $true }
    }
}

function Add-Bool([string]$col, [string]$field) {
    Invoke-Dir POST "/fields/$col" @{
        field  = $field
        type   = "boolean"
        meta   = @{ interface = "boolean"; width = "half" }
        schema = @{ is_nullable = $true }
    }
}

function Add-Float([string]$col, [string]$field) {
    Invoke-Dir POST "/fields/$col" @{
        field  = $field
        type   = "float"
        meta   = @{ interface = "input"; width = "half" }
        schema = @{ is_nullable = $true }
    }
}

# ─────────────────────────────────────────────────────
# 1. ministerios_page
# ─────────────────────────────────────────────────────
New-Col "ministerios_page" "Pagina principal de Ministerios"

foreach ($f in @("hero_eyebrow","hero_title","hero_subtitle","hero_image","hero_video_url")) { Add-Str "ministerios_page" $f }
foreach ($f in @("hero_text_color","hero_bg_color","hero_title_size","hero_title_color","hero_accent_color","hero_subtitle_color","hero_eyebrow_color","hero_title_animation","hero_layout","hero_watermark")) { Add-Str "ministerios_page" $f "half" }
Add-Float "ministerios_page" "hero_overlay_opacity"
Add-Bool  "ministerios_page" "hero_show_grid"
foreach ($f in @("cta_eyebrow","cta_title","cta_link_label","cta_link_url")) { Add-Str "ministerios_page" $f }

Write-Host "  Registro inicial..." -ForegroundColor Gray
Invoke-Dir POST "/items/ministerios_page" @{
    hero_eyebrow   = "Ministerios"
    hero_title     = "Sirve con tu *don."
    hero_subtitle  = "Descubre las areas de servicio donde puedes participar y crecer junto a la comunidad."
    cta_eyebrow    = "- Unete"
    cta_title      = "Encuentra tu lugar."
    cta_link_label = "Ver todos los ministerios"
    cta_link_url   = "/ministerios"
}

# ─────────────────────────────────────────────────────
# 2. educacion
# ─────────────────────────────────────────────────────
New-Col "educacion" "Pagina de Educacion"

foreach ($f in @("hero_eyebrow","hero_title","hero_subtitle","hero_image","hero_video_url")) { Add-Str "educacion" $f }
foreach ($f in @("hero_text_color","hero_bg_color","hero_title_size","hero_title_color","hero_accent_color","hero_subtitle_color","hero_eyebrow_color","hero_title_animation","hero_layout","hero_watermark")) { Add-Str "educacion" $f "half" }
Add-Float "educacion" "hero_overlay_opacity"
Add-Bool  "educacion" "hero_show_grid"
foreach ($f in @("path1_label","path1_headline")) { Add-Str "educacion" $f }
Add-Text  "educacion" "path1_desc"
foreach ($f in @("path1_tag1","path1_tag2","path1_tag3")) { Add-Str "educacion" $f "third" }
foreach ($f in @("path2_label","path2_headline")) { Add-Str "educacion" $f }
Add-Text  "educacion" "path2_desc"
foreach ($f in @("path2_tag1","path2_tag2","path2_tag3")) { Add-Str "educacion" $f "third" }
Add-Str   "educacion" "why_eyebrow"
Add-Str   "educacion" "why_title"
Add-Text  "educacion" "why_body1"
Add-Text  "educacion" "why_body2"
Add-Str   "educacion" "verse"
Add-Str   "educacion" "verse_ref" "half"
Add-Str   "educacion" "app_title"
Add-Text  "educacion" "app_body"
Add-Str   "educacion" "cta_label" "half"

Write-Host "  Registro inicial..." -ForegroundColor Gray
Invoke-Dir POST "/items/educacion" @{
    hero_eyebrow   = "Formacion y Discipulado"
    hero_title     = "Crece en la *fe."
    hero_subtitle  = "Recursos y programas de formacion para cada etapa del camino cristiano."
    path1_label    = "Discipulado"
    path1_headline = "Primeros pasos en la fe"
    path1_desc     = "Un recorrido estructurado para nuevos creyentes y quienes desean profundizar su relacion con Dios."
    path1_tag1     = "Clases presenciales"
    path1_tag2     = "Recursos digitales"
    path1_tag3     = "Grupos pequenos"
    path2_label    = "Estudio biblico"
    path2_headline = "La Palabra como fundamento"
    path2_desc     = "Estudios profundos de las Escrituras para quienes desean conocer mejor la Biblia."
    path2_tag1     = "Miercoles 7 PM"
    path2_tag2     = "Online y presencial"
    path2_tag3     = "Todos los niveles"
    why_eyebrow    = "- Por que importa"
    why_title      = "La educacion transforma."
    why_body1      = "Creemos que una fe informada es una fe solida. Por eso invertimos en recursos que te ayuden a crecer espiritualmente."
    why_body2      = "Nuestros programas estan disenados para acompanarte en cada etapa del camino."
    verse          = "Toda la Escritura es inspirada por Dios y util para ensenar, para reprender, para corregir y para instruir en la justicia."
    verse_ref      = "2 Timoteo 3:16"
    app_title      = "Accede desde la app"
    app_body       = "Lleva los recursos de formacion contigo. Devocionales, estudios y mas desde tu telefono."
    cta_label      = "Descargar la app"
}

# ─────────────────────────────────────────────────────
# 3. donaciones
# ─────────────────────────────────────────────────────
New-Col "donaciones" "Pagina de Donaciones"

foreach ($f in @("hero_eyebrow","hero_title","hero_verse","hero_verse_ref","hero_image","hero_video_url")) { Add-Str "donaciones" $f }
foreach ($f in @("hero_text_color","hero_bg_color","hero_title_size","hero_title_color","hero_accent_color","hero_eyebrow_color","hero_title_animation","hero_layout")) { Add-Str "donaciones" $f "half" }
Add-Float "donaciones" "hero_overlay_opacity"
Add-Bool  "donaciones" "hero_show_grid"
foreach ($f in @("bank_name","bank_account","bank_titular","bank_rnc")) { Add-Str "donaciones" $f "half" }
Add-Str   "donaciones" "bank_note"
foreach ($f in @("zelle_email","zelle_name")) { Add-Str "donaciones" $f "half" }
Add-Str   "donaciones" "zelle_note"
foreach ($f in @("schedule_1_day","schedule_1_time","schedule_1_type","schedule_2_day","schedule_2_time","schedule_2_type")) { Add-Str "donaciones" $f "third" }
foreach ($i in 1..4) {
    Add-Str "donaciones" "stat${i}_value" "third"
    Add-Str "donaciones" "stat${i}_label" "third"
    Add-Str "donaciones" "stat${i}_desc"  "third"
}
Add-Str   "donaciones" "cta_verse"
Add-Str   "donaciones" "cta_verse_ref" "half"
Add-Text  "donaciones" "cta_body"

Write-Host "  Registro inicial..." -ForegroundColor Gray
Invoke-Dir POST "/items/donaciones" @{
    hero_eyebrow    = "Mayordomi­a y Generosidad"
    hero_title      = "Da con *gozo."
    hero_verse      = "Cada uno debe dar lo que haya decidido en su corazon, no de mala gana ni por obligacion, porque Dios ama al dador alegre."
    hero_verse_ref  = "2 Corintios 9:7"
    bank_name       = "Banco Popular"
    bank_account    = "000-000000-0"
    bank_titular    = "El Manantial"
    bank_rnc        = "000-00000-0"
    bank_note       = "Transferencia bancaria local"
    zelle_email     = "contacto@elmanantial.org"
    zelle_name      = "El Manantial"
    zelle_note      = "Disponible desde cualquier banco en EE.UU."
    schedule_1_day  = "Domingo"
    schedule_1_time = "Durante el servicio"
    schedule_1_type = "Ofrenda presencial"
    schedule_2_day  = "Cualquier momento"
    schedule_2_time = "24/7"
    schedule_2_type = "Transferencia o Zelle"
    stat1_value     = "100%"
    stat1_label     = "Transparencia"
    stat1_desc      = "Cada donativo se reporta a la congregacion"
    stat2_value     = "3"
    stat2_label     = "Areas de impacto"
    stat2_desc      = "Alabanza, educacion y mision"
    stat3_value     = "12"
    stat3_label     = "Meses al ano"
    stat3_desc      = "Operacion continua del ministerio"
    stat4_value     = "+50"
    stat4_label     = "Familias"
    stat4_desc      = "Alcanzadas cada semana"
    cta_verse       = "Honra al Senor con tus riquezas y con las primicias de todos tus frutos."
    cta_verse_ref   = "Proverbios 3:9"
    cta_body        = "Tu generosidad hace posible el ministerio. Cada aporte, grande o pequeno, transforma vidas."
}

# ─────────────────────────────────────────────────────
# 4. en_vivo
# ─────────────────────────────────────────────────────
New-Col "en_vivo" "Pagina En Vivo"

foreach ($f in @("offline_title","offline_subtitle","offline_next_text","schedule_eyebrow","schedule_title")) { Add-Str "en_vivo" $f }
foreach ($f in @("schedule_1_day","schedule_1_time","schedule_1_type")) { Add-Str "en_vivo" $f "third" }
Add-Bool "en_vivo" "schedule_1_live"
foreach ($f in @("schedule_2_day","schedule_2_time","schedule_2_type")) { Add-Str "en_vivo" $f "third" }
Add-Bool "en_vivo" "schedule_2_live"
foreach ($f in @("schedule_3_day","schedule_3_time","schedule_3_type")) { Add-Str "en_vivo" $f "third" }
Add-Bool "en_vivo" "schedule_3_live"
foreach ($f in @("cta_eyebrow","cta_title","cta_body")) { Add-Str "en_vivo" $f }

Write-Host "  Registro inicial..." -ForegroundColor Gray
Invoke-Dir POST "/items/en_vivo" @{
    offline_title     = "Estamos en *camino."
    offline_subtitle  = "Todos los domingos transmitimos nuestro servicio. Vuelve el proximo domingo para unirte."
    offline_next_text = "Proxima transmision: Domingo 10:00 AM"
    schedule_eyebrow  = "- Horario"
    schedule_title    = "Nos reunimos cada semana."
    schedule_1_day    = "Domingo"
    schedule_1_time   = "10:00 AM"
    schedule_1_type   = "Servicio principal"
    schedule_1_live   = $true
    schedule_2_day    = "Miercoles"
    schedule_2_time   = "7:00 PM"
    schedule_2_type   = "Estudio biblico"
    schedule_2_live   = $false
    schedule_3_day    = "Viernes"
    schedule_3_time   = "7:00 PM"
    schedule_3_type   = "Noche de oracion"
    schedule_3_live   = $false
    cta_eyebrow       = "- La iglesia es mas que una pantalla"
    cta_title         = "Conectate con la *comunidad."
    cta_body          = "El stream es el primer paso. La comunidad en linea te permite participar, orar y crecer."
}

# ─────────────────────────────────────────────────────
# 5. oracion
# ─────────────────────────────────────────────────────
New-Col "oracion" "Pagina de Oracion"

foreach ($f in @("hero_eyebrow","hero_title","hero_subtitle","cta_eyebrow","cta_title","cta_body")) { Add-Str "oracion" $f }

Write-Host "  Registro inicial..." -ForegroundColor Gray
Invoke-Dir POST "/items/oracion" @{
    hero_eyebrow  = "Comunidad e Intercesion"
    hero_title    = "Muro de Oracion."
    hero_subtitle = "Comparte tu peticion y deja que la comunidad ore contigo. Cada oracion cuenta."
    cta_eyebrow   = "- Unete a la comunidad"
    cta_title     = "Mas que oraciones."
    cta_body      = "El stream es el primer paso. La comunidad en linea te permite participar, orar y crecer."
}

Write-Host "`nListo! Las 5 colecciones fueron creadas en Directus." -ForegroundColor Green
