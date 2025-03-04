export const generateOtp = () => {
  return Math.floor(Math.random() * (9000 - 2000) + 2000).toString();
};