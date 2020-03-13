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

    this.getUser = function (id) {
        return state.users.find(user => user.socketID == id);
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
        DELETE_USER:(state, id) => {
            let userIndex = state.users.findIndex(user => user.socketID == id);
            state.users = [...state.users.splice(userIndex, 1)];
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
        addUser({commit}, user) {
            commit('ADD_USER', user);
        },
        deleteUser({commit}, id) {
            commit('DELETE_USER', id);
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
