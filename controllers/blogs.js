const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const { title, url, likes } = request.body;

  if (!title || !url) {
    return response.status(400).json({ error: 'title and url are required' });
  }

  const blog = new Blog({
    title,
    url,
    likes,
    user: request.user._id,
  });

  const savedBlog = await blog.save();

  request.user.blogs = request.user.blogs.concat(savedBlog._id);
  await request.user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const blogId = request.params.id;

    const blog = await Blog.findById(blogId).populate('user');
    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' });
    }

    if (!blog.user) {
      return response.status(400).json({ error: 'Blog does not have an associated user' });
    }

    if (blog.user._id.toString() !== request.user.id.toString()) {
      return response.status(403).json({ error: 'Only the creator can delete this blog' });
    }

    await Blog.findByIdAndDelete(blogId);

    request.user.blogs = request.user.blogs.filter(
      (blog) => blog.toString() !== blogId.toString()
    );
    await request.user.save();

    response.status(204).end();
  } catch (error) {
    console.error('Error during blog deletion:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
});


blogsRouter.put('/:id', async (request, response) => {
  const { id } = request.params;
  const { likes } = request.body;

  if (likes === undefined) {
    return response.status(400).json({ error: 'Likes value is required' });
  }
  
  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { likes },
    { new: true, runValidators: true }
  );

  if (updatedBlog) {
    response.json(updatedBlog);
  } else {
    response.status(404).json({ error: 'Blog not found' })
  }
})

module.exports = blogsRouter