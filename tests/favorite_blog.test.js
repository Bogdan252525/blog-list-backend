const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const blogsData = require('../blogs_data')

describe('favorite blog', () => {

  test('when list is empty, returns null', () => {
    const result = listHelper.favoriteBlog(blogsData.blogsEmpty);
    assert.strictEqual(result, null);
  });

  test('when list has only one blog, returns that blog', () => {
    const result = listHelper.favoriteBlog(blogsData.blogOne);
    assert.deepStrictEqual(result, {
      title: "React patterns",
      author: "Michael Chan",
      likes: 7,
    });
  });

  test('when list has many blogs, returns the blog with the most likes', () => {
    const result = listHelper.favoriteBlog(blogsData.blogsMany);
    assert.deepStrictEqual(result, {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    });
  });
});