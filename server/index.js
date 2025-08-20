require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simple in-memory data stores
let tasks = [
    { id: 1, title: 'Setup Nexus project structure', date: '2024-01-10T10:00:00Z', isCompleted: true },
    { id: 2, title: 'Develop backend APIs', date: '2024-01-11T14:00:00Z', isCompleted: false },
    { id: 3, title: 'Build frontend components', date: '2024-01-12T09:30:00Z', isCompleted: false },
];
let notifications = [];

const CONFIG_PATH = path.join(__dirname, 'data', 'config.json');

// Ensure the data directory and config file exist on startup
const ensureConfigExists = async () => {
  try {
    await fs.access(CONFIG_PATH);
  } catch (error) {
    // File doesn't exist, so create it with default content
    console.log('config.json not found, creating a new one.');
    const defaultConfig = {
      "widgets": {
        "weather": { "location": "New York", "prompt": "Provide a friendly, concise weather summary based on this data: {data}" },
        "stocks": { "symbols": ["AAPL", "GOOGL"], "alertPrompt": "Alert me if this stock moves more than 2%. Data: {data}" },
        "news": { "topic": "technology", "prompt": "Summarize these articles into 5 crisp bullet points for a tech executive: {articles}" },
        "twitter": { "accounts": ["@vercel", "@github"] }
      }
    };
    await fs.writeFile(CONFIG_PATH, JSON.stringify(defaultConfig, null, 2), 'utf8');
  }
};

// Call this function at the start
ensureConfigExists();

// --- Configuration API ---
app.get('/api/config', async (req, res) => {
  try {
    const configData = await fs.readFile(CONFIG_PATH, 'utf8');
    res.json(JSON.parse(configData));
  } catch (error) {
    console.error('Error reading config file:', error);
    res.status(500).json({ message: 'Error reading configuration' });
  }
});

app.post('/api/config', async (req, res) => {
  try {
    const newConfig = req.body;
    // Basic validation could be added here
    await fs.writeFile(CONFIG_PATH, JSON.stringify(newConfig, null, 2), 'utf8');
    res.json({ message: 'Configuration saved successfully' });
  } catch (error) {
    console.error('Error writing config file:', error);
    res.status(500).json({ message: 'Error saving configuration' });
  }
});

// --- Tasks API (CRUD) ---
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const { title, date } = req.body;
  if (!title || !date) {
    return res.status(400).json({ message: 'Title and date are required' });
  }
  const newTask = {
    id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
    title,
    date,
    isCompleted: false,
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, date, isCompleted } = req.body;
  const taskIndex = tasks.findIndex(t => t.id == id);

  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  const updatedTask = { ...tasks[taskIndex], title, date, isCompleted };
  tasks[taskIndex] = updatedTask;
  res.json(updatedTask);
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = tasks.length;
  tasks = tasks.filter(t => t.id != id);

  if (tasks.length === initialLength) {
    return res.status(404).json({ message: 'Task not found' });
  }

  res.status(204).send(); // No Content
});

// --- Notifications API ---
app.get('/api/notifications', (req, res) => {
  res.json(notifications);
});

// --- Widget APIs ---
const { generateWithGemini } = require('./services/geminiService');

// Helper function to read config on-demand
const readConfig = async () => {
    const configData = await fs.readFile(CONFIG_PATH, 'utf8');
    return JSON.parse(configData);
};

// Weather API
app.get('/api/weather', async (req, res) => {
    try {
        const config = await readConfig();
        const { location, prompt } = config.widgets.weather;
        // MOCK API CALL
        const weatherData = { temperature: '15°C', condition: 'Sunny', city: location };

        const insight = await generateWithGemini(prompt, { data: weatherData });
        res.json({ ...weatherData, insight });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching weather data' });
    }
});

// Stocks API
app.get('/api/stocks', async (req, res) => {
    try {
        const config = await readConfig();
        const { symbols, alertPrompt } = config.widgets.stocks;
        // MOCK API CALL
        const stocksData = symbols.map(symbol => ({
            symbol,
            price: (Math.random() * 2000 + 100).toFixed(2),
            change: (Math.random() * 20 - 10).toFixed(2),
            changePercent: (Math.random() * 5 - 2.5).toFixed(2),
        }));

        // Mock notification generation
        stocksData.forEach(async stock => {
            if (Math.abs(parseFloat(stock.changePercent)) > 2.0) {
                const alertText = await generateWithGemini(alertPrompt, { data: stock });
                notifications.push({ id: Date.now(), text: alertText, date: new Date().toISOString() });
            }
        });

        res.json(stocksData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stock data' });
    }
});

// News API
app.get('/api/news', async (req, res) => {
    try {
        const config = await readConfig();
        const { topic, prompt } = config.widgets.news;
        // MOCK API CALL
        const newsData = {
            topic,
            articles: [
                { title: 'AI Revolutionizes Software Development', source: 'Tech Today' },
                { title: 'The Future of Quantum Computing', source: 'Future Forward' },
                { title: 'New React Version Released', source: 'Dev Community' },
            ],
        };

        const summary = await generateWithGemini(prompt, { articles: newsData.articles });
        res.json({ ...newsData, summary });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching news data' });
    }
});

// Twitter API
app.get('/api/twitter', async (req, res) => {
    try {
        const config = await readConfig();
        const { accounts } = config.widgets.twitter;
        // MOCK API CALL
        const twitterData = accounts.map(account => ({
            account,
            tweets: [
                { id: 1, text: `This is a mock tweet from ${account}. #AI` },
                { id: 2, text: `Hello from ${account}! The future is exciting.` },
            ]
        }));
        res.json(twitterData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching twitter data' });
    }
});

// Serve the React app for any routes not handled by the API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Nexus server listening on port ${PORT}`);
});
