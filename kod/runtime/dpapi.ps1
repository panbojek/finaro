$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Security
try {
    $request = [Console]::In.ReadToEnd() | ConvertFrom-Json
    $bytes = [Convert]::FromBase64String($request.data)
    $scope = [Security.Cryptography.DataProtectionScope]::CurrentUser
    $entropy = [Text.Encoding]::UTF8.GetBytes('Finaro/local/v1')
    if ($request.action -eq 'encrypt') { $result = [Security.Cryptography.ProtectedData]::Protect($bytes,$entropy,$scope) }
    elseif ($request.action -eq 'decrypt') { $result = [Security.Cryptography.ProtectedData]::Unprotect($bytes,$entropy,$scope) }
    else { throw 'Invalid action' }
    [Console]::Out.Write([Convert]::ToBase64String($result))
} catch { [Console]::Error.Write('Local protection failed'); exit 1 }
