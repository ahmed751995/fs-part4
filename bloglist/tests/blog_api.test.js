const mongoose = require("mongoose");
const supertest = require("supertest");
const Blog = require("../models/blog");
const helper = require("./test_helper");
const app = require("../app");
const { update } = require("lodash");
const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  let newBlog;
  for (let blog of helper.initialBlog) {
    newBlog = new Blog(blog);
    await newBlog.save();
  }
}, 10000);

test("test get all blogs", async () => {
  const blogsInDb = await helper.blogsInDb();
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
  expect(response.body).toHaveLength(blogsInDb.length);
});

test("unique identifier", async () => {
  const blog = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  };

  const resp = await api.post("/api/blogs").send(blog).expect(201);
  expect(resp.body.id).toBeDefined();

  const blogs = await helper.blogsInDb();
  const newBlog = blogs.filter((b) => b.id == resp.body.id);

  expect(newBlog).toHaveLength(1);
});

test("adding new blog", async () => {
  const blog = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  };

  const oldBlogs = await helper.blogsInDb();

  const resp = await api.post("/api/blogs").send(blog).expect(201);

  const newBlogs = await helper.blogsInDb();

  const postBlog = resp.body;

  expect(newBlogs).toHaveLength(oldBlogs.length + 1);
  expect(postBlog.title).toEqual(blog.title);
});

test("likes is existed if not should be 0", async () => {
  const blog = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
  };

  const resp = await api.post("/api/blogs").send(blog).expect(201);

  const newBlog = resp.body;

  expect(newBlog.likes).toBeDefined();
  expect(newBlog.likes).toBe(0);
});

test("test existance of url and title", async () => {
  const blogWithoutTitle = {
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
  };

  const blogWithoutUrl = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
  };
  await api.post("/api/blogs").send(blogWithoutTitle).expect(400);
  await api.post("/api/blogs").send(blogWithoutUrl).expect(400);
});

describe("deleting blog", () => {
  test("removing first item", async () => {
    const notesBeforeDelete = await helper.blogsInDb();
    const deletedBlog = notesBeforeDelete[0];
    await api.delete(`/api/blogs/${deletedBlog.id}`).expect(204);
    const notesAfterDelete = await helper.blogsInDb();

    expect(notesAfterDelete).toHaveLength(notesBeforeDelete.length - 1);
  });
});

describe("updating blogs", () => {
  test("updating single blog", async () => {
    const blog = (await helper.blogsInDb())[0];
    blog.url = "google.com";
    const response = await api.put(`/api/blogs/${blog.id}`).send(blog);

    const blogAfterUpdate = response.body;
    const blogs = await helper.blogsInDb();
    
    const updatedBlog = blogs.filter(b => b.id === blogAfterUpdate.id)[0];
    expect(updatedBlog.url).toBe("google.com");
  });

  test("update blog doesn't exist", async () => {
    const blog = new Blog();
    blog.url = "start.com";
    blog.id = "2131lksdf";

    await api.put(`/api/blogs/${blog.id}`).send(blog).expect(404);
    
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
