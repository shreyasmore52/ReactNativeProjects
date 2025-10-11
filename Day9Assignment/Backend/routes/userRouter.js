const { Router } = require("express");
const userRouter = Router();
const { userAuthMiddleware, JWT_SECRET } = require("../Middleware/userAuthMiddleware"); 
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const pool = require("../db");
const multer = require("multer");

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);


userRouter.post("/verify", userAuthMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Token is valid",
    user: req.user,
  });
});


userRouter.post("/signUp", async (req, res) => {
  const { email, password, firstname, lastname } = req.body;

  try {
    const checkUser = await pool.query("SELECT * FROM appuser WHERE email=$1", [email]);
    if (checkUser.rows.length > 0) return res.json({ msg: "User Exists" });

    const hashPass = await bcrypt.hash(password, 5);
    const result = await pool.query(
      "INSERT INTO appuser (email, password, firstname, lastname) VALUES ($1,$2,$3,$4) RETURNING *",
      [email, hashPass, firstname, lastname]
    );

    await pool.query(
      "INSERT INTO profiles (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING",
      [result.rows[0].id]
    );

    res.json({ msg: "User created", user: result.rows[0] });

  } catch (e) {
    console.error("Signup error:", e);
    res.status(500).json({ error: "Server error" });
  }
});

userRouter.post("/logIn", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM appuser WHERE email=$1", [email]);
    const foundUser = user.rows[0];

    if (!foundUser) return res.json({ msg: "User not exists" });

    const checkPass = await bcrypt.compare(password, foundUser.password);
    if (checkPass) {
      const token = jwt.sign({ userId: foundUser.id }, JWT_SECRET);
      return res.json({ msg: "Logged in", token });
    } else {
      return res.json({ msg: "Incorrect password" });
    }

  } catch (e) {
    console.error("Login error:", e);
    res.status(500).json({ error: "Server error" });
  }
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userDir = path.join(uploadDir, `user_${req.userId}`);
    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });
    cb(null, userDir);
  },

 filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = req.path.includes("profile");
    cb(null, `${name ? "profile" : "background"}${ext}`);
  },
});


const upload = multer({
  storage,
});


userRouter.get("/profile", userAuthMiddleware, async (req, res) => {
  try {
    const data = await pool.query(
      `SELECT a.firstname, a.lastname, a.email,
              p.about, p.address, p.profileimg, p.profilebackimg
       FROM appuser a
       LEFT JOIN profiles p ON p.user_id = a.id
       WHERE a.id=$1`,
      [req.userId]
    );

    if (data.rows.length === 0) return res.status(404).json({ error: "User not found" });

    res.json({ msg: "Profile fetched", user: data.rows[0] });

  } catch (e) {
    console.error("Error fetching profile ->", e);
    res.status(500).json({ error: e.message });
  }
});

userRouter.post("/profile/add", userAuthMiddleware, async (req, res) => {
  try {
    const { about, address, profileimg, profilebackimg } = req.body;

    const result = await pool.query(
      `INSERT INTO profiles (user_id, about, address, profileimg, profilebackimg)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id) 
       DO UPDATE SET 
         about = EXCLUDED.about,
         address = EXCLUDED.address,
         profileimg = EXCLUDED.profileimg,
         profilebackimg = EXCLUDED.profilebackimg
       RETURNING *`,
      [req.userId, about, address, profileimg, profilebackimg]
    );

    res.json({ msg: "Profile saved successfully", profile: result.rows[0] });

  } catch (e) {
    console.error("Error adding profile ->", e);
    res.status(500).json({ error: e.message });
  }
});

userRouter.put("/profile", userAuthMiddleware, async (req, res) => {
  try {
    const { about, address, profileimg, profilebackimg } = req.body;

    const result = await pool.query(
      `UPDATE profiles
       SET about=$1, address=$2, profileimg=$3, profilebackimg=$4
       WHERE user_id=$5
       RETURNING *`,
      [about, address, profileimg, profilebackimg, req.userId]
    );

    res.json({ msg: "Profile updated", profile: result.rows[0] });

  } catch (e) {
    console.error("Error updating profile ->", e);
    res.status(500).json({ error: e.message });
  }
});


userRouter.post( "/upload/profile", userAuthMiddleware, upload.single("image"), async (req, res) => {

    try{
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const dbPath = `/uploads/user_${req.userId}/${req.file.filename}`;
    const result = await pool.query(
      "UPDATE profiles SET profileimg=$1 WHERE user_id=$2 RETURNING *",
      [dbPath, req.userId]
    );

      res.json({ msg: "Profile uploaded", profile: result.rows[0] });
    }catch(err){
        console.error("Error on bakend upload profile", err);
        res.status(500).json({ error: e.message });
    }
  });

userRouter.post("/upload/background", userAuthMiddleware, upload.single("image") ,async (req, res) => {
    try {
        if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
        }
        const dbPath = `/uploads/user_${req.userId}/${req.file.filename}`;
        const result = await pool.query(
          "UPDATE profiles SET profilebackimg=$1 WHERE user_id=$2 RETURNING *",
          [dbPath, req.userId]
        );

        res.json({ msg: "Background uploaded", profile: result.rows[0] });
    } catch (e) {
      console.error("Error uploading background image ->", e);
      res.status(500).json({ error: e.message });
    }
  }
);

module.exports = { userRouter };
