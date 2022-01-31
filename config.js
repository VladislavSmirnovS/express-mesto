const {
  PORT = 3000,
  DB_ADDRESS = 'mongodb://localhost:27017/express-mesto',
  JWT_SECRET = 'eb28135ebcfc17578f96d4d65b6c7871f2c803be4180c165061d5c2db621c51b',
} = process.env;

module.exports = {
  PORT,
  DB_ADDRESS,
  JWT_SECRET,
};
