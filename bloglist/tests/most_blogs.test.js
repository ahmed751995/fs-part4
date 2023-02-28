const blogs = require('./blogs');
const listHelper = require('../utils/list_helper');

describe('most blog', () => {

  test('the most blog author', () => {
    const result = listHelper.mostBlogs(blogs);
    const mostAuth = {
      author: "Robert C. Martin",
      blogs: 3
    };
    expect(result).toEqual(mostAuth);
  });

  test('the most liked author', () => {
    const result = listHelper.mostLikes(blogs);
    const mostLiked = {
      author: "Edsger W. Dijkstra",
      likes: 17
    };
    expect(result).toEqual(mostLiked);
  });
});
