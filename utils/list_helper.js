const User = require('../models/user')

const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogsList) => {
  return blogsList.reduce((sum, blog) => sum + blog.likes, 0);
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const favorite = blogs.reduce((fav, blog) => {
    return blog.likes > (fav?.likes || 0) ? blog : fav;
  }, null);

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const authorCounts = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1;
    return acc;
  }, {});

  const mostPopular = Object.entries(authorCounts).reduce((max, [author, count]) => {
    return count > max.blogs ? { author, blogs: count } : max;
  }, { author: '', blogs: 0 });

  return mostPopular;
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const likesByAuthor = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes;
    return acc;
  }, {});

  const mostLiked = Object.entries(likesByAuthor).reduce((max, [author, likes]) => {
    return likes > max.likes ? { author, likes } : max;
  }, { author: '', likes: 0 });

  return mostLiked;
};

const isValidNewUser = async (username, password) => {
  if (!username || username.length < 3) {
    throw new Error('Username must be at least 3 characters long');
  }

  if (!password || password.length < 3) {
    throw new Error('Password must be at least 3 characters long');
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error('Username must be unique');
  }
};



module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  isValidNewUser
}
