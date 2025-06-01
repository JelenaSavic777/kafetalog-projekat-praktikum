import express from 'express';
import mesavineRouter from './routes/mesavine'; 
import cors from 'cors';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.use('/api/mesavine', mesavineRouter); 
app.listen(PORT, () => {
  console.log(`Server radi na http://localhost:${PORT}`);
});
