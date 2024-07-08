---
permalink: /
title: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

I'm **Juntang Wang**, a student at **Duke Kunshan University (DKU) & Duke University**, majoring in **Applied Math & Computational Science** with a **Computer Science track**. This site showcases my academic journey, professional experiences, research, and personal projects.

---

# Personal Chatbox

This is a chatbox integrated into my personal homepage. You can ask questions, and the bot will answer based on the information about me and my website.

<div class="chatbox" id="chatbox">
    <!-- Chat messages will be displayed here -->
</div>
<input type="text" id="userInput" class="input-box" placeholder="Type a message">
<button onclick="sendMessage()">Send</button>

<script>
    async function sendMessage() {
        const inputBox = document.getElementById('userInput');
        const message = inputBox.value;
        inputBox.value = '';

        // Display user message
        const chatbox = document.getElementById('chatbox');
        chatbox.innerHTML += `<p><strong>You:</strong> ${message}</p>`;

        // Send message to backend
        try {
            const response = await fetch('http://llama.qqgjyx.com/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });
            const data = await response.json();

            // Display response
            chatbox.innerHTML += `<p><strong>Bot:</strong> ${data.reply}</p>`;
        } catch (error) {
            chatbox.innerHTML += `<p><strong>Bot:</strong> Error: ${error.message}</p>`;
        }
    }
</script>

<style>
    /* Add your CSS styling here */
    .chatbox {
        width: 300px;
        height: 400px;
        border: 1px solid #ccc;
        padding: 10px;
        overflow-y: auto;
    }
    .input-box {
        width: 100%;
        padding: 10px;
    }
</style>