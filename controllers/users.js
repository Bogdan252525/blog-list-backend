const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const listHelper = require('../utils/list_helper')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  await listHelper.isValidNewUser(username, password);

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { url: 1, title: 1, author: 1, id: 1 })
    response.json(users)
  response.json(users)
})

module.exports = usersRouter