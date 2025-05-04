import dotenv from "dotenv";
import express from "express";
import authRouter from "./Routes/auth";
import electionRouter from "./Routes/election";
import mongoose from "mongoose";
import candidateRouter from "./Routes/candidate";
import cors from 'cors'
import infoRouter from "./Routes/info";
import voteRouter from "./Routes/vote";
import queryRoutes from "./routes/queryRoutes";

dotenv.config();

const app = express();
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))

//Middlewares
app.use(express.json());

//Routes
app.use("/auth", authRouter);
app.use("/election", electionRouter);
app.use("/candidate", candidateRouter);
app.use("/info", infoRouter);
app.use("/vote", voteRouter);
app.use("/api/query", queryRoutes);

const StartDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};

const StartServer = async () => {
  await StartDatabase().then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  });
};

StartServer();
