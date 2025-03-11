const admin = require("firebase-admin");
const bcrypt = require("bcrypt");

// Connect to Firebase (Replace with your project’s credentials)
const serviceAccount = require("./firebaseConfig.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function updatePasswords() {
  const employeesRef = db.collection("employees"); // Collection name
  const snapshot = await employeesRef.get();
  
  for (const doc of snapshot.docs) { // Use for...of instead of forEach()
    const data = doc.data();
    const plainPassword = String(data.password); // Convert to String before checking

    if (!plainPassword.startsWith("$2b$")) { // Check if already hashed
      const hashedPassword = await bcrypt.hash(plainPassword, 10); // 🔹 Hash with bcrypt

      // 🔹 Update Firestore
      await employeesRef.doc(doc.id).update({ password: hashedPassword });

      console.log(`Updated password for ${data.name} `);
    }
  }

  console.log("Successfully upgraded all passwords!");
}

updatePasswords().catch(console.error);
