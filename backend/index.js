import { app } from "./app.js";
app.get("/",(req,res)=>{
    res.send("Hello World");
})
const port =process.env.PORT||3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log("API KEY:", process.env.GROQ_API_KEY ? "✓ Loaded" : "✗ Missing");
});