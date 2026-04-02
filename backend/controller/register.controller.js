import User from "../model/user.model.js";
// REGISTER
export const register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      firstName: firstName || "",
      lastName: lastName || "",
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};