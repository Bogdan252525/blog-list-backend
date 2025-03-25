const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const blogsData = require('../blogs_data')

describe('total likes', () => {

  test('when list is empty, equals the likes of that', () => {
    const result = listHelper.totalLikes(blogsData.blogsEmpty)
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(blogsData.blogOne)
    assert.strictEqual(result, 7)
  })

  test('when list has some of blogs, equals the likes of that', () => {
    const result = listHelper.totalLikes(blogsData.blogsMany)
    assert.strictEqual(result, 36)
  })
})
