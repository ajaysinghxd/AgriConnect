/**
 * AgriConnect AI Farming Assistant — Floating Chatbot Widget
 * Requires: config.js, utils.js (optional toast), chatbot.css
 */

const CHAT_HISTORY_KEY =
    "agriconnect_ai_chat_history";

const AI_CHAT_API =
    typeof API_BASE_URL !== "undefined"
        ? `${API_BASE_URL}/ai/chat`
        : "https://agriconnect-backend-3yti.onrender.com/api/ai/chat";

const AI_STATUS_API =
    typeof API_BASE_URL !== "undefined"
        ? `${API_BASE_URL}/ai/status`
        : "https://agriconnect-backend-3yti.onrender.com/api/ai/status";

const QUICK_PROMPTS = [
    "Best crops for monsoon?",
    "Organic fertilizer guide",
    "Drip irrigation tips",
    "Tomato pest control",
    "Tractor rental advice",
    "Soil health basics"
];

const WELCOME_MESSAGE =
    "Welcome to **AgriConnect AI** — your smart farming companion. Ask about crops, soil, irrigation, pests, equipment, or harvest planning.";

/** SVG logo for header & floating button */
const AI_LOGO_SVG = `
<svg class="agri-ai-logo-svg" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <circle cx="24" cy="24" r="22" stroke="url(#agriGrad)" stroke-width="2" fill="rgba(34,197,94,0.12)"/>
  <path d="M24 10v6M24 32v6M10 24h6M32 24h6" stroke="#86efac" stroke-width="2" stroke-linecap="round"/>
  <circle cx="24" cy="24" r="6" fill="url(#agriGrad)"/>
  <path d="M18 28c2 3 10 3 12 0" stroke="#bbf7d0" stroke-width="1.5" stroke-linecap="round"/>
  <defs>
    <linearGradient id="agriGrad" x1="8" y1="8" x2="40" y2="40">
      <stop stop-color="#22c55e"/>
      <stop offset="1" stop-color="#14b8a6"/>
    </linearGradient>
  </defs>
</svg>`;

const AgriChatbot = {

    isOpen: false,
    isLoading: false,
    isOnline: false,
    history: [],
    elements: {},

    init() {

        if (
            document.getElementById(
                "agriconnect-chatbot"
            )
        ) {
            return;
        }

        this.injectWidget();
        this.bindEvents();
        this.loadHistory();
        this.renderMessages();
        this.checkAIStatus();
        this.autoResizeInput();

    },

    injectWidget() {

        const wrapper =
            document.createElement("div");

        wrapper.id =
            "agriconnect-chatbot";

        wrapper.className =
            "agri-chatbot";

        wrapper.innerHTML = `

            <button
                type="button"
                class="agri-chat-toggle"
                id="agri-chat-toggle"
                aria-label="Open AgriConnect AI assistant"
                aria-expanded="false"
            >
                <span class="agri-chat-toggle-glow"></span>
                <span class="agri-chat-toggle-icon">
                    ${AI_LOGO_SVG}
                </span>
                <span class="agri-chat-toggle-label">AI</span>
            </button>

            <div
                class="agri-chat-panel"
                id="agri-chat-panel"
                role="dialog"
                aria-modal="true"
                aria-label="AgriConnect AI Assistant"
                hidden
            >

                <div class="agri-chat-panel-glow"></div>

                <header class="agri-chat-header">

                    <div class="agri-chat-header-info">

                        <div class="agri-chat-avatar agri-chat-avatar--animated">
                            ${AI_LOGO_SVG}
                            <span class="agri-chat-status-dot" id="agri-chat-status-dot" title="Checking status"></span>
                        </div>

                        <div>
                            <h3>AgriConnect AI</h3>
                            <p id="agri-chat-status-text">Farming Assistant</p>
                        </div>

                    </div>

                    <div class="agri-chat-header-actions">

                        <button type="button" class="agri-chat-icon-btn" id="agri-chat-clear" title="Clear chat" aria-label="Clear chat history">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
                        </button>

                        <button type="button" class="agri-chat-icon-btn agri-chat-icon-btn--close" id="agri-chat-close" aria-label="Close chat">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
                        </button>

                    </div>

                </header>

                <div class="agri-chat-messages" id="agri-chat-messages"></div>

                <div class="agri-chat-prompts" id="agri-chat-prompts"></div>

                <div class="agri-chat-typing" id="agri-chat-typing" hidden>
                    <div class="agri-chat-typing-avatar">${AI_LOGO_SVG}</div>
                    <div class="agri-chat-typing-bubble">
                        <div class="agri-chat-typing-dots"><span></span><span></span><span></span></div>
                        <span>AgriConnect AI is thinking...</span>
                    </div>
                </div>

                <form class="agri-chat-input-area" id="agri-chat-form">
                    <div class="agri-chat-input-wrap">
                        <textarea
                            class="agri-chat-input"
                            id="agri-chat-input"
                            placeholder="Ask about crops, soil, irrigation, pests..."
                            rows="1"
                            maxlength="2000"
                            aria-label="Message"
                        ></textarea>
                    </div>
                    <button type="submit" class="agri-chat-send" id="agri-chat-send" aria-label="Send message">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                    </button>
                </form>

            </div>

        `;

        document.body.appendChild(wrapper);

        this.elements = {
            root: wrapper,
            toggle: document.getElementById("agri-chat-toggle"),
            panel: document.getElementById("agri-chat-panel"),
            messages: document.getElementById("agri-chat-messages"),
            prompts: document.getElementById("agri-chat-prompts"),
            typing: document.getElementById("agri-chat-typing"),
            form: document.getElementById("agri-chat-form"),
            input: document.getElementById("agri-chat-input"),
            send: document.getElementById("agri-chat-send"),
            close: document.getElementById("agri-chat-close"),
            clear: document.getElementById("agri-chat-clear"),
            statusDot: document.getElementById("agri-chat-status-dot"),
            statusText: document.getElementById("agri-chat-status-text")
        };

        this.renderPrompts();

    },

    bindEvents() {

        const { toggle, close, clear, form, input } = this.elements;

        toggle?.addEventListener("click", () => this.toggle());

        close?.addEventListener("click", () => this.close());

        clear?.addEventListener("click", () => this.clearHistory());

        form?.addEventListener("submit", (e) => {
            e.preventDefault();
            this.sendMessage(input.value);
        });

        input?.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                form.requestSubmit();
            }
        });

        input?.addEventListener("input", () => this.autoResizeInput());

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && this.isOpen) this.close();
        });

    },

    autoResizeInput() {

        const { input } = this.elements;

        if (!input) return;

        input.style.height = "auto";
        input.style.height = `${Math.min(input.scrollHeight, 120)}px`;

    },

    async checkAIStatus() {

        try {

            const controller =
                new AbortController();

            const timeoutId =
                setTimeout(
                    () => controller.abort(),
                    8000
                );

            const res =
                await fetch(
                    AI_STATUS_API,
                    {
                        signal:
                            controller.signal
                    }
                );

            clearTimeout(timeoutId);

            const data =
                await res.json();

            this.isOnline =
                data.configured === true ||
                data.online === true;

            this.updateStatusUI();

        }

        catch (error) {

            console.warn(
                "[Chatbot] Status check failed",
                error?.message
            );

            this.isOnline = false;
            this.updateStatusUI();

        }

    },

    updateStatusUI() {

        const { statusDot, statusText } = this.elements;

        if (statusDot) {
            statusDot.classList.toggle("is-online", this.isOnline);
            statusDot.classList.toggle("is-offline", !this.isOnline);
        }

        if (statusText) {
            statusText.textContent = this.isOnline
                ? "Online · Ready to help"
                : "Offline · Check API key";
        }

    },

    renderPrompts() {

        const { prompts } = this.elements;

        if (!prompts) return;

        prompts.innerHTML = QUICK_PROMPTS.map((text) => `
            <button type="button" class="agri-chat-prompt" data-prompt="${this.escapeAttr(text)}">${this.escapeHtml(text)}</button>
        `).join("");

        prompts.querySelectorAll(".agri-chat-prompt").forEach((btn) => {
            btn.addEventListener("click", () => {
                if (!this.isOpen) this.open();
                this.sendMessage(btn.dataset.prompt);
            });
        });

    },

    toggle() {

        this.isOpen ? this.close() : this.open();

    },

    open() {

        this.isOpen = true;
        this.elements.root?.classList.add("is-open");
        this.elements.panel?.removeAttribute("hidden");
        this.elements.toggle?.setAttribute("aria-expanded", "true");
        this.elements.input?.focus();
        this.scrollToBottom();

    },

    close() {

        this.isOpen = false;
        this.elements.root?.classList.remove("is-open");
        this.elements.panel?.setAttribute("hidden", "");
        this.elements.toggle?.setAttribute("aria-expanded", "false");

    },

    loadHistory() {

        try {
            const raw = localStorage.getItem(CHAT_HISTORY_KEY);
            this.history = raw ? JSON.parse(raw) : [];
        } catch {
            this.history = [];
        }

    },

    saveHistory() {

        localStorage.setItem(
            CHAT_HISTORY_KEY,
            JSON.stringify(this.history.slice(-50))
        );

    },

    clearHistory() {

        if (
            this.history.length &&
            !window.confirm("Clear all chat history?")
        ) {
            return;
        }

        this.history = [];
        this.saveHistory();
        this.renderMessages();
        this.notify("Chat cleared", "info");

    },

    renderMessages() {

        const { messages } = this.elements;

        if (!messages) return;

        if (!this.history.length) {

            messages.innerHTML = `
                <div class="agri-chat-welcome agri-chat-welcome--animate">
                    <div class="agri-chat-welcome-icon">${AI_LOGO_SVG}</div>
                    <div class="agri-chat-message agri-chat-message--assistant agri-chat-message--welcome">
                        <div class="agri-chat-bubble-content">${this.formatMarkdown(WELCOME_MESSAGE)}</div>
                    </div>
                </div>
            `;

            return;

        }

        messages.innerHTML = this.history.map((msg) => {
            const isUser = msg.role === "user";
            return `
                <div class="agri-chat-row agri-chat-row--${isUser ? "user" : "assistant"}">
                    ${!isUser ? `<div class="agri-chat-row-avatar">${AI_LOGO_SVG}</div>` : ""}
                    <div class="agri-chat-message agri-chat-message--${isUser ? "user" : "assistant"}">
                        <div class="agri-chat-bubble-content">${isUser ? this.escapeHtml(msg.text) : this.formatMarkdown(msg.text)}</div>
                        <time class="agri-chat-time">${this.formatTime(msg.time)}</time>
                    </div>
                </div>
            `;
        }).join("");

        this.scrollToBottom();

    },

    appendMessage(role, text) {

        this.history.push({
            role,
            text,
            time: Date.now()
        });

        this.saveHistory();
        this.renderMessages();

    },

    scrollToBottom() {

        const { messages } = this.elements;

        if (messages) {
            requestAnimationFrame(() => {
                messages.scrollTop = messages.scrollHeight;
            });
        }

    },

    setLoading(loading) {

        this.isLoading = loading;

        if (this.elements.typing) {
            this.elements.typing.hidden = !loading;
        }

        if (this.elements.send) {
            this.elements.send.disabled = loading;
        }

        if (this.elements.input) {
            this.elements.input.disabled = loading;
        }

        this.elements.root?.classList.toggle("is-loading", loading);

        if (loading) this.scrollToBottom();

    },

    async sendMessage(text) {

        const message = String(text || "").trim();

        if (!message || this.isLoading) return;

        this.elements.input.value = "";
        this.autoResizeInput();

        if (!this.isOpen) this.open();

        this.appendMessage("user", message);
        this.setLoading(true);

        try {

            const apiHistory = this.history
                .slice(0, -1)
                .map((m) => ({
                    role: m.role,
                    text: m.text
                }));

            const controller =
                new AbortController();

            const timeoutId =
                setTimeout(
                    () => controller.abort(),
                    50000
                );

            const response =
                await fetch(
                    AI_CHAT_API,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify({
                            message,
                            history: apiHistory
                        }),
                        signal:
                            controller.signal
                    }
                );

            clearTimeout(timeoutId);

            const data =
                await response.json();

            if (
                !response.ok ||
                !data.success
            ) {
                throw new Error(
                    data.message ||
                    "AI request failed"
                );
            }

            const replyText =
                data.reply ||
                data.response;

            if (
                !replyText
            ) {
                throw new Error(
                    "Empty reply from server"
                );
            }

            this.appendMessage(
                "assistant",
                replyText
            );
            this.isOnline = true;
            this.updateStatusUI();

        }

        catch (error) {

            console.error("[Chatbot]", error);

            this.appendMessage(
                "assistant",
                `I couldn't complete that request.\n\n**Error:** ${error.message || "Please try again."}`
            );

            this.notify(error.message || "AI unavailable", "error");

        }

        finally {

            this.setLoading(false);

        }

    },

    formatTime(ts) {

        if (!ts) return "";

        return new Date(ts).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

    },

    formatMarkdown(text) {

        let html = this.escapeHtml(text);

        html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
        html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
        html = html.replace(/^### (.+)$/gm, "<h4>$1</h4>");
        html = html.replace(/^## (.+)$/gm, "<h4>$1</h4>");
        html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
        html = html.replace(/(<li>[\s\S]*?<\/li>)+/g, (m) => `<ul>${m}</ul>`);
        html = html.replace(/\n/g, "<br>");

        return html;

    },

    notify(message, type) {

        if (typeof showToast === "function") {
            showToast(message, type);
        }

    },

    escapeHtml(value) {

        const div = document.createElement("div");
        div.textContent = value ?? "";
        return div.innerHTML;

    },

    escapeAttr(value) {

        return this.escapeHtml(value).replace(/"/g, "&quot;");

    }

};

function initAgriChatbot() {
    AgriChatbot.init();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAgriChatbot);
} else {
    initAgriChatbot();
}

window.AgriChatbot = AgriChatbot;
