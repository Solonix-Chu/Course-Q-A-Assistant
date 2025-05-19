# 人工智能原理课程 - 智能问答系统

一个基于DeepSeek AI的《人工智能原理》研究生课程智能问答系统，以网页形式提供服务。

## 功能特点

- **知识点查询**：回答课程相关的知识点问题
- **作业答疑**：提供作业相关的指导和答疑
- **学习建议**：根据学生情况给出个性化学习建议
- **资源推荐**：推荐相关学习资源和参考材料

## 技术栈

- **后端**：Python + Flask
- **前端**：HTML + CSS + JavaScript
- **AI模型**：DeepSeek AI API

## 安装与运行

1. 克隆仓库：

```bash
git clone https://github.com/yourusername/ai-course-assistant.git
cd ai-course-assistant
```

2. 安装依赖：

```bash
pip install -r requirements.txt
```

3. 设置API密钥：

项目目录中已包含`.env`文件，其中配置了DeepSeek API密钥。如需更改，请修改该文件：

```
DEEPSEEK_API_KEY=你的API密钥
```

4. 启动应用：

```bash
python app.py
```

5. 在浏览器中访问：

```
http://localhost:5000
```

## 系统截图

![系统截图](screenshot.png)

## 课程知识点覆盖范围

- 人工智能基础
- 搜索算法
- 知识表示
- 机器学习
- 神经网络
- 自然语言处理
- 计算机视觉
- 强化学习
- 知识工程
- 人工智能伦理

## 自定义与扩展

可以通过修改`app.py`中的`AI_COURSE_CONTEXT`变量来自定义课程知识内容。

## 许可

MIT 许可证 