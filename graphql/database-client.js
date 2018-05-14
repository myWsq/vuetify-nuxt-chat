import createApolloClient from './test'


// Config
const options = {
    ssr: true,
    endpoints: {
        graphql: 'http://111.231.68.175:4466',
        subscription: 'ws://111.231.68.175:4466',
    },
    subscriptions: true
}

// Create apollo client
export default (ctx) => {
    return createApolloClient(options,ctx)
}