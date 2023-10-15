import validator from "validator";

export const emailValidation = (email) => {
  try {
    const valid = validator.isEmail(email);
    return valid;
  } catch (error) {
    console.log("An error occured");
  }
};


