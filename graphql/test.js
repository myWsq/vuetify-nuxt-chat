import {
    ApolloLink,
    concat,
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

export default (ctx) => {
    const httpLink = new HttpLink({
        uri: 'http://111.231.68.175:4466',
    })

    // Create a WebSocket link:
    let link = httpLink
    if (process.client) {
        let wsLink = new WebSocketLink({
            uri: 'ws://111.231.68.175:4466',
            options: {
                reconnect: true
            }
        })

        link = split(
            ({query}) => {
              const {kind, operation} = getMainDefinition(query)
              return kind === 'OperationDefinition' && operation === 'subscription'
            },
            wsLink,
            httpLink
          )
    }

    // const authMiddleware = new ApolloLink((operation, forward) => {
    //     // add the authorization to the headers
    //     const token = ''
    //     operation.setContext({
    //         headers: {
    //             authorization: `Bearer ${
    //                 token
    //             }`
    //         }
    //     })
    //     return forward(operation)
    // })



    return {
        link: link,
        cache: new InMemoryCache()
    }
}