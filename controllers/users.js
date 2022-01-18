const User = require('../models/user');
const BadRequestError = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found');
const ConflictError = require('../errors/conflict');

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  return User
    .create({ name, about, avatar })
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else if (err.code === 11000) {
        next(new ConflictError(`Пользователь ${name} уже существует`));
      } else {
        next(err);
      }
    });
};

module.exports.getUsers = (req, res, next) => User
  .find()
  .then((users) => {
    res.status(200).send(users);
  })
  .catch((err) => {
    next(err);
  });

module.exports.getUser = (req, res, next) => {
  const { id } = req.params;
  return User
    .findById(id)
    .orFail(new NotFoundError(`Пользователь с id ${id} не найден`))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный id'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const id = req.user._id;

  return User
    .findByIdAndUpdate(
      id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    )
    .orFail(new NotFoundError(`Пользователь с id ${id} не найден`))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный id'));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const id = req.user._id;

  return User
    .findByIdAndUpdate(
      id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    )
    .orFail(new NotFoundError(`Пользователь с id ${id} не найден`))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Невалидный id'));
      } else {
        next(err);
      }
    });
};
