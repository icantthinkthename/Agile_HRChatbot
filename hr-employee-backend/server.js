const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const bcrypt = require("bcrypt");

// โหลด Firebase Config
const serviceAccount = require("./firebaseConfig.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from root directory
app.use(express.static('../'));

const db = admin.firestore();

// API endpoint เพื่อตรวจสอบสถานะของเซิร์ฟเวอร์
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'API server is running' });
});

const PORT = 3000; // Changed port to 3000
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });

// 🔹 API LOGIN
app.post("/login", async (req, res) => {
  const { employeeID, password } = req.body;

  try {
    const userDoc = await db.collection("employees").doc(employeeID).get();

    if (!userDoc.exists) {
      return res.status(404).json({ success: false, message: "Employee ID is Wrong" });
    }

    const userData = userDoc.data();
    const passwordMatch = await bcrypt.compare(password, userData.password);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: "password is incorrect" });
    }

    res.json({ success: true, role: userData.role, name: userData.name, position: userData.position });
  } catch (error) {
    res.status(500).json({ success: false, message: "เกิดข้อผิดพลาด" });
  }
});

app.post("/logout", (req, res) => {
    res.json({ success: true, message: "Log out successfully" });
  });