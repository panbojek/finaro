param([string]$OutPath='')
$ErrorActionPreference='Stop'
$repoRoot=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
function Read-Git([string[]]$GitArgs) {
 $result = & git -C $repoRoot @GitArgs
 if ($LASTEXITCODE -ne 0) { throw ('Git failed: '+($GitArgs -join ' ')) }
 return ($result -join "`n").Trim()
}
$version=(Get-Content -LiteralPath (Join-Path $repoRoot 'package.json') -Raw | ConvertFrom-Json).version
if($version -notmatch '^\d+\.\d+\.\d+$'){throw 'Invalid release version'}
if(Read-Git @('status','--porcelain','--untracked-files=all')){throw 'Commit all release changes before packaging'}
$commit=Read-Git @('rev-parse','HEAD')
$tag='v'+$version
$tagCommit=Read-Git @('rev-list','-n','1',$tag)
if($tagCommit -ne $commit){throw 'Version tag must point to HEAD'}
$files=(Read-Git @('ls-tree','-r','--name-only',$tag)) -split "`n"
$allow=@('README.md','LICENSE','ASSETS.md','AGENTS.md','CLAUDE.md','CONTRIBUTING.md','package.json','.gitignore','kod','demo','docs','tests','scripts')
foreach($file in $files){
 if(($file -split '/')[0] -notin $allow -or $file -match '(?i)(^|/)(\.git|projekt|dist|node_modules|backups|exports|imports)(/|$)|(^|/)\.env|\.(enc|log|tmp|zip|exe)$'){throw ('Non-public path blocked: '+$file)}
}
if(!$OutPath){$OutPath=Join-Path $repoRoot ('dist\v'+$version+'\Finaro-demo-v'+$version+'.zip')}
$OutPath=[IO.Path]::GetFullPath($OutPath)
$outDir=[IO.Path]::GetDirectoryName($OutPath)
$manifestPath=Join-Path $outDir 'RELEASE.json'
$sumPath=Join-Path $outDir 'SHA256SUMS.txt'
foreach($file in @($OutPath,$manifestPath,$sumPath)){if(Test-Path -LiteralPath $file){throw 'Release output already exists; refusing overwrite'}}
[void][IO.Directory]::CreateDirectory($outDir)
& git -C $repoRoot archive --format=zip --prefix=Finaro-demo/ ('--output='+$OutPath) $tag
if($LASTEXITCODE -ne 0){throw 'Archive failed'}
$hash=(Get-FileHash -LiteralPath $OutPath -Algorithm SHA256).Hash.ToLowerInvariant()
$utf8=New-Object Text.UTF8Encoding($false)
[IO.File]::WriteAllText($sumPath,($hash+'  '+[IO.Path]::GetFileName($OutPath)+"`n"),$utf8)
$manifest=[ordered]@{version=$version;tag=$tag;commit=$commit;archive=[IO.Path]::GetFileName($OutPath);sha256=$hash;files=$files.Count}
[IO.File]::WriteAllText($manifestPath,(($manifest | ConvertTo-Json)+"`n"),$utf8)
Write-Output ('Release: '+$tag+' | '+$commit)
Write-Output ('Archive: '+$OutPath)
Write-Output ('SHA256: '+$hash)
