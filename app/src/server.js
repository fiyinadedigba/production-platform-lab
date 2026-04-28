const express = require("express");
const client = require("prom-client");
const { PrismaClient } = require("@prisma/client");

const app = express();
const PORT = process.env.PORT || 3000;

const prisma = new PrismaClient();

app.use(express.json());

// ======================
// Prometheus Metrics
// ======================
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "status_code"],
  buckets: [50, 100, 200, 300, 500, 1000],
});

register.registerMetric(httpRequestDurationMicroseconds);

// Middleware to measure request duration
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();

  res.on("finish", () => {
    end({
      route: req.route?.path || req.path,
      method: req.method,
      status_code: res.statusCode,
    });
  });

  next();
});

// ======================
// Health / Info
// ======================
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/version", (req, res) => {
  res.json({ version: "1.0.0" });
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// ======================
// AI Analyze Endpoint
// ======================
app.post("/analyze", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({
      error: "Missing required field: text",
    });
  }

  // Mock AI response
  res.json({
    analysis:
      "Elevated error rate detected. Investigate failing endpoints. Latency increase observed. Possible performance bottleneck.",
  });
});

// ======================
// Incident API
// ======================

// Create incident
app.post("/incidents", async (req, res) => {
  try {
    const { title, description, severity } = req.body;

    if (!title || !description || !severity) {
      return res.status(400).json({
        error: "title, description, and severity are required",
      });
    }

    const incident = await prisma.incident.create({
      data: {
        title,
        description,
        severity,
      },
    });

    res.status(201).json(incident);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create incident" });
  }
});

// List incidents
app.get("/incidents", async (req, res) => {
  try {
    const incidents = await prisma.incident.findMany();

    res.json({
      count: incidents.length,
      incidents,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch incidents" });
  }
});

// Get incident by ID
app.get("/incidents/:id", async (req, res) => {
  try {
    const incident = await prisma.incident.findUnique({
      where: { id: req.params.id },
    });

    if (!incident) {
      return res.status(404).json({
        error: "Incident not found",
      });
    }

    res.json(incident);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch incident" });
  }
});

// Update incident
app.patch("/incidents/:id", async (req, res) => {
  try {
    const incident = await prisma.incident.update({
      where: { id: req.params.id },
      data: req.body,
    });

    res.json(incident);
  } catch (error) {
    return res.status(404).json({
      error: "Incident not found",
    });
  }
});

// Delete incident
app.delete("/incidents/:id", async (req, res) => {
  try {
    const deleted = await prisma.incident.delete({
      where: { id: req.params.id },
    });

    res.json({ deleted });
  } catch (error) {
    res.status(404).json({
      error: "Incident not found",
    });
  }
});

// ======================
// Start server (test-safe)
// ======================
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
