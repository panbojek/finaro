# Compatibility entry point: package only a clean, tagged Git release.
param([string]$OutPath='')
$ErrorActionPreference='Stop'
& (Join-Path $PSScriptRoot 'release.ps1') -OutPath $OutPath
