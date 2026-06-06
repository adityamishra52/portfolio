$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$public = Join-Path $root "public"
$logoPath = Join-Path $public "logo.png"
$profilePath = Join-Path $public "Aditaya.png"

function New-RoundedPath {
  param(
    [System.Drawing.Rectangle]$Rectangle,
    [int]$Radius
  )

  $diameter = $Radius * 2
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddArc($Rectangle.X, $Rectangle.Y, $diameter, $diameter, 180, 90)
  $path.AddArc(($Rectangle.Right - $diameter), $Rectangle.Y, $diameter, $diameter, 270, 90)
  $path.AddArc(($Rectangle.Right - $diameter), ($Rectangle.Bottom - $diameter), $diameter, $diameter, 0, 90)
  $path.AddArc($Rectangle.X, ($Rectangle.Bottom - $diameter), $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

function Fill-RoundedRectangle {
  param(
    [System.Drawing.Graphics]$Graphics,
    [System.Drawing.Brush]$Brush,
    [System.Drawing.Rectangle]$Rectangle,
    [int]$Radius
  )

  $path = New-RoundedPath -Rectangle $Rectangle -Radius $Radius
  $Graphics.FillPath($Brush, $path)
  $path.Dispose()
}

function Draw-RoundedRectangle {
  param(
    [System.Drawing.Graphics]$Graphics,
    [System.Drawing.Pen]$Pen,
    [System.Drawing.Rectangle]$Rectangle,
    [int]$Radius
  )

  $path = New-RoundedPath -Rectangle $Rectangle -Radius $Radius
  $Graphics.DrawPath($Pen, $path)
  $path.Dispose()
}

function New-SquarePng {
  param(
    [string]$Source,
    [string]$Destination,
    [int]$Size
  )

  $image = [System.Drawing.Image]::FromFile($Source)
  $square = [Math]::Min($image.Width, $image.Height)
  $sourceX = [int](($image.Width - $square) / 2)
  $sourceY = [int](($image.Height - $square) / 2)
  $bitmap = New-Object System.Drawing.Bitmap $Size, $Size
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.DrawImage($image, (New-Object System.Drawing.Rectangle 0, 0, $Size, $Size), $sourceX, $sourceY, $square, $square, [System.Drawing.GraphicsUnit]::Pixel)
  $bitmap.Save($Destination, [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose()
  $bitmap.Dispose()
  $image.Dispose()
}

function New-FaviconIco {
  param(
    [string]$Source,
    [string]$Destination
  )

  $image = [System.Drawing.Image]::FromFile($Source)
  $bitmap = New-Object System.Drawing.Bitmap 32, 32
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.DrawImage($image, 0, 0, 32, 32)
  $handle = $bitmap.GetHicon()
  $icon = [System.Drawing.Icon]::FromHandle($handle)
  $stream = [System.IO.File]::Create($Destination)
  $icon.Save($stream)
  $stream.Close()
  $graphics.Dispose()
  $bitmap.Dispose()
  $image.Dispose()
}

function New-SocialImage {
  param(
    [string]$Destination,
    [int]$Width,
    [int]$Height
  )

  $bitmap = New-Object System.Drawing.Bitmap $Width, $Height
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

  $backgroundRect = New-Object System.Drawing.Rectangle 0, 0, $Width, $Height
  $background = New-Object System.Drawing.Drawing2D.LinearGradientBrush $backgroundRect, ([System.Drawing.Color]::FromArgb(238, 253, 250)), ([System.Drawing.Color]::FromArgb(255, 238, 246)), 28
  $graphics.FillRectangle($background, $backgroundRect)

  $panelBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(228, 255, 255, 255))
  $outlinePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(100, 20, 184, 166)), 2
  $panel = New-Object System.Drawing.Rectangle 70, 70, ($Width - 140), ($Height - 140)
  Fill-RoundedRectangle -Graphics $graphics -Brush $panelBrush -Rectangle $panel -Radius 34
  Draw-RoundedRectangle -Graphics $graphics -Pen $outlinePen -Rectangle $panel -Radius 34

  $tealBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(20, 184, 166))
  $darkBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(2, 6, 23))
  $mutedBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(71, 85, 105))
  $whiteBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
  $titleFont = New-Object System.Drawing.Font -ArgumentList "Segoe UI", 58, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
  $subtitleFont = New-Object System.Drawing.Font -ArgumentList "Segoe UI", 29, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
  $bodyFont = New-Object System.Drawing.Font -ArgumentList "Segoe UI", 25, ([System.Drawing.FontStyle]::Regular), ([System.Drawing.GraphicsUnit]::Pixel)
  $chipFont = New-Object System.Drawing.Font -ArgumentList "Segoe UI", 22, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)

  $logo = [System.Drawing.Image]::FromFile($logoPath)
  $profile = [System.Drawing.Image]::FromFile($profilePath)
  $graphics.DrawImage($logo, 110, 112, 94, 94)

  $photoRect = New-Object System.Drawing.Rectangle ($Width - 392), 138, 250, 250
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddEllipse($photoRect)
  $oldClip = $graphics.Clip
  $graphics.SetClip($path)
  $graphics.DrawImage($profile, $photoRect)
  $graphics.Clip = $oldClip
  $photoPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::White), 8
  $graphics.DrawEllipse($photoPen, $photoRect)

  $graphics.DrawString("Aditaya Kumar Mishra", $titleFont, $darkBrush, 110, 236)
  $graphics.DrawString("Full Stack Developer", $subtitleFont, $tealBrush, 114, 318)
  $graphics.DrawString("React | Vite | Node.js | MongoDB | SEO | AI Web Apps", $bodyFont, $mutedBrush, 114, 374)

  $chips = @("MERN Stack", "Website Testing", "Google Scholar SEO", "Portfolio Developer")
  $x = 114
  $y = $Height - 170
  foreach ($chip in $chips) {
    $size = $graphics.MeasureString($chip, $chipFont)
    $rect = New-Object System.Drawing.Rectangle $x, $y, ([int]$size.Width + 34), 48
    Fill-RoundedRectangle -Graphics $graphics -Brush $tealBrush -Rectangle $rect -Radius 24
    $graphics.DrawString($chip, $chipFont, $whiteBrush, ($x + 17), ($y + 10))
    $x += [int]$size.Width + 52
  }

  $graphics.DrawString("aditaya-portfolio.vercel.app", $bodyFont, $mutedBrush, 114, ($Height - 116))

  $bitmap.Save($Destination, [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose()
  $bitmap.Dispose()
  $logo.Dispose()
  $profile.Dispose()
}

New-SquarePng -Source $logoPath -Destination (Join-Path $public "favicon-16x16.png") -Size 16
New-SquarePng -Source $logoPath -Destination (Join-Path $public "favicon-32x32.png") -Size 32
New-SquarePng -Source $logoPath -Destination (Join-Path $public "apple-touch-icon.png") -Size 180
New-FaviconIco -Source (Join-Path $public "favicon-32x32.png") -Destination (Join-Path $public "favicon.ico")
New-SocialImage -Destination (Join-Path $public "og-image.png") -Width 1200 -Height 630
New-SocialImage -Destination (Join-Path $public "twitter-image.png") -Width 1200 -Height 675

Write-Host "SEO assets generated."
