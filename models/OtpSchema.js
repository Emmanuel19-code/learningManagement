import mongoose, { mongo } from "mongoose";


const OtpSchema = new mongoose.Schema(
  {
    owner: {
      type: String,
      ref: "user",
    },
    otpvalue: {
      type: String,
      required: [true, "Please provide the detail"],
    },
  },
  { timestamps: true }
);


OtpSchema.methods.HashOtp = function () {
  const HashedOtp = jwt.sign(
    {
      otpvalue: this.otpvalue,
    },
    process.env.HASH_PASSWORD,
    {
      expiresIn: "10m",
    }
  );
  return { HashedOtp };
};

const storeOTP = mongoose.model("storeOTP", OtpSchema);
export default storeOTP;
