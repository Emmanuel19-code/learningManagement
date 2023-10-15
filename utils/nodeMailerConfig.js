import {} from "dotenv/config"
export default  {
  service:'gmail',
  secure:true,
  auth: {
    user:`${process.env.EMAIL}`,
    pass:`${process.env.EMAIL_PASSWORD}`
  },
};
