/**
* ChatBot - UI
**/

class ChatBot {

	constructor(){
		this.userMessage;
		this.API_KEY = "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";
		this.API_URL = "https://api.openai.com/v1/chat/completions";
		this.init();
		this.sendChatBtn.addEventListener("click", this.handleChat);
		this.chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
		this.chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
	}
	
	init = () => {
		this.chatInput = document.querySelector(".chat-input textarea");
		this.sendChatBtn = document.querySelector(".chat-input span");
		this.chatbox = document.querySelector(".chatbox");
		this.chatbotToggler = document.querySelector(".chatbot-toggler");
		this.chatbotCloseBtn = document.querySelector(".close-btn");
	}
	
	createChatLi = (message, className) => {
		// Create a chat <li> element with passed message and className
		const chatLi = document.createElement("li");
		chatLi.classList.add("chat", className);
		let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
		chatLi.innerHTML = chatContent;
		chatLi.querySelector("p").textContent = message;
		return chatLi;
	}

	generateResponse = (incomingChatLi) => {
		const messageElement = incomingChatLi.querySelector("p");
		const requestOptions = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization" : `Bearer ${this.API_KEY}`
			},
			body: JSON.stringify({
				model: "gpt-3.5-turbo",
				message: [{role: "user", content: userMessage}]
			})
		};
		
		fetch(this.API_URL, requestOptions).then(res => res.json()).then(data => {
			messageElement.textContent = data.choices[0].message.content;
		}).catch((error) => {
			messageElement.classList.add("error");
			messageElement.textContent = "Oops! Something went wrong. Please try again.";
		}).finally(() => this.chatbox.scrollTo(0, this.chatbox.scrollHeight));
	}

	handleChat = () => {
		userMessage = this.chatInput.value.trim();
		if(!userMessage) return;
		this.chatInput.value = "";
		this.chatInput.style.height = `${inputInitHeight}px`;
		
		// Append the user's message to the chatbox
		this.chatbox.appendChild(createChatLi(userMessage, "outgoing"));
		this.chatbox.scrollTo(0, chatbox.scrollHeight);
		
		setTimeout(() => {
			// Display "Thinking.." message while waiting for the response
			const incomingChatLi = this.createChatLi("Thinking..", "incoming");
			this.chatbox.appendChild(incomingChatLi);
			this.chatbox.scrollTo(0, this.chatbox.scrollHeight);
			this.generateResponse(incomingChatLi);
		}, 600);
	}
}

export default ChatBot;