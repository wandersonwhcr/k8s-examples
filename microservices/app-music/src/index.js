const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const typeDefs = `
  type Query {
    albums: [Album]
    album(_id: ID): Album
    artists: [Artist]
    artist(_id: ID): Artist
  }

  type Album {
    _id: ID
    name: String
    artists: [Artist]
  }

  type Artist {
    _id: ID
    name: String
    albums: [Album]
  }
`;

const resolvers = {
  Query: {
    albums: require('./resolvers/albums.js'),
    album: require('./resolvers/album.js'),
    artists: require('./resolvers/artists.js'),
    artist: require('./resolvers/artist.js'),
  },
  Album: {
    artists: require('./resolvers/artists.js'),
  },
  Artist: {
    albums: require('./resolvers/albums.js'),
  },
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const app = express();

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

module.exports = app;
