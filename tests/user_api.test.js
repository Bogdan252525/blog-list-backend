const mongoose = require('mongoose');
const assert = require('node:assert');
const test = require('node:test');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');

const api = supertest(app);

test.beforeEach(async () => {
  await User.deleteMany({});
  console.log('Database cleared before test.');
});

test('Fails if username is too short', async () => {
  const newUser = {
    username: 'ab',
    name: 'Test User',
    password: 'securepassword',
  };

  const result = await api.post('/api/users').send(newUser);
  assert.strictEqual(result.status, 400, 'Status code should be 400');
  assert.ok(result.body.error.includes('Username must be at least 3 characters long'));
});

test('Fails if password is too short', async () => {
  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'ab',
  };

  const result = await api.post('/api/users').send(newUser);
  assert.strictEqual(result.status, 400, 'Status code should be 400');
  assert.ok(result.body.error.includes('Password must be at least 3 characters long'));
});

test('Fails if username is not unique', async () => {
  const existingUser = new User({
    username: 'testuser',
    name: 'Existing User',
    passwordHash: 'hashedpassword',
  });
  await existingUser.save();

  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'securepassword',
  };

  const result = await api.post('/api/users').send(newUser);
  assert.strictEqual(result.status, 400, 'Status code should be 400');
  assert.ok(result.body.error.includes('Username must be unique'));
});

test('Succeeds with a valid user', async () => {
  const newUser = {
    username: 'validuser',
    name: 'Valid User',
    password: 'securepassword',
  };

  const result = await api.post('/api/users').send(newUser);
  assert.strictEqual(result.status, 201, 'Status code should be 201');

  const usersAtEnd = await User.find({});
  assert.strictEqual(usersAtEnd.length, 1, 'Should save one user to the database');
  console.log('Users in database:', usersAtEnd.length);
});

test.afterEach( async () => {
  await User.deleteMany({});
})

test.after(async () => {
  await mongoose.connection.close();
});
