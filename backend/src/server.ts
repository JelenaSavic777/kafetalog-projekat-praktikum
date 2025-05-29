import express from 'express';
import authRoutes from './routes/authRoutes';
import blendRoutes from './routes/blend';
import mesavineRoutes from './routes/mesavine';
import katalogRoutes from './routes/katalog';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Helper funkcija za logovanje svih ruta
function logRoutes(stack: any, prefix = '') {
  stack.forEach((layer: any) => {
    if (layer.route) {
      const path = prefix + layer.route.path;
      const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
      console.log(`Ruta: ${methods} ${path}`);
    } else if (layer.name === 'router' && layer.handle.stack) {
      logRoutes(layer.handle.stack, prefix + (layer.regexp.source !== '^\\/?$' ? layer.regexp.source.replace('\\/?', '').replace('^', '').replace('$', '') : ''));
    }
  });
}

app.get('/', (req, res) => {
  res.send('Backend radi');
});

app.use('/api/auth', authRoutes);
app.use('/api/blend', blendRoutes);
app.use('/api/mesavine', mesavineRoutes);
app.use('/api/katalog', katalogRoutes);

app._router && logRoutes(app._router.stack);

app.listen(PORT, () => {
  console.log(`Server pokrenut na portu ${PORT}`);
});
