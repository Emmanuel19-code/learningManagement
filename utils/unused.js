export const GenerateNewOtp = Trycatch(async (req, res) => {
  const userId = req.user.uniqueId;
  const isUser = await user.findOne({ userId });
  const hasotp = await storeOTP.findOne({ owner: userId });
  if (!hasotp) {
    const newotp = isUser.GenerateOTP();
    const sendmail = await sendOneTimePassword({
      name: isUser.name,
      email: isUser.email,
      verificationToken: newotp,
    });
    if (!sendmail) {
      res.status().json({
        msg: "Please make sure your email is correct",
      });
    }
    res.status(StatusCodes.OK).json({
      msg: "Please check your mail for the new otp",
    });
  }
  const deleOldOTP = await storeOTP.deleteOne({ owner: userId });
  const newotp = isUser.GenerateOTP();
  const saveNewOtp = await storeOTP.create({ owner: userId, otpvalue: newotp });
  if (!saveNewOtp) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Please request a new otp an error occured on our side",
    });
  }
  const sendmail = await sendOneTimePassword({
    name: isUser.name,
    email: isUser.email,
    verificationToken: newotp,
  });
  if (!sendmail) {
    res.status().json({
      msg: "Please make sure your email is correct",
    });
  }
  res.status(StatusCodes.OK).json({
    msg: "Please check your mail for the new otp",
    otp: newotp,
  });
});
