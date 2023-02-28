const blogs = require('./blogs');
const listHelper = require('../utils/list_helper');

describe('favorite blog', () => {

  test('the favorite blog post', () => {
    const result = listHelper.favoriteBlog(blogs);
    expect(result).toEqual(blogs[2]);
  });
});
