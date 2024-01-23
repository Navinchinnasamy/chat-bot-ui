const chatBotUi = {
    chatInput: null,
    sendChatBtn: null,
    chatbox: null,
    chatbotToggler: null,
    chatbotCloseBtn: null,
    userMessage: null,
    API_KEY: "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",
    inputInitHeight: 0,

    init: function () {
        this.loadStylesheet();
    },
    loadStylesheet: function () {
        const linkElement = document.createElement("link");
        linkElement.rel = "stylesheet";
        linkElement.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0";
        linkElement.onload = this.createUIComponents();
        document.head.appendChild(linkElement);
    },
    createUIComponents: function () {
        const bodyElem = document.querySelector("body");
        let chatContainer = document.createElement("div");
        chatContainer.id = "chatbot-container";
        const toggleBtn = this.createChatToggleBtn();
        chatContainer.appendChild(toggleBtn);
        const chatBot = this.createChatBot();
        chatContainer.appendChild(chatBot);
        bodyElem.appendChild(chatContainer);
        this.chatbotToggler = document.querySelector(".chatbot-toggler");
        this.chatbotToggler.addEventListener("click", () => {
            document.body.classList.toggle("show-chatbot");
            this.bindListenersToElements();
        });
    },
    createChatToggleBtn: function () {
        let chatToggleBtn = document.createElement("button");
        chatToggleBtn.className = "chatbot-toggler";
        let spanTag1 = document.createElement("span");
        spanTag1.className = "material-symbols-outlined";
        spanTag1.textContent = "mode_comment";
        let spanTag2 = document.createElement("span");
        spanTag2.className = "material-symbols-outlined";
        spanTag2.textContent = "close";
        chatToggleBtn.appendChild(spanTag1);
        chatToggleBtn.appendChild(spanTag2);
        return chatToggleBtn;
    },
    createChatBot: function () {
        let chatBot = document.createElement("div");
        chatBot.className = "chatbot";
        
        let chatHeader = document.createElement("header");
        let h2 = document.createElement("h2");
        h2.textContent = "ChatBot";
        let closeBtn = document.createElement("span");
        closeBtn.className = "close-btn material-symbols-outlined";
        closeBtn.textContent = "close";
        chatHeader.appendChild(h2);
        chatHeader.appendChild(closeBtn);
        
        let chatBox = document.createElement("ul");
        chatBox.className = "chatbox";
        let chatItem = document.createElement("li");
        chatItem.className = "chat incoming";
        let smartToySpan = document.createElement("span");
        smartToySpan.className = "material-symbols-outlined";
        smartToySpan.textContent = "smart_toy";
        let p = document.createElement("p");
        p.textContent = "Hai there, How was the day?";
        chatItem.appendChild(smartToySpan);
        chatItem.appendChild(p);
        chatBox.appendChild(chatItem);
        
        let chatInput = document.createElement("div");
        chatInput.className = "chat-input";
        let textarea = document.createElement("textarea");
        textarea.placeholder = "Enter a message..";
        textarea.required = true;
        let sendBtn = document.createElement("span");
        sendBtn.id = "send-btn";
        sendBtn.className = "material-symbols-outlined";
        sendBtn.textContent = "send";
        chatInput.appendChild(textarea);
        chatInput.appendChild(sendBtn);
        
        chatBot.appendChild(chatHeader);
        chatBot.appendChild(chatBox);
        chatBot.appendChild(chatInput);
        
        return chatBot;
    },
    bindListenersToElements: function () {
        this.chatInput = document.querySelector(".chat-input textarea");
        this.sendChatBtn = document.querySelector(".chat-input span");
        this.chatbox = document.querySelector(".chatbox");
        this.chatbotCloseBtn = document.querySelector(".close-btn");
        this.inputInitHeight = this.chatInput.scrollHeight;

        this.chatInput.addEventListener("input", () => {
            this.chatInput.style.height = `${this.inputInitHeight}px`;
            this.chatInput.style.height = `${this.chatInput.scrollHeight}px`;
        });
        this.chatInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
                e.preventDefault();
                this.handleChat();
            }
        });
        this.sendChatBtn.addEventListener("click", () => this.handleChat());
        this.chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
    },
    createChatLi: function (message, className) {
        const chatLi = document.createElement("li");
        chatLi.classList.add("chat", className);
        let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
        chatLi.innerHTML = chatContent;
        chatLi.querySelector("p").textContent = message;
        return chatLi;
    },
    generateResponse: async function (incomingChatLi) {
        const messageElement = incomingChatLi.querySelector("p");
        const API_URL = "https://api.openai.com/v1/chat/completions";
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                message: [{ role: "user", content: this.userMessage }]
            })
        };
        await this.apiCall(API_URL, requestOptions).then(data => {
            messageElement.textContent = data.choices[0].message.content;
        }).catch((error) => {
            messageElement.classList.add("error");
            messageElement.textContent = "Oops! Something went wrong. Please try again.";
        }).finally(() => this.chatbox.scrollTo(0, this.chatbox.scrollHeight));
    },
    apiCall: async function (url, requestOptions) {
        try {
            let resp = await fetch(url, requestOptions);
            return await resp.json();
        } catch (error) {
            console.log("Error >>> ", error);
            throw error;
        }
    },
    handleChat: function () {
        this.userMessage = this.chatInput.value.trim();
        if (!this.userMessage) return;
        this.chatInput.value = "";
        this.chatInput.style.height = `${this.inputInitHeight}px`;

        // Append the user's message to the chatbox
        this.chatbox.appendChild(this.createChatLi(this.userMessage, "outgoing"));
        this.chatbox.scrollTo(0, this.chatbox.scrollHeight);

        setTimeout(() => {
            // Display "Thinking.." message while waiting for the response
            const incomingChatLi = this.createChatLi("Thinking..", "incoming");
            this.chatbox.appendChild(incomingChatLi);
            this.chatbox.scrollTo(0, this.chatbox.scrollHeight);
            this.generateResponse(incomingChatLi);
        }, 600);
    }
};


window.chatBotUi = chatBotUi;