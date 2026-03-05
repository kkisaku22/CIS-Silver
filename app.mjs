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
  console.error("❌ MONGO_URI missing");
  process.exit(1);
}

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

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
connectDB();



// SPA
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

// Health
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: "healthy",
    app: "Budget Tracker",
    author: "Karel Kisaku"
  });
});


app.post('/api/expenses', async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;

    if (!description || !amount || !category || !date) {
      return res.status(400).json({ error: "All fields required" });
    }

    const result = await client
      .db('budgetApp')
      .collection('expenses')
      .insertOne({
        description,
        amount: parseFloat(amount),
        category,
        date,
        createdAt: new Date()
      });

    res.status(201).json({ message: "Expense added", id: result.insertedId });

  } catch (err) {
    res.status(500).json({ error: "Create failed" });
  }
});

// READ
app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await client
      .db('budgetApp')
      .collection('expenses')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json(expenses);

  } catch (err) {
    res.status(500).json({ error: "Read failed" });
  }
});

// UPDATE
app.put('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, category, date } = req.body;

    const result = await client
      .db('budgetApp')
      .collection('expenses')
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { description, amount: parseFloat(amount), category, date, updatedAt: new Date() } }
      );

    if (!result.matchedCount)
      return res.status(404).json({ error: "Expense not found" });

    res.status(200).json({ message: "Expense updated" });

  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

// DELETE
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const result = await client
      .db('budgetApp')
      .collection('expenses')
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (!result.deletedCount)
      return res.status(404).json({ error: "Expense not found" });

    res.status(200).json({ message: "Expense deleted" });

  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Budget Tracker running on port ${PORT}`);
});