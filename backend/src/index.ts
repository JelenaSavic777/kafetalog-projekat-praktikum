import express from 'express';
import blendsRouter from './routes/blend'; 
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Registruj ruter
app.use('/api/mesavine', blendsRouter); 

app.listen(PORT, () => {
  console.log(`Server radi na http://localhost:${PORT}`);
});
