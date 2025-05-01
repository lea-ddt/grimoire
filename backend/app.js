const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');
// const stuffRoutes = require('./routes/stuff');

mongoose.connect('mongodb+srv://lea-dudit:leadudit@cluster0.uh3pcqg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));



  const app = express();

  app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
app.get('/favicon.ico', (req, res) => res.status(204).end());

// app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;