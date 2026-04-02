import axios from "axios"
export const HandleCode = async (req, res) => {
  try {
    const { code, language_id } = req.body;

    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
      {
        source_code: code,
        language_id: language_id,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": process.env.RAPID_API_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      }
    );
    res.json({
      success: true,
      output: response.data.stdout,
      error: response.data.stderr,
    });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
};