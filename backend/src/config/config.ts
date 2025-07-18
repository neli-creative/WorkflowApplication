export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  database: {
    uri: process.env.MONGODB_URI,
  },
});
