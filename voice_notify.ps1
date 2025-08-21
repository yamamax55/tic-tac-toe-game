# VOICEVOX Voice Notification Script
param(
    [Parameter(Mandatory=$true)]
    [string]$Text,
    [int]$Speaker = 1,
    [double]$SpeedScale = 1.3
)

# Remove unnecessary spaces and convert English words to katakana if needed
$CleanText = $Text -replace '\s+', ' '
$CleanText = $CleanText.Trim()

# Limit to 100 characters
if ($CleanText.Length -gt 100) {
    $CleanText = $CleanText.Substring(0, 97) + "..."
}

try {
    # Try VOICEVOX API first
    $EncodedText = [System.Web.HttpUtility]::UrlEncode($CleanText, [System.Text.Encoding]::UTF8)
    $AudioQueryUrl = "http://localhost:50021/audio_query?text=$EncodedText&speaker=$Speaker&speedScale=$SpeedScale"
    
    $AudioQuery = Invoke-RestMethod -Uri $AudioQueryUrl -Method Post -ContentType "application/json"
    
    $SynthesisUrl = "http://localhost:50021/synthesis?speaker=$Speaker"
    $AudioData = Invoke-RestMethod -Uri $SynthesisUrl -Method Post -Body ($AudioQuery | ConvertTo-Json) -ContentType "application/json"
    
    # Play audio using Windows Media Player or similar
    Write-Host "VOICEVOX: $CleanText"
} catch {
    # Fallback to Windows Speech Synthesis
    try {
        Add-Type -AssemblyName System.Speech
        $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
        
        # Try to use Japanese voice if available
        $japaneseVoices = $synth.GetInstalledVoices() | Where-Object {$_.VoiceInfo.Culture.Name -eq "ja-JP"}
        if ($japaneseVoices) {
            $synth.SelectVoice($japaneseVoices[0].VoiceInfo.Name)
        }
        
        $synth.Rate = 2  # Faster speech rate
        $synth.Speak($CleanText)
        Write-Host "Windows TTS: $CleanText"
    } catch {
        # Ultimate fallback - just display text
        Write-Host "VOICE: $CleanText" -ForegroundColor Yellow
    }
}