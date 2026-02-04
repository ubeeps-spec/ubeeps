document.addEventListener('DOMContentLoaded', function() {
    // Create Chat Widget HTML
    const chatWidget = document.createElement('div');
    chatWidget.id = 'ubeeps-chatbot';
    chatWidget.className = 'fixed bottom-6 right-6 z-50 flex flex-col items-end';
    
    // Quick Replies Data
    const quickReplies = [
        { id: 'triage', text: '🔍 智能導診' },
        { id: 'price', text: '治療費用？' },
        { id: 'leave_info', text: '我要留言/諮詢' },
        { id: 'contact', text: '如何聯絡？' }
    ];

    chatWidget.innerHTML = `
        <!-- Chat Window -->
        <div id="chat-window" class="hidden bg-white w-80 h-[500px] rounded-2xl shadow-2xl flex flex-col mb-4 overflow-hidden border border-gray-200 transition-all duration-300 transform origin-bottom-right scale-90 opacity-0">
            <!-- Header -->
            <div class="bg-brand-dark text-white p-4 flex justify-between items-center shadow-md z-10">
                <div class="flex items-center gap-3">
                    <div class="relative">
                        <div class="w-2.5 h-2.5 bg-green-400 rounded-full absolute bottom-0 right-0 border border-brand-dark"></div>
                        <i class="fas fa-robot text-xl"></i>
                    </div>
                    <div>
                        <span class="font-bold block text-sm">Ubeeps 智能助手</span>
                        <span class="text-xs text-gray-300">線上為您服務</span>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <a href="https://wa.me/85263810907" target="_blank" class="text-white hover:text-green-400 transition" title="WhatsApp 聯絡">
                        <i class="fab fa-whatsapp text-lg"></i>
                    </a>
                    <button id="close-chat" class="text-gray-300 hover:text-white focus:outline-none p-1">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            
            <!-- Messages Area -->
            <div id="chat-messages" class="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
                <!-- Bot Welcome Message -->
                <div class="flex items-start animate-fade-in-up">
                    <div class="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xs shadow-md">U</div>
                    <div class="ml-2 bg-white p-3 rounded-lg rounded-tl-none shadow-sm text-sm text-gray-700 border border-gray-100 max-w-[85%] leading-relaxed">
                        您好！我是 Ubeeps 智能助手。<br>很高興為您服務，請問有什麼想了解的嗎？
                    </div>
                </div>
                
                <!-- Quick Actions Container -->
                <div class="ml-10 grid grid-cols-2 gap-2 animate-fade-in-up" style="animation-delay: 0.1s;">
                    ${quickReplies.map(q => `
                        <button class="quick-btn bg-white text-primary border border-primary/30 hover:bg-primary hover:text-white text-xs py-2 px-3 rounded-lg transition shadow-sm text-center" data-q="${q.id}">
                            ${q.text}
                        </button>
                    `).join('')}
                </div>
            </div>
            
            <!-- Input Area -->
            <div class="p-3 bg-white border-t border-gray-100">
                <div class="flex gap-2 items-center bg-gray-100 rounded-full px-4 py-2 border border-transparent focus-within:border-primary focus-within:bg-white transition-colors">
                    <input type="text" id="chat-input" placeholder="輸入訊息..." class="flex-1 bg-transparent text-sm focus:outline-none text-gray-700">
                    <button id="send-btn" class="text-primary hover:text-secondary transition p-1">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Toggle Button -->
        <button id="chat-toggle" class="group w-14 h-14 bg-gradient-to-r from-primary to-secondary hover:from-cyan-600 hover:to-cyan-800 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 z-50">
            <i class="fas fa-comment-dots text-2xl group-hover:animate-pulse"></i>
            <!-- Notification Badge -->
            <span class="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            </span>
        </button>
    `;

    document.body.appendChild(chatWidget);

    // Add simple CSS animation
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.3s ease-out forwards;
        }
    `;
    document.head.appendChild(style);

    // Logic
    const toggleBtn = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const closeBtn = document.getElementById('close-chat');
    const messagesContainer = document.getElementById('chat-messages');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    
    let isOpen = false;
    let chatState = {
        step: null,
        data: {}
    };

    // Load History
    loadHistory();

    // Toggle Chat
    function toggleChat() {
        isOpen = !isOpen;
        if (isOpen) {
            chatWindow.classList.remove('hidden');
            // Small delay to allow display:block to apply before transition
            setTimeout(() => {
                chatWindow.classList.remove('scale-90', 'opacity-0');
                chatWindow.classList.add('scale-100', 'opacity-100');
            }, 10);
            toggleBtn.classList.add('rotate-90', 'opacity-0', 'pointer-events-none');
            
            // Remove notification badge
            const badge = toggleBtn.querySelector('span.flex');
            if (badge) badge.remove();
            
            // Focus input
            setTimeout(() => input.focus(), 300);
        } else {
            chatWindow.classList.remove('scale-100', 'opacity-100');
            chatWindow.classList.add('scale-90', 'opacity-0');
            setTimeout(() => {
                chatWindow.classList.add('hidden');
            }, 300);
            toggleBtn.classList.remove('rotate-90', 'opacity-0', 'pointer-events-none');
        }
    }

    toggleBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    // Knowledge Base
    const responses = {
        'what_is': '幹細胞是人體的「原始建築材料」，具有自我更新和分化成多種細胞（如心肌細胞、神經細胞）的能力。它們能幫助修復受損組織，是再生醫學的核心。',
        'price': '治療費用因個人病況、所需療程次數及技術方案（如 PL11S-TMSC 或免疫細胞治療）而異。建議您點擊網站上的「免費評估方案」或「立即諮詢」按鈕，我們的專家將為您提供詳細報價。',
        'leave_info': '沒問題，請依序回答幾個問題，我們會協助您傳送資料。<br><br>請問怎麼稱呼您？',
        'contact': '您可以透過以下方式聯絡我們：<br>📱 WhatsApp: <a href="https://wa.me/85263810907" target="_blank" class="text-primary underline">+852 6381 0907</a><br>📧 Email: <a href="mailto:ubeeps@gmail.com" class="text-primary underline">ubeeps@gmail.com</a><br>我們會儘快回覆您的需求。',
        'process': '標準諮詢流程如下：<br>1. 線上諮詢與病歷提交<br>2. 專家團隊初步評估<br>3. 視訊/面對面詳細解說<br>4. 制定專屬治療方案<br>5. 安排行程與治療',
        'default': '謝謝您的訊息！目前的對話記錄僅保存在您的瀏覽器中。<br><br>若您希望我們聯絡您，請點擊下方按鈕將諮詢內容寄給我們：<br><a href="mailto:ubeeps@gmail.com?subject=諮詢&body=請在此輸入您的問題..." class="inline-block mt-2 bg-primary text-white px-3 py-1 rounded text-xs hover:bg-secondary">📧 寄送諮詢信件</a>'
    };

    // Decision Tree Data
    const decisionTree = {
        'triage': {
            text: '請問您主要想改善哪方面的健康問題？',
            options: [
                { text: '💉 糖尿病', next: 'triage_diabetes' },
                { text: '❤️ 心臟血管', next: 'triage_heart' },
                { text: '🦴 關節/骨科', next: 'triage_joints' },
                { text: '🛡️ 免疫/抗衰', next: 'triage_immune' }
            ]
        },
        'triage_diabetes': {
            text: '針對糖尿病，我們採用專利幹細胞技術修復胰島 β 細胞，目標是減少或擺脫胰島素依賴。<br><br>您想了解：',
            options: [
                { text: '📖 閱讀康復案例', action: 'link', url: 'news_diabetes.html' },
                { text: '💰 詢問費用', action: 'trigger', key: 'price' },
                { text: '👩‍⚕️ 直接諮詢專家', action: 'trigger', key: 'leave_info' }
            ]
        },
        'triage_heart': {
            text: '我們的心臟再生方案利用 PL11S-TMSC 技術，專注於心肌細胞再生與心功能恢復。<br><br>您想了解：',
            options: [
                { text: '🔬 觀看科學原理', action: 'link', url: 'science.html' },
                { text: '💰 詢問費用', action: 'trigger', key: 'price' },
                { text: '👩‍⚕️ 直接諮詢專家', action: 'trigger', key: 'leave_info' }
            ]
        },
        'triage_joints': {
            text: '針對退化性關節炎，幹細胞能幫助軟骨再生並減緩發炎。<br><br>您想了解：',
            options: [
                { text: '🦵 臨床應用說明', action: 'link', url: 'applications.html' },
                { text: '💰 詢問費用', action: 'trigger', key: 'price' },
                { text: '👩‍⚕️ 直接諮詢專家', action: 'trigger', key: 'leave_info' }
            ]
        },
        'triage_immune': {
            text: '免疫細胞療法可提升身體防禦力，延緩衰老並預防疾病。<br><br>您想了解：',
            options: [
                { text: '🛡️ 關於免疫細胞', action: 'link', url: 'applications.html' },
                { text: '💰 詢問費用', action: 'trigger', key: 'price' },
                { text: '👩‍⚕️ 直接諮詢專家', action: 'trigger', key: 'leave_info' }
            ]
        }
    };

    // Handle Decision Flow
    function handleDecisionFlow(key, userText) {
        addMessage(userText, 'user');
        
        const typingId = showTyping();
        const node = decisionTree[key];
        
        setTimeout(() => {
            removeTyping(typingId);
            
            // Build Options HTML
            const optionsHtml = node.options.map(opt => {
                if (opt.action === 'link') {
                    return `<a href="${opt.url}" class="block w-full text-center bg-white text-primary border border-primary/30 hover:bg-primary hover:text-white text-xs py-2 px-3 rounded-lg transition shadow-sm mb-2">${opt.text}</a>`;
                } else if (opt.action === 'trigger') {
                    return `<button class="quick-btn block w-full bg-white text-primary border border-primary/30 hover:bg-primary hover:text-white text-xs py-2 px-3 rounded-lg transition shadow-sm mb-2" data-q="${opt.key}">${opt.text}</button>`;
                } else {
                    return `<button class="decision-btn block w-full bg-white text-primary border border-primary/30 hover:bg-primary hover:text-white text-xs py-2 px-3 rounded-lg transition shadow-sm mb-2" data-next="${opt.next}">${opt.text}</button>`;
                }
            }).join('');

            addMessage(`${node.text}<div class="mt-3">${optionsHtml}</div>`, 'bot');
        }, 800);
    }

    // Event Delegation for All Buttons (Unified Handler)
    messagesContainer.addEventListener('click', function(e) {
        const target = e.target.closest('button');
        if (!target) return;

        if (target.classList.contains('decision-btn')) {
            const nextKey = target.getAttribute('data-next');
            const text = target.innerText;
            // Disable all buttons in the same container to prevent double clicks
            const parent = target.closest('div');
            if (parent) parent.querySelectorAll('button').forEach(b => b.disabled = true);
            
            handleDecisionFlow(nextKey, text);
        } else if (target.classList.contains('quick-btn')) {
            const key = target.getAttribute('data-q');
            const text = target.innerText;
            
            // Logic for Quick Buttons
            if (key === 'leave_info') {
                chatState.step = 'name';
                chatState.data = {};
            } else if (decisionTree[key]) {
                 // Disable buttons before routing
                 const parent = target.closest('div');
                 if (parent) parent.querySelectorAll('button').forEach(b => b.disabled = true);
                 
                 handleDecisionFlow(key, text);
                 return;
            } else {
                chatState.step = null;
            }

            // Disable buttons
            const parent = target.closest('div');
            if (parent) parent.querySelectorAll('button').forEach(b => b.disabled = true);
            
            addMessage(text, 'user');
            const typingId = showTyping();
            setTimeout(() => {
                removeTyping(typingId);
                addMessage(responses[key], 'bot');
            }, 800);
        }
    });

    // Send Message Logic
    function handleSend() {
        const text = input.value.trim();
        if (!text) return;
        
        // Handle State Input
        if (chatState.step) {
            addMessage(text, 'user');
            input.value = '';
            
            const typingId = showTyping();
            setTimeout(() => {
                removeTyping(typingId);
                
                if (chatState.step === 'name') {
                    chatState.data.name = text;
                    chatState.step = 'phone';
                    addMessage('好的 ' + text + '，請問您的聯絡電話或 WhatsApp 號碼是？', 'bot');
                } else if (chatState.step === 'phone') {
                    chatState.data.phone = text;
                    chatState.step = 'inquiry';
                    addMessage('了解，最後請簡述您想諮詢的問題或需求：', 'bot');
                } else if (chatState.step === 'inquiry') {
                    chatState.data.inquiry = text;
                    chatState.step = null; // Reset
                    
                    // Construct WhatsApp Link
                    const waText = encodeURIComponent(`您好，我想諮詢。\n姓名：${chatState.data.name}\n電話：${chatState.data.phone}\n需求：${chatState.data.inquiry}`);
                    const waLink = `https://wa.me/85263810907?text=${waText}`;
                    
                    // Construct Email Link
                    const mailBody = encodeURIComponent(`姓名：${chatState.data.name}\n電話：${chatState.data.phone}\n需求：${chatState.data.inquiry}`);
                    const mailLink = `mailto:ubeeps@gmail.com?subject=官網諮詢&body=${mailBody}`;

                    addMessage(`感謝您的資訊！<br>請選擇您偏好的聯絡方式傳送給我們：<br><br>
                        <a href="${waLink}" target="_blank" class="block w-full text-center bg-[#25D366] text-white py-2 rounded mb-2 hover:opacity-90 transition shadow-sm"><i class="fab fa-whatsapp mr-1"></i> WhatsApp 傳送</a>
                        <a href="${mailLink}" class="block w-full text-center bg-gray-500 text-white py-2 rounded hover:opacity-90 transition shadow-sm"><i class="fas fa-envelope mr-1"></i> Email 傳送</a>
                    `, 'bot');
                }
            }, 800);
            return;
        }

        // Smart Routing & Keyword Matching
        const lowerText = text.toLowerCase();
        
        // Check for Triage Keywords First (Priority)
        if (lowerText.includes('糖尿病') || lowerText.includes('血糖') || lowerText.includes('胰島')) {
            handleDecisionFlow('triage_diabetes', text);
            input.value = '';
            return;
        }
        if (lowerText.includes('心臟') || lowerText.includes('心肌') || lowerText.includes('血管') || lowerText.includes('心衰')) {
            handleDecisionFlow('triage_heart', text);
            input.value = '';
            return;
        }
        if (lowerText.includes('關節') || lowerText.includes('膝蓋') || lowerText.includes('骨') || lowerText.includes('軟骨')) {
            handleDecisionFlow('triage_joints', text);
            input.value = '';
            return;
        }
        if (lowerText.includes('免疫') || lowerText.includes('抗衰') || lowerText.includes('防禦') || lowerText.includes('亞健康')) {
            handleDecisionFlow('triage_immune', text);
            input.value = '';
            return;
        }

        // Normal Flow
        addMessage(text, 'user');
        input.value = '';
        const typingId = showTyping();
        
        setTimeout(() => {
            removeTyping(typingId);
            let response = responses['default'];
            
            if (lowerText.includes('費用') || lowerText.includes('錢') || lowerText.includes('多少')) response = responses['price'];
            else if (lowerText.includes('幹細胞') || lowerText.includes('是什麼')) response = responses['what_is'];
            else if (lowerText.includes('聯絡') || lowerText.includes('信箱') || lowerText.includes('email') || lowerText.includes('電話')) response = responses['contact'];
            else if (lowerText.includes('流程') || lowerText.includes('步驟') || lowerText.includes('怎麼做')) response = responses['process'];
            else if (lowerText.includes('地址') || lowerText.includes('位置') || lowerText.includes('哪裡')) response = '我們的治療中心位於珠海，並與香港 BGI 華大基因合作。若您在香港，我們可以安排在香港進行初步諮詢與檢測採樣。';
            
            // If default response, add user's text to mailto body
            if (response === responses['default']) {
                const mailBody = encodeURIComponent(`諮詢內容：\n${text}\n\n請回覆此信件...`);
                response = response.replace('body=請在此輸入您的問題...', `body=${mailBody}`);
            }

            addMessage(response, 'bot');
        }, 1000);
    }

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    function showTyping() {
        const id = 'typing-' + Date.now();
        const div = document.createElement('div');
        div.id = id;
        div.className = 'flex items-start animate-fade-in-up';
        div.innerHTML = `
            <div class="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xs shadow-md">U</div>
            <div class="ml-2 bg-white p-3 rounded-lg rounded-tl-none shadow-sm border border-gray-100">
                <div class="flex space-x-1 h-4 items-center">
                    <div class="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style="animation-delay: 0s"></div>
                    <div class="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                    <div class="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                </div>
            </div>
        `;
        messagesContainer.appendChild(div);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return id;
    }

    function removeTyping(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.className = sender === 'user' ? 'flex items-end justify-end animate-fade-in-up' : 'flex items-start animate-fade-in-up';
        
        const bubble = document.createElement('div');
        bubble.className = sender === 'user' 
            ? 'bg-gradient-to-r from-primary to-secondary text-white p-3 rounded-lg rounded-tr-none shadow-md text-sm max-w-[85%] leading-relaxed' 
            : 'bg-white p-3 rounded-lg rounded-tl-none shadow-sm text-sm text-gray-700 border border-gray-100 max-w-[85%] leading-relaxed';
        bubble.innerHTML = text;

        if (sender === 'bot') {
            const avatar = document.createElement('div');
            avatar.className = 'flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xs shadow-md mr-2';
            avatar.innerText = 'U';
            div.appendChild(avatar);
            div.appendChild(bubble);
        } else {
            div.appendChild(bubble);
        }

        messagesContainer.appendChild(div);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Save history
        saveHistory();
    }
    
    // Save/Load History Logic (Simple LocalStorage)
    function saveHistory() {
        if (!isOpen) return; // Don't save if closed, optional
        // Actually, we should save messages
        const msgs = [];
        messagesContainer.querySelectorAll('.animate-fade-in-up').forEach(div => {
             // Skip typing indicator
             if (div.id && div.id.startsWith('typing-')) return;
             
             const isUser = div.classList.contains('justify-end');
             const textDiv = div.querySelector(isUser ? '.bg-gradient-to-r' : '.bg-white');
             if (textDiv) {
                 msgs.push({
                     sender: isUser ? 'user' : 'bot',
                     text: textDiv.innerHTML
                 });
             }
        });
        
        // Limit to last 20 messages
        if (msgs.length > 20) msgs.splice(0, msgs.length - 20);
        
        sessionStorage.setItem('ubeeps_chat_history', JSON.stringify(msgs));
    }
    
    function loadHistory() {
        const saved = sessionStorage.getItem('ubeeps_chat_history');
        if (saved) {
            try {
                const msgs = JSON.parse(saved);
                // Clear default welcome if we have history? 
                // Actually, let's keep welcome, but maybe don't duplicate if it's there.
                // For simplicity, let's just append saved messages after the welcome message 
                // OR remove the default welcome and quick actions if we have history.
                
                // If we have history, maybe we should clear the initial state?
                // But the HTML is hardcoded with Welcome + Quick Actions.
                // Let's just append for now, or maybe the user wants to see previous context.
                
                // To avoid duplication of the initial welcome message if it was saved:
                // We'll just append.
                
                msgs.forEach(msg => {
                    // Check if this message is the initial welcome, if so skip it to avoid double welcome
                    if (msg.text.includes('我是 Ubeeps 智能助手') && msg.sender === 'bot') return;
                    addMessage(msg.text, msg.sender);
                });
            } catch (e) {
                console.error('Error loading chat history', e);
            }
        }
    }
});