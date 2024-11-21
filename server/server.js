const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for parsing JSON bodies and cookies
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles:true
}))
// Sample route to check server status
app.get('/', (req, res) => {
    res.json({ msg: "WORKING" });
});

//routes
app.use("/user", require("./routes/userRouter"));
app.use('/api', require("./routes/categoryRouter"));
app.use('/api', require("./routes/upload"));
app.use('/api', require("./routes/productRouter"));



// Connect to MongoDB
const URI = process.env.MONGODB_URL;
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("MongoDB connected");

    // Start the server after successful DB connection
    app.listen(PORT, () => {
        console.log(`SERVER IS RUNNING on port ${PORT}...`);
    });
}).catch((e) => {
    console.error("MongoDB connection error:", e);
});
