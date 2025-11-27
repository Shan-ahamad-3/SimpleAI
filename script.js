// Basic chat behavior for the Simple Chat demo
const messagesEl = document.getElementById('messages');
const form = document.getElementById('composer');
const input = document.getElementById('input');
const micBtn = document.getElementById('mic-btn'); 

// --- VOICE LOGIC VARIABLES ---
let isRecording = false; 

function appendMessage(text, from = 'bot'){
    const wrap = document.createElement('div');
    wrap.className = 'msg ' + (from === 'user' ? 'user' : 'bot');

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = from === 'user' ? 'You' : 'Bot';

    const body = document.createElement('div');
    body.textContent = text;

    wrap.appendChild(meta);
    wrap.appendChild(body);
    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

function showTyping(){
    let typing = document.querySelector('.typing-indicator');
    if(typing) return typing;
    typing = document.createElement('div');
    typing.className = 'msg bot typing-indicator';
    typing.innerHTML = '<div class="meta">Bot</div><div class="typing">Speaking...</div>'; 
    messagesEl.appendChild(typing);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return typing;
}

function removeTyping(){
    const t = document.querySelector('.typing-indicator');
    if(t) t.remove();
}

// --- FINAL ROBUST FUNCTION ---
async function botReplyWithAudio(userText){
    const replyText = generateReply(userText);
    
    // If the reply is an error message, just display the text immediately
    if (replyText.includes("I didn't catch that")) {
        removeTyping();
        appendMessage(replyText, 'bot');
        return;
    }
    
    showTyping(); 

    const encodedText = encodeURIComponent(replyText);
    const audioUrl = `http://localhost:8000/tts?text=${encodedText}`;
    const audio = new Audio(audioUrl);

    // --- FALLBACK LOGIC ADDED HERE ---
    const displayTextReply = (msg) => {
        removeTyping();
        appendMessage(msg, 'bot');
    };

    // CRITICAL: If the audio fails to load (network/server issue), display text instead.
    audio.onerror = () => {
        console.error("Audio failed to load from API. Displaying text instead.");
        displayTextReply(`[Error: Voice unavailable] ${replyText}`);
    };
    
    // CRITICAL: If the connection is refused, show a warning
    audio.oncanplaythrough = () => {
        // Audio loaded successfully, safe to play
        audio.play();
    };

    // Wait for the audio to finish playing, then display the text
    audio.onended = () => {
        displayTextReply(replyText);
    };

    // If the audio cannot play (e.g., connection refused immediately), display the text.
    setTimeout(() => {
        if (audio.paused && audio.networkState === 3) { // 3 means NETWORK_NO_SOURCE
            audio.onerror(); // Trigger the error path if it failed silently
        }
    }, 2000); // 2-second timeout to check for silent failures
    // --- END FALLBACK LOGIC ---
}

function generateReply(text){
    if(!text || !text.trim()) return "I didn't catch that — please say something.";
    const t = text.toLowerCase();
    if(t.includes('hello')|| t.includes('hi')) return 'Hello! How can I help today?';
    if(t.includes('time')) return `The local time is ${new Date().toLocaleTimeString()}.`;
    if(t.includes('help')) return 'This is a voice-enabled demo. Try asking about the time, saying hello, or sending any message.';
    return `I will now speak your message: "${text}"`;
}


// --- TEMPORARY VOICE INPUT FUNCTION (SIMULATION REMAINS) ---
async function startVoiceInput() {
    const simulatedText = "Hi, what is the current time?"; 
    
    micBtn.textContent = '🔴 Simulating...';
    
    setTimeout(() => {
        micBtn.textContent = '🎙️';
        appendMessage(simulatedText, 'user');
        botReplyWithAudio(simulatedText);
    }, 1000); 
}
// --- END TEMPORARY BRIDGE CODE ---


form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const text = input.value;
    if(!text.trim()) return;
    appendMessage(text, 'user');
    input.value = '';
    input.focus();
    
    // *** CALL NEW FUNCTION HERE ***
    botReplyWithAudio(text);
});


// Event listener for the mic button
micBtn.addEventListener('click', startVoiceInput);


// Keyboard shortcut: Ctrl+K focuses input
document.addEventListener('keydown', (e)=>{
    if((e.ctrlKey||e.metaKey) && e.key.toLowerCase() === 'k'){
        e.preventDefault();
        input.focus();
    }
});

// Add a welcome message
appendMessage('Welcome! This chat now speaks to you. Try typing "hello" or "time".', 'bot');