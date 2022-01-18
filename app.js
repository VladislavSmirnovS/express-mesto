const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const NotFoundError = require('./errors/not-found');
const errorHandler = require('./middleware/error-handler');

const { PORT = 3000 } = process.env;
const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '61e68d4fb8b543a0dad2f0dd',
  };

  next();
});

app.use(usersRoutes);

app.use(cardsRoutes);

app.use((res, req, next) => {
  next(new NotFoundError('Запрашиваемой страницы не существет'));
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
