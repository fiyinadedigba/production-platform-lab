const express = require("express");
const client = require("prom-client");

const app = express();
const PORT = process.env.PORT || 3000;
const incidents = [];

app.use(express.json());


// Default Prometheus metrics
client.collectDefaultMetrics();

// Request counter
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

// Request latency histogram
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
});

// Metrics middleware
app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.path,
      status_code: res.statusCode,
    });
  });

  next();
});

app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();

  res.on("finish", () => {
    end({
      method: req.method,
      route: req.path,
      status_code: res.statusCode,
    });
  });

  next();
});

// Health endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Version endpoint
app.get("/version", (req, res) => {
  res.json({
    version: "1.0.0",
  });
});

// Prometheus metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// AI analysis endpoint (mocked)
app.post("/analyze", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({
      error: "Missing required field: text",
    });
  }

  let analysis = "System appears stable.";

  if (text.toLowerCase().includes("error")) {
    analysis = "Elevated error rate detected. Investigate failing endpoints.";
  }

  if (text.toLowerCase().includes("latency")) {
    analysis += " Latency increase observed. Possible performance bottleneck.";
  }

  res.json({ analysis });
});

// Create incident
app.post("/incidents", (req, res) => {
  const { title, description, severity } = req.body;

  if (!title || !description || !severity) {
    return res.status(400).json({
      error: "title, description, and severity are required",
    });
  }

  const incident = {
    id: String(Date.now()),
    title,
    description,
    severity,
    status: "open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  incidents.push(incident);

  res.status(201).json(incident);
});

// List incidents
app.get("/incidents", (req, res) => {
  res.json({
    count: incidents.length,
    incidents,
  });
});

// Get incident by ID
app.get("/incidents/:id", (req, res) => {
  const incident = incidents.find((item) => item.id === req.params.id);

  if (!incident) {
    return res.status(404).json({
      error: "Incident not found",
    });
  }

  res.json(incident);
});

// Update incident
app.patch("/incidents/:id", (req, res) => {
  const incident = incidents.find((item) => item.id === req.params.id);

  if (!incident) {
    return res.status(404).json({
      error: "Incident not found",
    });
  }

  const { title, description, severity, status } = req.body;

  if (title) incident.title = title;
  if (description) incident.description = description;
  if (severity) incident.severity = severity;
  if (status) incident.status = status;

  incident.updatedAt = new Date().toISOString();

  res.json(incident);
});

// Delete incident
app.delete("/incidents/:id", (req, res) => {
  const index = incidents.findIndex((item) => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      error: "Incident not found",
    });
  }

  const deleted = incidents.splice(index, 1);

  res.json({
    deleted: deleted[0],
  });
});

   if (require.main === module) {
     app.listen(PORT, () => {
       console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
