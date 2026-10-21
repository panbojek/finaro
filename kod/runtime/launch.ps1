$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Windows.Forms
function Test-FinaroReady {
    try {
        $response = Invoke-WebRequest -UseBasicParsing -Uri 'http://127.0.0.1:47832' -TimeoutSec 2
        return ($response.StatusCode -eq 200 -and $response.Content.Contains('name="finaro-profile" content="demo-v1"'))
    } catch { $Error.Clear(); return $false }
}
$startMutex = $null
$ownsMutex = $false
try {
    # Serialize double clicks; readiness comes from HTTP, never redirected log files.
    $startMutex = New-Object Threading.Mutex($false, 'Local\FinaroDemo.Start.v1')
    try { $ownsMutex = $startMutex.WaitOne(15000) }
    catch [Threading.AbandonedMutexException] { $ownsMutex = $true }
    if (!$ownsMutex) { throw 'Finaro jeszcze sie uruchamia. Sprobuj ponownie za chwile.' }
    if (Test-FinaroReady) {
        Start-Process 'http://127.0.0.1:47832'
    } else {
        $nodeCommand = Get-Command node.exe -ErrorAction SilentlyContinue
        if (!$nodeCommand) { throw 'Zainstaluj Node.js 24 LTS z nodejs.org, zamknij i otworz ponownie Eksplorator, a nastepnie ponow uruchomienie.' }
        $node = $nodeCommand.Source
        $runtimeDir = Join-Path $env:LOCALAPPDATA 'FinaroDemo\demo-v1'
        [void](New-Item -ItemType Directory -Path $runtimeDir -Force)
        $runId = [guid]::NewGuid().ToString('N')
        $outLog = Join-Path $runtimeDir ('startup-' + $runId + '.log')
        $errLog = Join-Path $runtimeDir ('startup-error-' + $runId + '.log')
        $server = Join-Path $PSScriptRoot 'server.mjs'
        $process = Start-Process -FilePath $node -ArgumentList @('"' + $server + '"') -WindowStyle Hidden -PassThru -RedirectStandardOutput $outLog -RedirectStandardError $errLog
        $ready = $false
        for ($i=0; $i -lt 60; $i++) {
            Start-Sleep -Milliseconds 250
            if (Test-FinaroReady) { $ready=$true; break }
            $process.Refresh()
            if ($process.HasExited) { throw 'Proces Finaro zakonczyl sie przed otwarciem strony. Przekaz ten komunikat do sprawdzenia.' }
        }
        if (!$ready) { throw 'Finaro nie odpowiada jeszcze pod adresem lokalnym. Sprobuj ponownie za chwile.' }
        Start-Process 'http://127.0.0.1:47832'
    }
} catch {
    [void][Windows.Forms.MessageBox]::Show(('Nie mozna uruchomic Finaro. ' + $_.Exception.Message),'Finaro')
} finally {
    if ($ownsMutex) { $startMutex.ReleaseMutex() }
    if ($startMutex) { $startMutex.Dispose() }
}
