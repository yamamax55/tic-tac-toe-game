// Claude Code Voice Notification System
// This module provides voice notifications for Claude Code execution status

class ClaudeVoiceNotifier {
    constructor() {
        this.enabled = true;
        this.speaker = 1;
        this.speedScale = 1.3;
        this.maxLength = 100;
    }

    // Clean and prepare text for voice synthesis
    cleanText(text) {
        // Remove unnecessary spaces
        let cleaned = text.replace(/\s+/g, ' ').trim();
        
        // Limit to max length
        if (cleaned.length > this.maxLength) {
            cleaned = cleaned.substring(0, this.maxLength - 3) + '...';
        }

        return cleaned;
    }

    // Send voice notification
    async notify(message) {
        if (!this.enabled) return;

        const cleanedMessage = this.cleanText(message);
        
        try {
            // Try to call PowerShell script for voice notification
            const response = await fetch('/api/voice-notify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: cleanedMessage,
                    speaker: this.speaker,
                    speedScale: this.speedScale
                })
            });

            if (!response.ok) {
                throw new Error('Voice API not available');
            }

            console.log(`🔊 Voice: ${cleanedMessage}`);
        } catch (error) {
            // Fallback to console logging with visual indicator
            console.log(`🔊 VOICE: ${cleanedMessage}`);
            
            // Try Web Speech API if available
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(cleanedMessage);
                utterance.rate = 1.5;
                utterance.lang = 'ja-JP';
                speechSynthesis.speak(utterance);
            }
        }
    }

    // Specific notification methods for different events
    taskStarted(taskName) {
        this.notify(`${taskName}を開始します`);
    }

    taskProgress(message) {
        this.notify(message);
    }

    taskCompleted(taskName) {
        this.notify(`${taskName}完了です`);
    }

    commandReceived() {
        this.notify('了解です');
    }

    investigating() {
        this.notify('調査中です');
    }

    modifying() {
        this.notify('修正中です');
    }

    halfComplete() {
        this.notify('半分完了です');
    }

    almostDone() {
        this.notify('もう少しです');
    }

    allCompleted() {
        this.notify('すべて完了しました');
    }

    error(message) {
        this.notify(`エラーが発生しました: ${message}`);
    }

    // Toggle voice notifications
    toggle() {
        this.enabled = !this.enabled;
        this.notify(this.enabled ? '音声通知をオンにしました' : '音声通知をオフにしました');
        return this.enabled;
    }

    // Enable/disable voice notifications
    setEnabled(enabled) {
        this.enabled = enabled;
        if (enabled) {
            this.notify('音声通知を有効にしました');
        }
    }
}

// Global instance
window.claudeVoice = new ClaudeVoiceNotifier();

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClaudeVoiceNotifier;
}