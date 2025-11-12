import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./dist/server/routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

registerRoutes(app);

app.use(express.static(path.join(__dirname, "dist/public")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/public/index.html"));
});

app.listen(port, () => {
  console.log("server running on port " + port);
});
