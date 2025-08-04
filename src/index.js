require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route (cek apakah server jalan)
app.get("/", (req, res) => {
  res.send("Inventory System API is running 🚀");
});

// Tambahkan route lainnya di sini
// app.use('/products', require('./routes/products'));
// app.use('/users', require('./routes/users'));

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
