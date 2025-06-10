import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";


const client = new ApolloClient({
 link: new HttpLink({
  uri: `${import.meta.env.VITE_SERVER_URL}/graphql`,
  credentials: "include",
 }),
 cache: new InMemoryCache(),
});

export default client;