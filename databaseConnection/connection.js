import mongoose from "mongoose";
import {} from "dotenv/config";

export const connection = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://emmanueladane52:${process.env.DATABASE_PASSWORD}@cluster0.kdhhylm.mongodb.net/managementsystem?retryWrites=true&w=majority`
    );
    console.log("connected to the database");
  } catch (error) {
    console.log("An error occured while connecting to the database");
  }
};
