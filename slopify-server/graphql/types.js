const typeDefs = `#graphql
  scalar JSON

  type Event {
    id: ID!
    name: String!
    dateFrom: String!
    dateTo: String!
    artists: [JSON]
    location: [Float]
    createdBy: ID!
  }

  type Query {
    events: [Event]
    allEvents: [Event]
    searchArtist(name: String!): [Artist]
  }

  type Mutation {
    createEvent(
      name: String!
      dateFrom: String!
      dateTo: String!
      artists: [JSON]
      location: [Float]
    ): Event

    updateEvent(
      eventId: ID!
      name: String!
      dateFrom: String!
      dateTo: String!
      artists: [JSON]
      location: [Float]
    ): Event

    deleteEvent(eventId: ID!): Boolean
  }

  type Artist {
    id: ID!
    href: String
    imageUrl: String
    name: String!
  }

`;

export default typeDefs;
