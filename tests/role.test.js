import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import connectDB from "../src/database/db-connect.js";

let adminToken, roleId;

beforeAll(async () => {
  // Ensure DB connection before tests
  connectDB();

  // Get admin token
  const res = await request(app)
    .post("/api/v1/auth/login")
    .set("Content-Type", "application/json")
    .send({
      email: "admin@email.com",
      password: "Asd@@123",
    });

  

  const cookies = res.headers["set-cookie"];
  if (cookies && cookies.length > 0) {
    adminToken = cookies[0].split(";")[0]; // Extract only the first cookie value
  }

});

afterAll(async () => {
  // Close DB connection after tests
  await mongoose.connection.close();
});

describe("Role API Endoints", () => {
  // ✅ 1. Test fetching all roles
  test("GET /roles → should return all roles", async () => {
    const res = await request(app)
      .get("/api/v1/roles")
      .set("Cookie", [`${adminToken}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // ✅ 2. Test creating a new role
  test("POST /roles → should create a new role", async () => {
    const newRole = { name: "test", permissions: ["Read", "Create"] };

    const res = await request(app)
      .post("/api/v1/roles")
      .set("Cookie", [`${adminToken}`])
      .send(newRole);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data.name).toBe(newRole.name);

    roleId = res.body.data._id;
  });

  // ❌ 3. Test creating a role with missing fields
  test("POST /roles → should not create a new role with missing fields", async () => {
    const res = await request(app)
      .post("/api/v1/roles")
      .set("Cookie", [`${adminToken}`])
      .send({});

    expect(res.statusCode).toBe(422);
  });

  // ✅ 4. Test fetching a role by ID
  test("GET /roles/:id → should return a specific role", async () => {
    const res = await request(app)
      .get(`/api/v1/roles/${roleId}`)
      .set("Cookie", [`${adminToken}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data._id).toBe(roleId);
  });

  // ❌ 5. Test fetching a role with invalid ID
  test("GET /roles/:id → should not return a role with invalid ID", async () => {
    const res = await request(app)
      .post(`/api/v1/roles/5`)
      .set("Cookie", [`${adminToken}`]);

    expect(res.statusCode).toBe(404);
  });

  // ✅ 6. Test updating a role
  test("PUT /roles/:id → should update an existing role", async () => {
    const updatedRole = { name: "updated Manager" };

    const res = await request(app)
      .put(`/api/v1/roles/${roleId}`)
      .set("Cookie", [`${adminToken}`])
      .send(updatedRole);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data.name).toBe(updatedRole.name);
  });

  // ❌ 7. Test updating a role with an invalid ID
  test("PUT /roles/:id → should update an existing role", async () => {
    const updatedRole = { name: "updated Manager" };

    const res = await request(app)
      .put(`/api/v1/roles/67d9af4a664ac394baaac733`)
      .set("Cookie", [`${adminToken}`])
      .send(updatedRole);

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe("not_found");
    expect(res.body).toHaveProperty("message");
  });

  // ✅ 8. Test deleting a role
  test("DELETE /roles/:id → should delete a role", async () => {
    const res = await request(app)
      .delete(`/api/v1/roles/${roleId}`)
      .query({ softDelete: false })
      .set("Cookie", [`${adminToken}`]);

    expect(res.statusCode).toBe(204);
  });

  // ❌ 9. Test deleting a non-existent role
  test("DELETE /roles/:id → should delete a role", async () => {
    const res = await request(app)
      .delete(`/api/v1/roles/${roleId}`)
      .query({ softDelete: false })
      .set("Cookie", [`${adminToken}`]);

    expect(res.statusCode).toBe(404);
  });
});
