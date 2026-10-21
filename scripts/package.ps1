# Packages public allowlisted files only. No Git history or local project notes.
param([string]$OutPath='')
$ErrorActionPreference='Stop'
$repoRoot=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
if(!$OutPath){$OutPath=Join-Path $repoRoot 'dist\Finaro-demo-github.zip'}
$OutPath=[IO.Path]::GetFullPath($OutPath)
if(Test-Path -LiteralPath $OutPath){throw 'Package already exists. Choose a new output filename.'}
$allow=@('README.md','LICENSE','ASSETS.md','AGENTS.md','CLAUDE.md','CONTRIBUTING.md','package.json','.gitignore','kod','demo','docs','tests','scripts')
$files=@()
foreach($name in $allow){
 $item=Get-Item -LiteralPath (Join-Path $repoRoot $name) -Force
 if($item.PSIsContainer){$files+=Get-ChildItem -LiteralPath $item.FullName -File -Recurse -Force}else{$files+=$item}
}
foreach($file in $files){
 if(!$file.FullName.StartsWith($repoRoot+'\',[StringComparison]::OrdinalIgnoreCase) -or ($file.Attributes -band [IO.FileAttributes]::ReparsePoint)){throw 'Unexpected package path'}
 if($file.Name -match '^\.env|\.(enc|log|tmp|zip)$' -or $file.FullName -match '[\\/](\.git|node_modules|projekt|backups|exports|imports)[\\/]'){throw 'Non-public file blocked'}
}
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
[void][IO.Directory]::CreateDirectory([IO.Path]::GetDirectoryName($OutPath))
$zip=[IO.Compression.ZipFile]::Open($OutPath,[IO.Compression.ZipArchiveMode]::Create)
try{foreach($file in $files){$relative=$file.FullName.Substring($repoRoot.Length+1).Replace('\','/');[void][IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip,$file.FullName,('Finaro-demo/'+$relative),[IO.Compression.CompressionLevel]::Optimal)}}finally{$zip.Dispose()}
$check=[IO.Compression.ZipFile]::OpenRead($OutPath)
try{if($check.Entries.Count -ne $files.Count -or !($check.Entries.FullName -contains 'Finaro-demo/.gitignore')){throw 'Package content check failed'}}finally{$check.Dispose()}
Write-Output ('Package ready: '+$OutPath)
Write-Output ('Files: '+$files.Count)
Write-Output ('SHA256: '+(Get-FileHash -LiteralPath $OutPath -Algorithm SHA256).Hash)
