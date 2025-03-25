const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');
const blogsData = require('../blogs_data');
describe('most likes', () => {

  test('when list is empty, returns null', () => {
    const result = listHelper.mostLikes(blogsData.blogsEmpty);
    assert.strictEqual(result, null);
  });

  test('when list has only one blog, returns the author and their likes', () => {
    const result = listHelper.mostLikes(blogsData.blogOne);
    assert.deepStrictEqual(result, {
      author: "Michael Chan",
      likes: 7,
    });
  });

  test('when list has many blogs, returns the author with the most likes', () => {
    const result = listHelper.mostLikes(blogsData.blogsMany);
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });
});
