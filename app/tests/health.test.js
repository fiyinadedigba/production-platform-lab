const http = require("http");

const options = {
  hostname: "localhost",
  port: 3000,
  path: "/health",
  method: "GET",
};

const req = http.request(options, (res) => {
  if (res.statusCode !== 200) {
    console.error(`Expected status 200 but got ${res.statusCode}`);
    process.exit(1);
  }

  let data = "";

  res.on("data", (chunk) => {
    data += chunk;
  });

  res.on("end", () => {
    const response = JSON.parse(data);

    if (response.status !== "ok") {
      console.error("Health check failed");
      process.exit(1);
    }

    console.log("Health check passed");
    process.exit(0);
  });
});

req.on("error", (error) => {
  console.error("Request failed:", error.message);
  process.exit(1);
});

req.end();
