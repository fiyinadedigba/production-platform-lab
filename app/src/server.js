const express = require("express");
const client = require("prom-client");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

const prisma = new PrismaClient();

app.use(express.json());

// ======================
// Prometheus Metrics
// ======================
client.collectDefaultMetrics();

const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
});

app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();

  res.on("finish", () => {
    const labels = {
      method: req.method,
      route: req.route?.path || req.path,
      status_code: res.statusCode,
    };

    httpRequestCounter.inc(labels);
    end(labels);
  });

  next();
});

// ======================
// Auth Middleware
// ======================
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Invalid authorization format" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// ======================
// Health / Info
// ======================
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get("/version", (req, res) => {
  res.json({ version: "1.0.0" });
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// ======================
// Auth Routes
// ======================
app.post("/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "email and password are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      id: user.id,
      email: user.email,
    });
  } catch {
    res.status(400).json({
      error: "User already exists or registration failed",
    });
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "email and password are required",
    });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({
      error: "Invalid credentials",
    });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
});

// ======================
// AI Analysis Endpoint
// ======================
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

// ======================
// Incident API
// ======================
app.post("/incidents", authMiddleware, async (req, res) => {
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

app.get("/incidents", authMiddleware, async (req, res) => {
  try {
    const incidents = await prisma.incident.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json({
      count: incidents.length,
      incidents,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch incidents" });
  }
});

app.get("/incidents/:id", authMiddleware, async (req, res) => {
  try {
    const incident = await prisma.incident.findUnique({
      where: { id: req.params.id },
    });

    if (!incident) {
      return res.status(404).json({ error: "Incident not found" });
    }

    res.json(incident);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch incident" });
  }
});

app.patch("/incidents/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, severity, status } = req.body;

    const incident = await prisma.incident.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(severity && { severity }),
        ...(status && { status }),
      },
    });

    res.json(incident);
  } catch {
    res.status(404).json({ error: "Incident not found" });
  }
});

app.delete("/incidents/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await prisma.incident.delete({
      where: { id: req.params.id },
    });

    res.json({ deleted });
  } catch {
    res.status(404).json({ error: "Incident not found" });
  }
});

// ======================
// Start Server
// ======================
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
