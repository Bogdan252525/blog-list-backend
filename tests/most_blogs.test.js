const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');
const blogsData = require('../blogs_data');

describe('most blogs', () => {

  test('when list is empty, returns null', () => {
    const result = listHelper.mostBlogs(blogsData.blogsEmpty);
    assert.strictEqual(result, null);
  });

  test('when list has only one blog, returns that author with count of 1', () => {
    const result = listHelper.mostBlogs(blogsData.blogOne);
    assert.deepStrictEqual(result, {
      author: "Michael Chan",
      blogs: 1,
    });
  });

  test('when list has many blogs, returns the author with the most blogs', () => {
    const result = listHelper.mostBlogs(blogsData.blogsMany);
    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      blogs: 3,
    });
  });
});
