const blogRoute = require("express").Router();
const Blog = require("../models/blog");

blogRoute.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogRoute.post("/", async (request, response) => {
  const body = request.body;
  if (body.title && body.url) {
    const blog = new Blog(body);
    if (!blog.likes) blog.likes = 0;
    const result = await blog.save();
    response.status(201).json(result);
  }
  response.status(400).end();
});

blogRoute.delete("/:id", async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogRoute.put("/:id", async (request, response) => {
  const body = request.body;

  const blog = {
    title: body.title,
    url: body.url,
    author: body.author,
    likes: body.likes,
  };
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
    context: "query",
  });

  if(updatedBlog) {
    response.json(updatedBlog);
  }
  response.status(404).end();

});

module.exports = blogRoute;
