// Basic chat behavior for the Simple Chat demo
const messagesEl = document.getElementById('messages');
const form = document.getElementById('composer');
const input = document.getElementById('input');
const micBtn = document.getElementById('mic-btn'); // REFERENCE TO NEW MIC BUTTON

// --- VOICE LOGIC VARIABLES (Simplified for simulation) ---
let isRecording = false; 
// const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; // REMOVED FOR NOW

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
  typing.innerHTML = '<div class="meta">Bot</div><div class="typing">Typing…</div>';
  messagesEl.appendChild(typing);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return typing;
}

function removeTyping(){
  const t = document.querySelector('.typing-indicator');
  if(t) t.remove();
}

function fakeBotReply(userText){
  // Very small demo: echoes back with a friendly prefix and slight delay
  showTyping();
  const delay = Math.min(1200 + userText.length * 40, 3000);
  return new Promise(resolve => setTimeout(()=>{
    removeTyping();
    const reply = generateReply(userText);
    appendMessage(reply, 'bot');
    resolve(reply);
  }, delay));
}

function generateReply(text){
  if(!text || !text.trim()) return "I didn't catch that — please say something.";
  const t = text.toLowerCase();
  if(t.includes('hello')|| t.includes('hi')) return 'Hello! How can I help today?';
  if(t.includes('time')) return `Local time is ${new Date().toLocaleTimeString()}.`;
  if(t.includes('help')) return 'This is a demo chat. Try asking about the time, say hello, or send any message to see an echo.';
  return `You said: "${text}"`;
}


// --- START OF TEMPORARY BRIDGE CODE (SIMULATION) ---
// This function simulates the Speech-to-Text process
async function startVoiceInput() {
    const simulatedText = "Hi, what is the current time?"; // The hardcoded test phrase
    
    // 1. Simulate recording state change
    micBtn.textContent = '🔴 Simulating...';
    
    // 2. Simulate the delay of transcription
    setTimeout(() => {
        micBtn.textContent = '🎙️'; // Reset button text
        
        // 3. Append the simulated message from the "user"
        appendMessage(simulatedText, 'user');
        
        // 4. Trigger the bot's fake reply using the simulated text
        fakeBotReply(simulatedText);
        
    }, 1000); // 1-second delay for simulation
}
// --- END OF TEMPORARY BRIDGE CODE ---


form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const text = input.value;
  if(!text.trim()) return;
  appendMessage(text, 'user');
  input.value = '';
  input.focus();
  try{
    await fakeBotReply(text);
  }catch(err){
    console.error(err);
    removeTyping();
    appendMessage('Something went wrong.', 'bot');
  }
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
appendMessage('Welcome to Simple Chat — try typing "hello" or "time".', 'bot');