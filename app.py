import os
import json
import requests
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

app = Flask(__name__)
CORS(app)

# 从环境变量获取API密钥
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
API_URL = "https://api.deepseek.com/v1/chat/completions"

# 人工智能原理课程的基本知识内容
AI_COURSE_CONTEXT = """
《人工智能原理》是一门研究生核心课程，主要涵盖以下内容：
1. 人工智能基础：智能的定义、图灵测试、智能体与环境
2. 问题求解：搜索算法(BFS, DFS, A*, 启发式搜索)、约束满足问题
3. 知识表示：逻辑表示、语义网络、框架系统
4. 机器学习：监督学习、无监督学习、强化学习、深度学习基础
5. 神经网络：感知机、BP网络、CNN、RNN、Transformer
6. 自然语言处理：语法分析、语义理解、机器翻译
7. 计算机视觉：图像分类、目标检测、图像分割
8. 强化学习：马尔可夫决策过程、Q学习、策略梯度
9. 知识工程：专家系统、知识获取、推理机制
10. 人工智能伦理：偏见问题、隐私问题、安全问题

课程作业通常包括算法实现、模型训练、论文阅读报告等。
"""

@app.route('/')
def index():
    """返回首页"""
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    """处理聊天请求"""
    data = request.json
    user_message = data.get('message', '')
    
    if not user_message:
        return jsonify({"error": "消息不能为空"}), 400
    
    # 构建发送到DeepSeek API的消息
    messages = [
        {"role": "system", "content": f"""你是《人工智能原理》研究生课程的智能助教。
请基于以下课程内容提供准确、专业的回答。
{AI_COURSE_CONTEXT}

你的任务是：
1. 回答关于课程内容的知识点查询
2. 提供作业相关的指导和答疑
3. 给出个性化的学习建议
4. 推荐相关学习资源

回答应专业、简洁、有条理，必要时可以提供代码示例。
所有回答使用中文。"""},
        {"role": "user", "content": user_message}
    ]
    
    # 调用DeepSeek API
    try:
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
        }
        
        payload = {
            "model": "deepseek-chat",
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 2000
        }
        
        response = requests.post(API_URL, headers=headers, json=payload)
        response_data = response.json()
        
        # 提取AI回复
        if 'choices' in response_data and len(response_data['choices']) > 0:
            ai_response = response_data['choices'][0]['message']['content']
            return jsonify({"response": ai_response})
        else:
            return jsonify({"error": "API响应格式错误", "details": response_data}), 500
            
    except Exception as e:
        return jsonify({"error": f"API请求失败: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001) 