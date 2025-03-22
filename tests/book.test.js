import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app.js";
import connectDB from "../src/database/db-connect.js";

let adminToken, editorToken, viewerToken, bookId;

const URLs = {
  login: "/api/v1/auth/login",
  Books: "/api/v1/books",
};

beforeAll(async () => {
  // Ensure DB connection before tests
  connectDB();

  //  ?==> Get  tokens
  // Admin Token
  const adminRes = await request(app)
    .post(URLs.login)
    .set("Content-Type", "application/json")
    .send({
      email: "admin@email.com",
      password: "Asd@@123",
    });

  adminToken = adminRes.body.data.token;

  // Editor Token
  const editorRes = await request(app)
    .post(URLs.login)
    .set("Content-Type", "application/json")
    .send({
      email: "editor@email.com",
      password: "Asd@@123",
    });

  editorToken = editorRes.body.data.token;

  // Viewer Token
  const viewerRes = await request(app)
    .post(URLs.login)
    .set("Content-Type", "application/json")
    .send({
      email: "viewer@email.com",
      password: "Asd@@123",
    });

  viewerToken = viewerRes.body.data.token;
});

// Close database connection after all tests
afterAll(async () => {
  mongoose.connection.close();
});

// ?==> Test Admin Roles and Permissions
describe("Admin Role Tests Book API Endoints", () => {
  // ✅ 1. Test fetching all Books
  test("GET /books → should return all books", async () => {
    const res = await request(app)
      .get(URLs.Books)
      .set("Cookie", [`token=${adminToken}`]);

    expect(res.statusCode).toBe(200);
  });

  // ✅ 2. Test creating a new book
  test("POST /books → should create a new book", async () => {
    const newBook = {
      title: "new Book",
      author: "any author",
      publishedDate: "1999-01-15",
    };

    const res = await request(app)
      .post(URLs.Books)
      .set("Cookie", [`token=${adminToken}`])
      .send(newBook);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data.title).toBe(newBook.title);
    bookId = res.body.data._id;
  });

  // ❌ 3. Test creating a book with missing fields
  test("POST /books → should not create a new book with missing fields", async () => {
    const newBook = {
      author: "any author",
      publishedDate: "1999-01-15",
    };

    const res = await request(app)
      .post(URLs.Books)
      .set("Cookie", [`token=${adminToken}`])
      .send(newBook);

    expect(res.statusCode).toBe(422);
  });

  // ✅ 4. Test fetching a specific book
  test("GET /books/:id → should return a specific book", async () => {
    const res = await request(app)
      .get(`${URLs.Books}/${bookId}`)
      .set("Cookie", [`token=${adminToken}`]);

    expect(res.statusCode).toBe(200);
  });

  // ❌ 5. Test fetching a book with invalid ID
  test("GET /books/:id → should not return a book with invalid ID", async () => {
    const res = await request(app)
      .get(`${URLs.Books}/5`)
      .set("Cookie", [`token=${adminToken}`]);

    expect(res.statusCode).toBe(422);
  });

  // ✅ 6. Test updating a book
  test("PUT /books/:id → should update an existing book", async () => {
    const updatedBook = {
      title: "updated Book",
    };
    const res = await request(app)
      .put(`${URLs.Books}/${bookId}`)
      .set("Cookie", [`token=${adminToken}`])
      .send(updatedBook);

    expect(res.statusCode).toBe(200);
  });

  // ❌ 7. Test updating a book with invalid ID
  test("PUT /books/:id → should not update a book with invalid ID", async () => {
    const updatedBook = {
      title: "updated Book",
    };
    const res = await request(app)
      .put(`${URLs.Books}/5`)
      .set("Cookie", [`token=${adminToken}`])
      .send(updatedBook);

    expect(res.statusCode).toBe(422);
  });

  // ✅ 8. Test deleting a book
  test("DELETE /books/:id → should delete a book", async () => {
    const res = await request(app)
      .delete(`${URLs.Books}/${bookId}`)
      .set("Cookie", [`token=${adminToken}`])
      .query({ softDelete: false })
      .send();

    expect(res.statusCode).toBe(204);
  });
});

// ?==> Test Editor Roles and Permissions
describe("Editor Role Tests Book API Endoints", () => {
  // ✅ 1. Test fetching all Books
  test("GET /books → should return all books", async () => {
    const res = await request(app)
      .get(URLs.Books)
      .set("Cookie", [`token=${editorToken}`])
      .send();

    expect(res.statusCode).toBe(200);
  });

  // ✅ 2. Test creating a new book
  test("POST /books → should create a new book", async () => {
    const newBook = {
      title: "new Book",
      author: "any author",
      publishedDate: "1999-01-15",
    };

    const res = await request(app)
      .post(URLs.Books)
      .set("Cookie", [`token=${editorToken}`])
      .send(newBook);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("data");

    bookId = res.body.data._id;
  });

  // ❌ 3. Test creating a book with missing fields
  test("POST /books → should not create a new book with missing fields", async () => {
    const newBook = {
      title: "new Book",
      publishedDate: "1999-01-15",
    };

    const res = await request(app)
      .post(URLs.Books)
      .set("Cookie", [`token=${editorToken}`])
      .send(newBook);

    expect(res.statusCode).toBe(422);
  });

  // ✅ 4. Test fetching a specific book
  test("GET /books/:id → should return a specific book", async () => {
    const res = await request(app)
      .get(`${URLs.Books}/${bookId}`)
      .set("Cookie", [`token=${editorToken}`])
      .send();

    expect(res.statusCode).toBe(200);
  });

  // ❌ 5. Test fetching a book with invalid ID
  test("GET /books/:id → should not return a book with invalid ID", async () => {
    const res = await request(app)
      .get(`${URLs.Books}/5`)
      .set("Cookie", [`token=${editorToken}`])
      .send();

    expect(res.statusCode).toBe(422);
  });

  // ✅ 6. Test updating a book
  test("PUT /books/:id → should update an existing book", async () => {
    const updatedBook = {
      title: "updated Book",
    };
    const res = await request(app)
      .put(`${URLs.Books}/${bookId}`)
      .set("Cookie", [`token=${editorToken}`])
      .send(updatedBook);

    expect(res.statusCode).toBe(200);
  });

  // ❌ 7. Test updating a book with invalid ID
  test("PUT /books/:id → should not update a book with invalid ID", async () => {
    const updatedBook = {
      title: "updated Book",
    };
    const res = await request(app)
      .put(`${URLs.Books}/5`)
      .set("Cookie", [`token=${editorToken}`])
      .send(updatedBook);

    expect(res.statusCode).toBe(422);
  });

  // ✅ 8. Test deleting a book
  test("DELETE /books/:id → should delete a book", async () => {
    const res = await request(app)
      .delete(`${URLs.Books}/${bookId}`)
      .set("Cookie", [`token=${editorToken}`])
      .query({ softDelete: false })
      .send();

    expect(res.statusCode).toBe(403);
  });
});

// ?==> Test User Roles and Permissions
describe("Viewer Role Tests Book API Endoints", () => {
  // ✅ 1. Test fetching all Books
  test("GEt /books → should return all books", async () => {
    const res = await request(app)
      .get(URLs.Books)
      .set("Cookie", [`token=${viewerToken}`])
      .send();

    expect(res.statusCode).toBe(200);
    bookId = res.body.data[0]._id;
  });

  // ❌ 2. Test creating a new book
  test("POST /books → should not create a new book", async () => {
    const newBook = {
      title: "new Book",
      author: "any author",
      publishedDate: "1999-01-15",
    };
    const res = await request(app)
      .post(URLs.Books)
      .set("Cookie", [`token=${viewerToken}`])
      .send(newBook);

    expect(res.statusCode).toBe(403);
  });

  // ✅ 3. Test fetching a specific book
  test("GET /books/:id → should return a specific book", async () => {
    const res = await request(app)
      .get(`${URLs.Books}/${bookId}`)
      .set("Cookie", [`token=${viewerToken}`])
      .send();

    expect(res.statusCode).toBe(200);
  });

  // ❌ 4. Test updating a book
  test("PUT /books/:id → should not update an existing book", async () => {
    const updatedBook = {
      title: "updated Book",
    };
    const res = await request(app)
      .put(`${URLs.Books}/${bookId}`)
      .set("Cookie", [`token=${viewerToken}`])
      .send(updatedBook);

    expect(res.statusCode).toBe(403);
  });

  // ❌ 5. Test deleting a book
  test("DELETE /books/:id → should not delete a book", async () => {
    const res = await request(app)
      .delete(`${URLs.Books}/${bookId}`)
      .set("Cookie", [`token=${viewerToken}`])
      .query({ softDelete: false })
      .send();

    expect(res.statusCode).toBe(403);
  });
});
