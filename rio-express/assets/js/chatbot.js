// ====================================================================
// RIOEXPRESS CUSTOMER SERVICE & AI CHATBOT ENGINE
// Developed & Powered by: Bataan Creation
// Developer & Owner: Reynold P. Rio (09365810610 / bataancreation@gmail.com)
// ====================================================================

const RioChatbot = {

  isOpen: false,

  /**
   * 1. INITIALIZE CHATBOT UI WIDGET
   */
  initChatbotUI() {
    if (document.getElementById('rio-chatbot-container')) return;

    const widgetHtml = `
      <div id="rio-chatbot-container" style="position:fixed; bottom:25px; right:20px; z-index:9998; font-family:sans-serif;">
        <!-- Chat Bubble Button -->
        <button id="rio-chatbot-toggle-btn" onclick="RioChatbot.toggleChatbot()" style="background:linear-gradient(135deg, #E53935, #D32F2F); color:#FFF; border:none; width:60px; height:60px; border-radius:50%; box-shadow:0 10px 25px rgba(229,57,53,0.5); cursor:pointer; font-size:24px; display:flex; justify-content:center; align-items:center; transition:transform 0.2s;">
          💬
        </button>

        <!-- Chat Window Terminal -->
        <div id="rio-chatbot-window" style="display:none; position:absolute; bottom:75px; right:0; width:340px; height:460px; background:#0F172A; border:1px solid rgba(255,255,255,0.1); border-radius:16px; box-shadow:0 20px 40px rgba(0,0,0,0.6); flex-direction:column; overflow:hidden;">
          <!-- Header -->
          <div style="background:#0A1128; padding:15px; border-bottom:1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between; align-items:center;">
            <div>
              <h4 style="color:#FFD700; margin:0; font-size:14px; font-weight:bold;">RioExpress Customer Care</h4>
              <span style="color:#94A3B8; font-size:11px;">Powered by Bataan Creation</span>
            </div>
            <button onclick="RioChatbot.toggleChatbot()" style="background:none; border:none; color:#FFF; font-size:18px; cursor:pointer;">✕</button>
          </div>

          <!-- Messages Body -->
          <div id="rio-chatbot-messages" style="flex:1; padding:15px; overflow-y:auto; display:flex; flex-direction:column; gap:10px; font-size:13px; color:#CBD5E1;">
            <div style="background:rgba(255,255,255,0.05); padding:10px 14px; border-radius:12px; max-width:85%;">
              Hello! I am your RioExpress Assistant. How can I help you in Morong today?
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div style="padding:10px; background:#0A1128; border-top:1px solid rgba(255,255,255,0.05); display:flex; gap:5px; flex-wrap:wrap;">
            <button onclick="RioChatbot.handleQuickOption('TRACK')" style="background:rgba(255,255,255,0.1); color:#FFF; border:none; padding:6px 10px; border-radius:6px; font-size:11px; cursor:pointer;">📦 Track Order</button>
            <button onclick="RioChatbot.handleQuickOption('COMPLAINT')" style="background:rgba(229,57,53,0.2); color:#FF8A80; border:1px solid #E53935; padding:6px 10px; border-radius:6px; font-size:11px; cursor:pointer;">🚨 Report Issue</button>
            <button onclick="RioChatbot.handleQuickOption('DOWNPAYMENT')" style="background:rgba(255,215,0,0.1); color:#FFD700; border:1px solid #FFD700; padding:6px 10px; border-radius:6px; font-size:11px; cursor:pointer;">💳 GCash Info</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', widgetHtml);
  },

  /**
   * 2. TOGGLE CHATBOT WINDOW VISIBILITY
   */
  toggleChatbot() {
    this.isOpen = !this.isOpen;
    const windowEl = document.getElementById('rio-chatbot-window');
    if (windowEl) {
      windowEl.style.display = this.isOpen ? 'flex' : 'none';
    }
  },

  /**
   * 3. HANDLE QUICK PRESET OPTIONS
   */
  handleQuickOption(type) {
    const messagesEl = document.getElementById('rio-chatbot-messages');
    if (!messagesEl) return;

    let response = '';

    if (type === 'TRACK') {
      response = "To track your active order, please go to your Active Orders tab in the Customer Dashboard. You will see live GPS movement and your 4-digit Delivery OTP.";
    } else if (type === 'COMPLAINT') {
      response = "To report a damaged item or issue, please contact Bataan Creation Admin directly at 09365810610. You can also file a ticket with photo proof.";
    } else if (type === 'DOWNPAYMENT') {
      response = "Official GCash Downpayment Wallet:\n• Number: 09365810610\n• Name: Reynold P. / Bataan Creation\n\nSend 50% deposit for orders >= ₱500 or routes >= 8KM.";
    }

    messagesEl.innerHTML += `
      <div style="background:linear-gradient(135deg, #E53935, #D32F2F); color:#FFF; padding:10px 14px; border-radius:12px; align-self:flex-end; max-width:85%; margin-top:5px;">
        Request: ${type}
      </div>
      <div style="background:rgba(255,255,255,0.05); padding:10px 14px; border-radius:12px; max-width:85%; white-space:pre-line;">
        ${response}
      </div>
    `;

    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
};

// Freeze object to prevent external code tampering
Object.freeze(RioChatbot);