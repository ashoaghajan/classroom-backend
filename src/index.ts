import cors from "cors";
import express from "express";
import { subjectsRouter } from "./routes/subjects";

const app = express();
const PORT = 8000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

// JSON middleware
app.use(express.json());
app.use("/api/subjects", subjectsRouter);

// Root GET route that returns a short message
app.get("/", (req, res) => {
  res.json({ message: "Hello from Express.js TypeScript server!" });
});

// Start the server and log the URL
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
