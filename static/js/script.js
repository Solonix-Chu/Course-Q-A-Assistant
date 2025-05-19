document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('chatBox');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');

    // 初始化
    init();

    function init() {
        // 设置发送按钮事件监听
        sendBtn.addEventListener('click', handleSendMessage);
        
        // 支持按Enter键发送消息（Shift+Enter换行）
        userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        });

        // 调整聊天框到底部
        scrollToBottom();

        // 检查marked库是否可用
        if (typeof marked !== 'undefined') {
            // 设置marked选项，允许渲染代码块
            marked.setOptions({
                highlight: function(code, lang) {
                    if (typeof hljs !== 'undefined' && lang && hljs.getLanguage(lang)) {
                        return hljs.highlight(code, { language: lang }).value;
                    } else if (typeof hljs !== 'undefined') {
                        return hljs.highlightAuto(code).value;
                    } else {
                        return code;
                    }
                },
                breaks: true
            });
        } else {
            console.error('marked库未加载，将使用纯文本显示');
        }
    }

    // 处理发送消息
    function handleSendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // 添加用户消息到聊天框
        addMessageToChat('user', message);
        
        // 清空输入框
        userInput.value = '';
        
        // 添加加载效果
        const loadingId = addLoadingIndicator();
        
        // 禁用发送按钮
        sendBtn.disabled = true;
        
        // 发送消息到服务器
        sendMessageToServer(message)
            .then(response => {
                // 移除加载效果
                removeLoadingIndicator(loadingId);
                
                // 添加AI回复到聊天框
                addMessageToChat('bot', response);
                
                // 重新启用发送按钮
                sendBtn.disabled = false;
            })
            .catch(error => {
                // 移除加载效果
                removeLoadingIndicator(loadingId);
                
                // 显示错误消息
                addMessageToChat('bot', `抱歉，出现了一个错误：${error.message}`);
                
                // 重新启用发送按钮
                sendBtn.disabled = false;
            });
    }

    // 添加消息到聊天框
    function addMessageToChat(sender, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // 如果是bot的消息且marked可用，使用marked.js渲染markdown
        if (sender === 'bot' && typeof marked !== 'undefined') {
            try {
                messageContent.innerHTML = marked.parse(content);
                
                // 如果hljs可用，对代码块应用高亮
                if (typeof hljs !== 'undefined') {
                    messageContent.querySelectorAll('pre code').forEach((block) => {
                        try {
                            hljs.highlightElement(block);
                        } catch (e) {
                            console.error('代码高亮失败:', e);
                        }
                    });
                }
            } catch (e) {
                console.error('Markdown渲染失败:', e);
                messageContent.textContent = content;
            }
        } else {
            messageContent.textContent = content;
        }
        
        messageDiv.appendChild(messageContent);
        chatBox.appendChild(messageDiv);
        
        // 滚动到底部
        scrollToBottom();
    }

    // 添加加载指示器
    function addLoadingIndicator() {
        const loadingId = 'loading-' + Date.now();
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message bot-message';
        loadingDiv.id = loadingId;
        
        const loadingContent = document.createElement('div');
        loadingContent.className = 'message-content loading-dots';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            loadingContent.appendChild(dot);
        }
        
        loadingDiv.appendChild(loadingContent);
        chatBox.appendChild(loadingDiv);
        
        // 滚动到底部
        scrollToBottom();
        
        return loadingId;
    }

    // 移除加载指示器
    function removeLoadingIndicator(loadingId) {
        const loadingDiv = document.getElementById(loadingId);
        if (loadingDiv) {
            chatBox.removeChild(loadingDiv);
        }
    }

    // 发送消息到服务器
    async function sendMessageToServer(message) {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || '服务器错误');
            }
            
            return data.response;
        } catch (error) {
            console.error('发送消息失败:', error);
            throw error;
        }
    }

    // 滚动聊天框到底部
    function scrollToBottom() {
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // 快速问题功能
    window.askQuestion = function(question) {
        userInput.value = question;
        handleSendMessage();
    };
}); 