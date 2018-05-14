import {
  ApolloClient
} from 'apollo-client'
import {
  split
} from 'apollo-link'
import {
  HttpLink
} from 'apollo-link-http'
import {
  InMemoryCache
} from 'apollo-cache-inmemory'
import {
  WebSocketLink
} from 'apollo-link-ws'
import {
  getMainDefinition
} from 'apollo-utilities'
import {
  setContext
} from 'apollo-link-context'

import {
  SubscriptionClient
} from 'subscriptions-transport-ws'

import ws from 'ws'

function getAuth() {
  // get the authentication token
  const token = ''
  // return the headers to the context so httpLink can read them
  return token ? `Bearer ${token}` : ''
}

function restartWebsockets(wsClient) {
  // Copy current operations
  const operations = Object.assign({}, wsClient.operations)

  // Close connection
  wsClient.close(true)

  // Open a new one
  wsClient.connect()

  // Push all current operations to the new connection
  Object.keys(operations).forEach(id => {
    wsClient.sendMessage(
      id,
      MessageTypes.GQL_START,
      operations[id].options
    )
  })
}

// Create the apollo client
export default function createApolloClient({
  ssr,
  endpoints,
  subscriptions
}, ctx) {
  let wsClient

  let link = new HttpLink({
    // You should use an absolute URL here
    uri: endpoints.graphql,
  })

  // HTTP Auth header injection
  const authLink = setContext((_, {
    headers
  }) => ({
    headers: {
      ...headers,
      authorization: getAuth(),
    },
  }))

  // Concat all the http link parts
  link = authLink.concat(link)

  // Apollo cache
  const cache = new InMemoryCache()

  if (!ssr) {
    // If on the client, recover the injected state
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-underscore-dangle
      const state = window.__APOLLO_STATE__
      if (state) {
        // If you have multiple clients, use `state.<client_id>`
        cache.restore(state.defaultClient)
      }
    }
  }


  // Web socket
  if (subscriptions && process.client) {
    wsClient = new SubscriptionClient(endpoints.subscription, {
      reconnect: true,
      connectionParams: () => ({
        'Authorization': getAuth(),
      }),
    })

    // Create the subscription websocket link
    const wsLink = new WebSocketLink(wsClient)

    link = split(
      // split based on operation type
      ({
        query
      }) => {
        const {
          kind,
          operation
        } = getMainDefinition(query)
        return kind === 'OperationDefinition' &&
          operation === 'subscription'
      },
      wsLink,
      link
    )
  }



  const apolloClient = new ApolloClient({
    link,
    cache,
    // Additional options
    ...(ssr ? {
      // Set this on the server to optimize queries when SSR
      ssrMode: true,
    } : {
      // This will temporary disable query force-fetching
      ssrForceFetchDelay: 100,
      // Apollo devtools
      connectToDevTools: process.env.NODE_ENV !== 'production',
    }),
  })

  // Manually call this when user log in
  apolloClient.$onLogin = token => {
    localStorage.setItem('apollo-token', token)
    if (wsClient) restartWebsockets(wsClient)
  }

  // Manually call this when user log out
  apolloClient.$onLogout = () => {
    localStorage.removeItem('apollo-token')
    if (wsClient) restartWebsockets(wsClient)
    apolloClient.resetStore()
  }

  return apolloClient
}