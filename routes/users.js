const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  getUsers,
  getUser,
  getMyInfo,
  updateAvatar,
  updateUser,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getMyInfo);

router.get('/:id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .custom((value) => {
        if (!validator.isURL(value, { require_protocol: true })) {
          throw new Error('Неправильный формат ссылки');
        }
        return value;
      }),
  }),
}), updateAvatar);

module.exports = router;
