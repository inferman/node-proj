const mongoose = require('mongoose');
const dotenv =  require('dotenv');

dotenv.config({path: './config.env'});

mongoose.connect(process.env.DATABASE_LOCAL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(_ =>  console.log('DB connection successful!'))

const app = require('./app');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
