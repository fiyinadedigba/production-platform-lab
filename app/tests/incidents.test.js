const request = require("supertest");
const app = require("../src/server");

describe("Incidents API with Auth", () => {
  let token;
  let incidentId;

  beforeAll(async () => {
    const email = `test${Date.now()}@example.com`;

    await request(app).post("/auth/register").send({
      email,
      password: "password",
    });

    const loginRes = await request(app).post("/auth/login").send({
      email,
      password: "password",
    });

    token = loginRes.body.token;
  });

  test("POST /incidents", async () => {
    const res = await request(app)
      .post("/incidents")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test incident",
        description: "Something broke",
        severity: "high",
      });

    expect(res.statusCode).toBe(201);
    incidentId = res.body.id;
  });

  test("GET /incidents", async () => {
    const res = await request(app)
      .get("/incidents")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  test("GET /incidents/:id", async () => {
    const res = await request(app)
      .get(`/incidents/${incidentId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  test("PATCH /incidents/:id", async () => {
    const res = await request(app)
      .patch(`/incidents/${incidentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "resolved" });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("resolved");
  });

  test("DELETE /incidents/:id", async () => {
    const res = await request(app)
      .delete(`/incidents/${incidentId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
});
