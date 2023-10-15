export const checkPassword =  (password) =>{
   const regularexpression = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
   const value = regularexpression.test(password)
   return value
}

