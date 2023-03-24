const blogRoute = require("express").Router();
const Blog = require("../models/blog");

blogRoute.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogRoute.post("/", async (request, response) => {
  const blog = new Blog(request.body);

  if (!blog.title || !blog.url) response.status(400).end();

  if (!blog.likes) blog.likes = 0;

  const result = await blog.save();

  response.status(201).json(result);
});

module.exports = blogRoute;
