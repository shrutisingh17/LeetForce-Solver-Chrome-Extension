import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 3000;


const corsOptions = {
  origin: 'http://localhost:5173', // Allow only your frontend's origin
  methods: 'GET,POST', // Allow specific HTTP methods
  allowedHeaders: 'Content-Type', // Allow specific headers
};

app.use(cors(corsOptions)); // Use the configured CORS options
// app.use(cors());
app.use(express.json());

app.post('/api/graphql', async (req, res) => {
  try {
    const response = await axios.post('https://leetcode.com/graphql', req.body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
