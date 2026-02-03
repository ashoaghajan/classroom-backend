import express from "express";

const app = express();
const PORT = 8000;

// JSON middleware
app.use(express.json());

// Root GET route that returns a short message
app.get("/", (req, res) => {
  res.json({ message: "Hello from Express.js TypeScript server!" });
});

// Start the server and log the URL
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
