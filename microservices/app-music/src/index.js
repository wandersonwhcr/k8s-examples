const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Query {
    albums: [Album]
    album(id: ID): Album
  }

  type Album {
    _id: String
    name: String
  }
`);

const rootValue = {
  albums: require('./queries/albums.js'),
  album: require('./queries/album.js'),
}

const app = express();

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue,
  graphiql: true,
}));

module.exports = app;
