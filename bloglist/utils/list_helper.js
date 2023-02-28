const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const likes = blogs.reduce(
    (total_likes, blog) => total_likes + (blog?.likes || 0),
    0
  );
  return likes;
};

const favoriteBlog = (blogs) => {
  
  const favPost = blogs.reduce((fav, blog) => {
    return blog.likes > fav.likes ? blog : fav;
  });
  
  return favPost;
};

const mostBlogs = (blogs) => {
  const authors = _.countBy(blogs, 'author');
  let mostAuth = {blogs: 0};
  
  for(let author in authors) {
    if(authors[author] > mostAuth.blogs) {
      mostAuth = {
        author, blogs: authors[author]
      };
    }
  }
  
  return mostAuth;
};

const mostLikes = (blogs) => {
  let totalLikes = {};
  
  blogs.forEach(blog => {
    if(totalLikes[blog.author]) {
      totalLikes[blog.author] += blog.likes;
    } else {
      totalLikes[blog.author] = blog.likes;
    }
  });
  
  let mostLiked = {likes: -1};
  
  for(let author in totalLikes) {
    if(totalLikes[author] > mostLiked.likes) {
      mostLiked = {author, likes: totalLikes[author]};
    }
  }
  
  return mostLiked;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
