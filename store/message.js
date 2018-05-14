import Vue from 'vuex'

export const state = () => ({
    list: [],
    loading: 0
})

export const mutations = {
    set(state, list) {
        state.list = list
    },
    push(state, text) {
        state.list.push(text)
    },
    start(state) {
        state.loading++
    },
    finish(state) {
        state.loading--
    }
}

export const actions = {
    async send({
        commit
    }, text) {
        commit('start')
        let client = this.app.apolloProvider.defaultClient
        let {data} = await client.mutate({
            mutation: require('~/graphql/message/create.gql'),
            variables: {
                input: text
            }
        })
        commit('finish')
    },
}