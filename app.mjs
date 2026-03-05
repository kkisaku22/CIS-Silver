// app.mjs
import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("❌ MONGO_URI missing in .env");
  process.exit(1);
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));

// Mongo Client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Connect to Mongo
async function connectDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}
connectDB();

// =======================
// ROUTES
// =======================

// Serve miniApp.html
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'miniApp.html'));
});

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: "healthy",
    app: "Mini Budget Tracker",
    author: "Karel Kisaku"
  });
});

// =======================
// CRUD ROUTES
// =======================

// CREATE
app.post('/api/items', async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    if (!title || !amount || !category || !date) {
      return res.status(400).json({ error: "All fields required" });
    }

    const result = await client
      .db('miniAppDB')
      .collection('items')
      .insertOne({
        title,
        amount: parseFloat(amount),
        category,
        date,
        createdAt: new Date()
      });

    res.status(201).json({ message: "Item created", id: result.insertedId });

  } catch (err) {
    res.status(500).json({ error: "Create failed" });
  }
});

// READ
app.get('/api/items', async (req, res) => {
  try {
    const items = await client
      .db('miniAppDB')
      .collection('items')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json(items);

  } catch (err) {
    res.status(500).json({ error: "Read failed" });
  }
});

// UPDATE
app.put('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category, date } = req.body;

    const result = await client
      .db('miniAppDB')
      .collection('items')
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { title, amount: parseFloat(amount), category, date, updatedAt: new Date() } }
      );

    if (!result.matchedCount)
      return res.status(404).json({ error: "Item not found" });

    res.status(200).json({ message: "Item updated" });

  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

// DELETE
app.delete('/api/items/:id', async (req, res) => {
  try {
    const result = await client
      .db('miniAppDB')
      .collection('items')
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (!result.deletedCount)
      return res.status(404).json({ error: "Item not found" });

    res.status(200).json({ message: "Item deleted" });

  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 MiniApp running on port ${PORT}`);
});