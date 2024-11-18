import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Mistral } from '@mistralai/mistralai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;  // Match targetPort in netlify.toml

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Basic health check route
// app.get('/', (req, res) => {
//   res.json({ message: 'Server is running' });
// });

// Chat endpoint
app.post('/chat', async (req, res) => {
    try {
        const client = new Mistral({
            apiKey: process.env.MISTRALAI_KATE_API_KEY
        });

        const response = await client.chat({
            model: "mistral-tiny",
            messages: [{ role: "user", content: req.body.message }],
        });

        res.json({ response: response.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});