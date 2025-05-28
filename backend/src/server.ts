import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './routes/authRoutes';
import blendRoutes from './routes/blend';
import katalogRoutes from './routes/katalog';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API rute
app.use('/api/auth', authRoutes);
app.use('/api/mesavine', blendRoutes); 
app.use('/api/katalog', katalogRoutes); 

// Serviranje frontend aplikacije
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Fallback ruta za React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
