const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  const userMessage = input.value.trim();
  if (!userMessage) return;
  appendMessage('user', userMessage);
  input.value = '';
  const thinkingMsg = appendMessage('bot', 'Gemini is thinking...');

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await res.json();

    thinkingMsg.remove();
    if (res.ok) {
      appendMessage('bot', data.reply || data.output || 'No response from Gemini.');
    } else {
      appendMessage('bot', 'Error: ' + data.error);
    }
  } catch (error) {
    thinkingMsg.remove();
    appendMessage('bot', 'Network error: ' + error.message);
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  if (sender === 'bot') {
    msg.innerHTML = marked.parse(text); 
  } else {
    msg.textContent = text;
  }
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;

}