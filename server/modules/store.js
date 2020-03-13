function Store(settings) {
    let state = settings.state;
    const mutations = settings.mutations;
    const actions = {};

    function commit(nameMutation, data) {
        mutations[nameMutation](state, data);
    }

    for (const action in settings.actions) {
        actions[action] = settings.actions[action].bind(this, { commit })
    }

    this.mapActions = function () {
        return actions;
    }

    this.mapState = function (stateName) {
        return stateName ? state[stateName] : state;
    }
}

const store = new Store({
    state: {
        users: [],
        history: []
    },
    mutations: {
        ADD_USER: (state, user) => {
            state.users = [...state.users, user];
        },
        ADD_MESSAGE: (state, message) => {
            state.history = [...state.history, message]
        },
        CHANGE_AVATAR: (state, data) => {
            state.users.forEach(user => {
                if (user.socketID == data.socketID) user.avatar = data.avatar
            })
            state.history
                .filter(message => message.socketID == data.socketID)
                .forEach(message => message.avatar = data.avatar)
        }
    },
    actions: {
        addUser({ commit }, user) {
            commit('ADD_USER', user);
        },
        addMessage({commit}, message){
            commit('ADD_MESSAGE', message)
        },
        changeAvatar({commit}, data) {
            commit('CHANGE_AVATAR', data);
        }
    }
});

module.exports = store;

/*
var actions = store.mapActions();
actions.setNews({
    TEXT: 'heLLO'
})
actions.setNews({
    TEXT: 'heLLO2'
})
actions.updateNews({
    id: 1,
    TEXT: 'heLLO3'
})
console.log(store.mapState('news'))
*/