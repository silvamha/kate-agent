// DOM Elements
const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-btn');
const clearChatButton = document.getElementById('clear-chat-btn');
const deleteAllButton = document.getElementById('delete-all-btn');

// Event Listeners
sendButton.addEventListener('click', handleSend);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
});
clearChatButton.addEventListener('click', clearChat);
deleteAllButton.addEventListener('click', deleteAll);

// Handle sending messages
async function handleSend() {
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage(message, 'user');
    userInput.value = '';

    try {
        const response = await fetch('/.netlify/functions/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });

        const data = await response.json();
        
        if (response.ok) {
            addMessage(data.response, 'assistant');
        } else {
            addMessage('Sorry, I encountered an error. Please try again.', 'assistant');
        }
    } catch (error) {
        console.error('Error:', error);
        addMessage('Sorry, I encountered an error. Please try again.', 'assistant');
    }
}

// Add a message to the chat
function addMessage(content, role) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${role}-message`);
    messageDiv.textContent = content;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Clear the chat messages
function clearChat() {
    messagesDiv.innerHTML = '';
}

// Delete all chat history
function deleteAll() {
    if (confirm('Are you sure you want to delete all chat history?')) {
        clearChat();
    }
}
