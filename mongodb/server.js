const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const childRouter = require('../mongodb/routes/childRouter'); 
const scheduleRouter = require('../mongodb/routes/scheduleRouter'); 
const subRouter = require('../mongodb/routes/subRouter'); 
const postRouter = require('../mongodb/routes/postRouter'); 
const diaryRouter = require('../mongodb/routes/diaryRouter'); 
const notificationRouter = require('../mongodb/routes/notificationRouter'); 
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Kết nối MongoDB thành công'))
  .catch(err => console.error(err));

app.use('/api/auth', require('./routes/auth'));
app.use("/api/child", childRouter);
app.use("/api/schedule", scheduleRouter);
app.use("/api/sub", subRouter);
app.use("/api/post", postRouter);
app.use("/api/diary", diaryRouter);notificationRouter
app.use("/api/notification", notificationRouter);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server chạy trên cổng ${PORT}`));
