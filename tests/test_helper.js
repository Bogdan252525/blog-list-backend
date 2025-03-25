const initialBlogs = [
  {
    title: 'Test Blog',
    author: 'John Doe',
    url: 'http://test.com',
    likes: 5
  },
  {
    title: 'Test2 Blog',
    author: 'John Doe',
    url: 'http://test2.com',
    likes: 4
  }
]

const newBlog = {
  title: 'Test Blog',
  author: 'Author Name',
  url: 'http://example.com',
  likes: 10,
};

const newBlogMissingLikes = {
  title: 'No Likes Blog',
  author: 'Author Name',
  url: 'http://example.com',
};

const newBlogMissingTitle = {
  author: 'Author Name',
  url: 'http://example.com',
  likes: 10,
};

const newBlogMissingURL = {
  title: 'Missing URL Blog',
  author: 'Author Name',
  likes: 10,
};

module.exports = {
  initialBlogs,
  newBlog,
  newBlogMissingLikes,
  newBlogMissingTitle,
  newBlogMissingURL
}