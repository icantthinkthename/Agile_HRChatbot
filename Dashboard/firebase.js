const admin = require("firebase-admin");
require('dotenv').config(); 

admin.initializeApp({
  credential: admin.credential.cert(require("./firebaseConfig.json")),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.firestore();

app.get("/api/documents", async (req, res) => {
    try {
      const snapshot = await db.collection("documents").get();
      const documents = snapshot.docs.map(doc => doc.data());
      res.json({ success: true, documents });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/documents/approve", async (req, res) => {
    const { documentId, status } = req.body;
    
    try {
      const docRef = db.collection("documents").doc(documentId);
      await docRef.update({ status: status });
      res.json({ success: true, message: "Document status updated successfully." });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/messages", async (req, res) => {
    const { sender, receiver, message } = req.body;
  
    try {
      await db.collection("messages").add({
        sender,
        receiver,
        message,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
      res.json({ success: true, message: "Message sent successfully." });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  