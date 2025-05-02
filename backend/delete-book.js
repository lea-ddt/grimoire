const mongoose = require('mongoose');
const Book = require('./models/Thing');

mongoose.connect('mongodb+srv://lea-dudit:leadudit@cluster0.uh3pcqg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',)
  .then(async () => {
    await Book.deleteOne({ _id: '6813b492b733d6665369e1ee' });
    console.log('Livre supprimé');
    mongoose.disconnect();
  })
  .catch((err) => console.error(err));