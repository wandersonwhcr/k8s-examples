const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const typeDefs = `
  type Query {
    albums: [Album]
    album(id: ID): Album
    artists: [Artist]
    artist(id: ID): Artist
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
    albums: require('./queries/albums.js'),
    album: require('./queries/album.js'),
    artists: require('./queries/artists.js'),
    artist: require('./queries/artist.js'),
  },
  Album: {
    artists: require('./queries/artists.js'),
  },
  Artist: {
    albums: require('./queries/albums.js'),
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
