const  express = require('express');
const {graphqlHTTP} = require('express-graphql');
const schema = require('./graphql/schema');
const {connectDB} = require('./db');
const {authenticate} = require('./middlewares/auth');

connectDB();
const app = express();
const port = 3000;

app.use(authenticate);

app.get('/', (req, res) => res.send('welcome to my api!'));

app.use('/graphql',graphqlHTTP({
    schema,
    graphiql: true,
}));

app.listen(port, () => console.log(`Server on port ${port}!`));
