import express from "express";
import cors from "cors";
const app = express();
app.use(cors());
app.get("/", (req, res) => {
  res.json({ message: "Hello World" }); 
});

const port=process.env.port||3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});