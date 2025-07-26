export const state = () => ({
  authUser: null
})

export const mutations = {
  ON_AUTH_STATE_CHANGED_MUTATION(state, { authUser, claims }) {
    if (!authUser) {
      state.authUser = null
      return
    }

    const { uid, email, emailVerified, displayName, photoURL } = authUser

    state.authUser = {
      uid,
      displayName,
      email,
      emailVerified,
      photoURL: photoURL || null,
      // use custom claims to control access
      isAdmin: claims?.custom_claim || false
    }
  }
}

export const actions = {
  async onAuthStateChangedAction({ commit, dispatch }, { authUser, claims }) {
    if (!authUser) {
      await dispatch('cleanupAction')
      return
    }

    const { uid, email, emailVerified, displayName, photoURL } = authUser

    commit('ON_AUTH_STATE_CHANGED_MUTATION', {
      authUser: {
        uid,
        email,
        emailVerified,
        displayName,
        photoURL
      },
      claims
    })
  },

  async cleanupAction({ commit }) {
    commit('ON_AUTH_STATE_CHANGED_MUTATION', { authUser: null, claims: null })
  },

  async nuxtServerInit({ dispatch, commit }, { res }) {
    if (res && res.locals && res.locals.user) {
      const { allClaims: claims, idToken: token, ...authUser } = res.locals.user

      await dispatch('onAuthStateChangedAction', {
        authUser,
        claims,
        token
      })
    }
  }
} 