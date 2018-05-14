export const state = () => ({
  sidebar: false,
  dbClient: null
})

export const mutations = {
  toggleSidebar(state) {
    state.sidebar = !state.sidebar
  }
}