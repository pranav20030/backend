import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ConnectDB from './dataBase.js';
import router from './src/route/route.js'

dotenv.config();

const app = express();

//Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors());

//Routes
app.use('/api', router)


ConnectDB();

//Clobal Error Handling Middle Ware 
app.use((err, req, res,next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.stack});
})

//start Server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server stated on port ${PORT}`)
})