const request = require("supertest");
const app = require("../src/server");

describe("Incidents API", () => {
  let incidentId;

  test("POST /incidents - create incident", async () => {
    const res = await request(app)
      .post("/incidents")
      .send({
        title: "Test incident",
        description: "Something broke",
        severity: "high",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");

    incidentId = res.body.id;
  });

  test("GET /incidents - list incidents", async () => {
    const res = await request(app).get("/incidents");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("incidents");
  });

  test("GET /incidents/:id - get incident", async () => {
    const res = await request(app).get(`/incidents/${incidentId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(incidentId);
  });

  test("PATCH /incidents/:id - update incident", async () => {
    const res = await request(app)
      .patch(`/incidents/${incidentId}`)
      .send({ status: "resolved" });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("resolved");
  });

  test("DELETE /incidents/:id - delete incident", async () => {
    const res = await request(app).delete(`/incidents/${incidentId}`);

    expect(res.statusCode).toBe(200);
  });
});
