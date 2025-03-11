const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

const serviceAccount = require('../firebaseConfig.json'); // Ensure this path is correct

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const port = 3001; 
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// ดึงข้อมูลเอกสารทั้งหมด
app.get('/api/documents', async (req, res) => {
    try {
      const snapshot = await db.collection('documents').get();
      const documents = snapshot.docs.map(doc => doc.data());
      res.json(documents);
    } catch (error) {
      res.status(500).send('Error fetching documents');
    }
});

// อัปเดตสถานะเอกสาร (Approve/Reject)
app.post('/api/documents/update-status', async (req, res) => {
  const { documentId, status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const docRef = db.collection('documents').doc(documentId);
    await docRef.update({ status });
    res.status(200).json({ message: 'Document status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ส่งข้อความจาก HR ไปยังพนักงาน
app.post('/api/messages', async (req, res) => {
    const { sender, receiver, message } = req.body;
    try {
      const newMessage = {
        sender,
        receiver,
        message,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      };
      await db.collection('messages').add(newMessage);
      res.status(200).send('Message sent');
    } catch (error) {
      res.status(500).send('Error sending message');
    }
});

// ดึงประวัติข้อความทั้งหมด
app.get('/api/messages', async (req, res) => {
    try {
      const snapshot = await db.collection('messages').orderBy('timestamp').get();
      const messages = snapshot.docs.map(doc => doc.data());
      res.json(messages);
    } catch (error) {
      res.status(500).send('Error fetching messages');
    }
});

// ดึงเอกสารทั้งหมด (เฉพาะ HR)
app.get("/api/documents", async (req, res) => {
  try {
    const snapshot = await db.collection("documents").get();
    const documents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ดึงเอกสารของพนักงานแต่ละคน
app.get("/api/documents/:employeeId", async (req, res) => {
  const { employeeId } = req.params;
  try {
    const snapshot = await db.collection("documents").where("employeeId", "==", employeeId).get();
    const documents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ประเภทของเอกสารที่พนักงานอาจส่ง
const employees = [
  { id: "EMP03", name: "Johnson" },
  { id: "EMP04", name: "Robin" },
  { id: "EMP05", name: "Robert" },
  { id: "EMP06", name: "Fin" },
  { id: "EMP07", name: "Isala" },
  { id: "EMP08", name: "Hit" },
  { id: "EMP09", name: "Min" },
  { id: "EMP10", name: "Suchitra" },
  { id: "EMP11", name: "Ken" },
  { id: "EMP12", name: "Sushi" },
  { id: "EMP13", name: "Mark" },
  { id: "EMP14", name: "Ham" },
  { id: "EMP15", name: "Moodeng" },
];

// ประเภทของเอกสารที่พนักงานอาจส่ง
const documentTypes = [
  "Leave Request",
  "Expense Report",
  "Contract Renewal",
  "Work Permit",
  "Medical Certificate",
];

// ฟังก์ชันสร้างเอกสารให้พนักงานทุกคน
const addDocuments = async () => {
  for (const emp of employees) {
    const docRef = db.collection("documents").doc(); // ให้ Firestore สร้าง ID อัตโนมัติ
    const documentId = docRef.id; // Get the generated document ID
    const randomDocType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
    
    await docRef.set({
      documentId: documentId, // Include the document ID in the document data
      employeeId: emp.id,
      employeeName: emp.name,
      documentType: randomDocType,
      fileURL: `https://firebasestorage.googleapis.com/v0/b/your-bucket-name/o/${emp.id}.pdf`,
      status: "pending",
      submittedAt: new Date().toISOString(),
    });

    console.log(`Added document for ${emp.name} with ID ${documentId}`);
  }
};

addDocuments();
