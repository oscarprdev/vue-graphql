import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core'

// HTTP connection to the API
const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
})

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
})

export default apolloClient
