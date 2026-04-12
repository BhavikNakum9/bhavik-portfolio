class AIChatWidget {
    constructor() {
        this.isOpen = false;
        this.init();
    }

    init() {
        // Inject Styles
        const style = document.createElement('style');
        style.innerHTML = `
            .ai-chat-btn {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                background: var(--primary-color, #2563eb);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 9999;
                transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            .ai-chat-btn:hover {
                transform: scale(1.1);
            }
            .ai-chat-window {
                position: fixed;
                bottom: 90px;
                right: 20px;
                width: 350px;
                height: 500px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.2);
                display: none;
                flex-direction: column;
                z-index: 9999;
                overflow: hidden;
                animation: slideUp 0.3s ease;
            }
            @keyframes slideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .chat-header {
                background: var(--primary-color, #2563eb);
                color: white;
                padding: 15px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .chat-messages {
                flex: 1;
                padding: 15px;
                overflow-y: auto;
                background: #f8fafc;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .message {
                max-width: 80%;
                padding: 10px 15px;
                border-radius: 12px;
                font-size: 0.9rem;
                line-height: 1.4;
            }
            .msg-bot {
                background: white;
                border: 1px solid #e2e8f0;
                align-self: flex-start;
                border-bottom-left-radius: 2px;
            }
            .msg-user {
                background: var(--primary-color, #2563eb);
                color: white;
                align-self: flex-end;
                border-bottom-right-radius: 2px;
            }
            .chat-input-area {
                padding: 15px;
                border-top: 1px solid #e2e8f0;
                display: flex;
                gap: 10px;
            }
            .chat-input {
                flex: 1;
                padding: 10px;
                border: 1px solid #e2e8f0;
                border-radius: 6px;
                outline: none;
            }
            .chat-send {
                background: var(--primary-color, #2563eb);
                color: white;
                border: none;
                width: 40px;
                border-radius: 6px;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);

        // Inject HTML
        const btn = document.createElement('div');
        btn.className = 'ai-chat-btn';
        btn.innerHTML = '<i class="fas fa-robot"></i>';
        btn.onclick = () => this.toggle();
        document.body.appendChild(btn);

        const win = document.createElement('div');
        win.className = 'ai-chat-window';
        win.id = 'ai-chat-window';
        win.innerHTML = `
            <div class="chat-header">
                <i class="fas fa-robot"></i>
                <div>
                    <h4 style="margin:0; font-size:1rem;">Prime AI Assistant</h4>
                    <small style="opacity:0.8;">Online</small>
                </div>
                <button onclick="window.aiChat.toggle()" style="margin-left:auto; background:none; border:none; color:white; cursor:pointer;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="chat-messages" id="chat-messages">
                <div class="message msg-bot">
                    Hello! I'm your AI assistant. Ask me about property prices, locations, or how to book a visit! 🏠
                </div>
            </div>
            <form class="chat-input-area" onsubmit="window.aiChat.handleSend(event)">
                <input type="text" class="chat-input" id="chat-input" placeholder="Type a message..." required>
                <button type="submit" class="chat-send"><i class="fas fa-paper-plane"></i></button>
            </form>
        `;
        document.body.appendChild(win);
    }

    toggle() {
        this.isOpen = !this.isOpen;
        const win = document.getElementById('ai-chat-window');
        win.style.display = this.isOpen ? 'flex' : 'none';
        if (this.isOpen) document.getElementById('chat-input').focus();
    }

    handleSend(e) {
        e.preventDefault();
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (!text) return;

        this.addMessage(text, 'user');
        input.value = '';

        // Simulate thinking
        const messages = document.getElementById('chat-messages');
        const typing = document.createElement('div');
        typing.className = 'message msg-bot';
        typing.id = 'ai-typing';
        typing.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Thinking...';
        messages.appendChild(typing);
        messages.scrollTop = messages.scrollHeight;

        setTimeout(() => {
            typing.remove();
            const response = this.getAIResponse(text);
            this.addMessage(response, 'bot');
        }, 1000);
    }

    addMessage(text, sender) {
        const messages = document.getElementById('chat-messages');
        const div = document.createElement('div');
        div.className = `message msg-${sender}`;
        div.textContent = text;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    getAIResponse(input) {
        const lower = input.toLowerCase();

        // Greetings
        if (/^(hi|hello|hey|greetings)/.test(lower))
            return "Hello! Welcome to Prime Properties. I can help you with property details, pricing, locations, or comparing options. What are you looking for today?";

        // Specific Property Queries (Regex to catch "price of X" or "details of X")
        const propertyMatch = lower.match(/(price|cost|details|about|info) (?:of|for) (.+)/);
        if (propertyMatch && window.properties) {
            const queryType = propertyMatch[1];
            const searchName = propertyMatch[2];
            const found = window.properties.find(p => p.title.toLowerCase().includes(searchName));

            if (found) {
                if (queryType === 'price' || queryType === 'cost')
                    return `The price of **${found.title}** is ₹${(found.price / 100000).toFixed(1)} Lakhs. It's a ${found.type} in ${found.locality}.`;
                return `**${found.title}** is a ${found.badge} ${found.type} in ${found.address}. It has ${found.beds} BHK, ${found.amenities.join(', ')}. Price: ₹${(found.price / 100000).toFixed(1)} Lakhs.`;
            }
        }

        // General Category Queries
        if (lower.includes('villa'))
            return "We have some stunning villas! Check out 'Prestige Villa' in Whitefield or 'Palm Grove' in Goa. You can filter by 'Villa' in the properties section.";

        if (lower.includes('apartment') || lower.includes('flat'))
            return "Looking for an apartment? 'Elite Residency' in Delhi and 'Ocean View' in Mumbai are top choices. Use the filter to see more!";

        if (lower.includes('price') || lower.includes('budget'))
            return "Our properties range from ₹50 Lakhs to ₹5 Crores. You can use the 'Budget' filter to find a home that fits your finances.";

        if (lower.includes('location') || lower.includes('city'))
            return "We are present in major cities like Delhi, Mumbai, Bangalore, Hyderabad, and Goa. Which city do you prefer?";

        if (lower.includes('compare'))
            return "You can compare up to 4 properties! Just click the 'Compare' button on any property card to see them side-by-side.";

        if (lower.includes('best') || lower.includes('suggest'))
            return "I can suggest the best property for you based on our 'Value Score' algorithm. Try adding a few properties to comparison and I'll highlight the winner!";

        if (lower.includes('contact') || lower.includes('support'))
            return "You can reach our premium support at +91 98765 43210 or email support@prime.in.";

        // Default Fallback
        return "I'm not sure about that specific detail. You can ask me about prices, specific properties (e.g., 'price of Elite'), or locations!";
    }
}

// Initialize
window.aiChat = new AIChatWidget();
