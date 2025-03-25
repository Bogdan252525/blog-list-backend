const { test, beforeEach, afterEach, after, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');

const helper = require('./test_helper');

const api = supertest(app);

describe('when there are some blogs saved initially', () => {
  let token;

  beforeEach(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});
    const newUser = {
      username: 'abwerty',
      name: 'Test User',
      password: 'securepassword',
    };
    
    const userResponse = await api.post('/api/users').send(newUser);
    const userId = userResponse.body.id;
  
    const loginResponse = await api.post('/api/login').send({
      username: newUser.username,
      password: newUser.password,
    });
    
    token = loginResponse.body.token;
  
    await Blog.deleteMany({});
  
    const blogsWithUser = helper.initialBlogs.map((blog) => ({
      ...blog,
      user: userId,
    }));
  
    await Blog.insertMany(blogsWithUser);
  });
  

  describe('retrieving blogs', () => {
    test('blogs are returned as JSON and the count is correct', async () => {
      const blogs = await Blog.find({});

      const response = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      assert.strictEqual(response.body.length, blogs.length, 'Blog count is incorrect');
    });

    test('unique identifier property of blogs is named id', async () => {
      const response = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
      const blogs = response.body;

      blogs.forEach((blog) => {
        assert.ok(blog.id, 'Blog does not have id property');
        assert.strictEqual(blog._id, undefined, 'Blog still has _id property');
      });
    });
  });

  describe('creating a blog', () => {
    test('a new blog is created via POST', async () => {
      const blogsAtStart = await Blog.find({});
  
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(helper.newBlog)
        .expect(201);
  
      const blogsAtEnd = await Blog.find({});
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1, 'Blog count did not increase by 1');
  
      const savedBlog = blogsAtEnd.find((b) => b.title === helper.newBlog.title);
      assert.ok(savedBlog, 'New blog was not saved in the database');
    });

    test('missing likes property defaults to 0', async () => {
      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(helper.newBlogMissingLikes)
        .expect(201);
  
      const savedBlog = await Blog.findById(response.body.id);
      assert.strictEqual(savedBlog.likes, 0, 'Default value for likes was not set to 0');
    });
  
    test('missing title or url returns 400 Bad Request', async () => {
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(helper.newBlogMissingTitle)
        .expect(400);
  
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(helper.newBlogMissingURL)
        .expect(400);
    });
  });

  describe('deleting a blog', () => {
  
    test('a blog can be deleted', async () => {
      const initialBlogs = await Blog.find({});
      const blogToDelete = initialBlogs[0];
  
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
  
      const blogsAtEnd = await Blog.find({});
      assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1, 'Blog count did not decrease by 1');
    });
  
    test('deleting a non-existent blog returns 404', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
  
      await api
        .delete(`/api/blogs/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('updating a blog', () => {
    test('a blog\'s likes can be updated', async () => {
      const initialBlogs = await Blog.find({});
      const blogToUpdate = initialBlogs[0];
      const updatedLikes = { likes: blogToUpdate.likes + 1 };

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedLikes)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      assert.strictEqual(response.body.likes, updatedLikes.likes, 'Likes were not updated correctly');
    });

    test('updating a non-existent blog returns 404', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const updatedLikes = { likes: 10 };

      await api
        .put(`/api/blogs/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedLikes)
        .expect(404);
    });

    test('updating a blog with invalid ID returns 400', async () => {
      const invalidId = '12345';
      const updatedLikes = { likes: 10 };

      await api
        .put(`/api/blogs/${invalidId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedLikes)
        .expect(400);
    });
  });
  
  test('creation fails with status 401 if token is not provided', async () => {
    const blogsAtStart = await Blog.find({});
  
    await api
      .post('/api/blogs')
      .send(helper.newBlog)
      .expect(401);
  
    const blogsAtEnd = await Blog.find({});
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length, 'Blog count should not change without a valid token');
  });
  
  afterEach( async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});
  })
});

after(async () => {
  await mongoose.connection.close();
});
