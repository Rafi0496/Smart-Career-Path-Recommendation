// "Ask V" - Career Intelligence Controller

let chatMessages = [
  {
    role: "assistant",
    content: "Hello! I am **V**. Ask me any question regarding career pathways, in-demand technical skills, roadmap execution, or salary benchmarks."
  }
];

function toggleAssistant() {
  const drawer = document.getElementById("ai-assistant-drawer");
  if (!drawer) return;
  const isHidden = drawer.classList.contains("hidden");
  if (isHidden) {
    drawer.classList.remove("hidden");
    drawer.classList.add("flex");
    scrollChatToBottom();
    const input = document.getElementById("assistant-input");
    if (input) input.focus();
  } else {
    drawer.classList.add("hidden");
    drawer.classList.remove("flex");
  }
}

function renderMarkdownText(text) {
  if (!text) return "";
  let out = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Code blocks ```...```
  out = out.replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-900 text-slate-100 p-2.5 rounded-lg text-xs font-mono my-2 overflow-x-auto"><code>$1</code></pre>');
  // Inline code `...`
  out = out.replace(/`([^`]+)`/g, '<code class="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-xs font-mono text-primary-600 dark:text-primary-300">$1</code>');
  // Headers ###
  out = out.replace(/^### (.*$)/gim, '<h4 class="font-bold text-sm text-slate-900 dark:text-white mt-2 mb-1">$1</h4>');
  // Bold **...**
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>');
  // Bullet points
  out = out.replace(/^[•*] (.*$)/gim, '<div class="flex items-start gap-1.5 my-0.5"><span class="text-primary-500">•</span><span>$1</span></div>');
  // Line breaks
  out = out.replace(/\n\n/g, '<div class="h-2"></div>').replace(/\n/g, '<br/>');

  return out;
}

function renderChatMessages() {
  const container = document.getElementById("assistant-messages");
  if (!container) return;

  container.innerHTML = chatMessages.map((m) => {
    const isUser = m.role === "user";
    return `
      <div class="flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-3">
        <div class="max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
          isUser
            ? 'bg-primary-600 text-white rounded-tr-xs shadow-sm'
            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-xs shadow-sm'
        }">
          ${isUser ? m.content : renderMarkdownText(m.content)}
        </div>
      </div>
    `;
  }).join("");

  scrollChatToBottom();
}

function scrollChatToBottom() {
  const container = document.getElementById("assistant-messages");
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

async function sendAssistantMessage(customQuery = null) {
  const input = document.getElementById("assistant-input");
  const query = customQuery || (input ? input.value.trim() : "");
  if (!query) return;

  if (input && !customQuery) input.value = "";

  chatMessages.push({ role: "user", content: query });
  renderChatMessages();

  // Show typing indicator
  const container = document.getElementById("assistant-messages");
  const typingId = "assistant-typing-indicator";
  const typingEl = document.createElement("div");
  typingEl.id = typingId;
  typingEl.className = "flex items-center gap-1.5 text-slate-400 text-xs py-1 px-2";
  typingEl.innerHTML = `
    <span class="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse"></span>
    <span class="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" style="animation-delay: 0.2s"></span>
    <span class="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" style="animation-delay: 0.4s"></span>
    <span class="ml-1 text-[11px] font-medium text-slate-500">V is thinking...</span>
  `;
  container.appendChild(typingEl);
  scrollChatToBottom();

  // Context gathering
  const profile = Storage.getProfile();
  const activeCareer = document.body.getAttribute("data-career-title");
  const userName = document.body.getAttribute("data-user-name") || (profile ? profile.name : "Candidate");

  const context = {
    userName: userName,
    currentCareer: activeCareer,
    userProfile: profile
  };

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: chatMessages,
        context: context
      })
    });

    const data = await res.json();
    const typingIndicator = document.getElementById(typingId);
    if (typingIndicator) typingIndicator.remove();

    if (data.content) {
      chatMessages.push({ role: "assistant", content: data.content });
      renderChatMessages();
    } else {
      chatMessages.push({
        role: "assistant",
        content: "I am **V**. Please ask any specific career, roadmap, or technical skill question."
      });
      renderChatMessages();
    }
  } catch (err) {
    const typingIndicator = document.getElementById(typingId);
    if (typingIndicator) typingIndicator.remove();

    chatMessages.push({
      role: "assistant",
      content: "I am **V**. My live neural gateway is currently reconnecting, but you can explore the 140+ curated career blueprints across the platform."
    });
  } finally {
    const el = document.getElementById(typingId);
    if (el) el.remove();
    renderChatMessages();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderChatMessages();

  const form = document.getElementById("assistant-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      sendAssistantMessage();
    });
  }
});
