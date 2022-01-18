const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found');

const getCards = (req, res, next) => Card
  .find()
  .then((cards) => {
    res.status(201).send(cards);
  })
  .catch((err) => {
    next(err);
  });

function createCard(req, res, next) {
  const {
    name, link, likes, createdAt,
  } = req.body;
  const owner = req.user._id;

  return Card
    .create({
      name, link, owner, likes, createdAt,
    })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else {
        next(err);
      }
    });
}

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  return Card
    .findByIdAndRemove(cardId)
    .orFail(new NotFoundError('Карточка с указанным id не найдена'))
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный id'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;

  return Card
    .findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .orFail(new NotFoundError(`Передан несуществующий _id карточки: ${cardId}`))
    .then((likes) => {
      res.status(200).send(likes);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный id'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;

  return Card
    .findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .orFail(new NotFoundError(`Передан несуществующий _id карточки: ${cardId}`))
    .then((likes) => {
      res.status(200).send(likes);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для снятия лайка'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный id'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
