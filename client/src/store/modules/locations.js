import * as api from '../../api/locations';

const state = () => ({
  items: [],
  loading: false,
  error: null,
  lastSaved: null,
});

const mutations = {
  SET_ITEMS(state, items) {
    state.items = items;
  },
  SET_LOADING(state, v) {
    state.loading = v;
  },
  SET_ERROR(state, err) {
    state.error = err;
  },
  SET_LAST_SAVED(state, row) {
    state.lastSaved = row;
  },
  REMOVE_ITEM(state, id) {
    state.items = state.items.filter((x) => x.id !== id);
  },
};

const actions = {
  async fetchAll({ commit }) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const items = await api.listLocations();
      commit('SET_ITEMS', items);
    } catch (e) {
      commit('SET_ERROR', e.message || 'Failed to load locations');
      throw e;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async saveSelection({ commit, dispatch }, { latitude, longitude, address }) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const row = await api.createLocation({ latitude, longitude, address });
      commit('SET_LAST_SAVED', row);
      await dispatch('fetchAll');
      return row;
    } catch (e) {
      const msg = e.message || 'Failed to save location';
      commit('SET_ERROR', msg);
      throw e;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async deleteById({ commit }, id) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      await api.deleteLocation(id);
      commit('REMOVE_ITEM', id);
    } catch (e) {
      const msg = e.message || 'Failed to delete location';
      commit('SET_ERROR', msg);
      throw e;
    } finally {
      commit('SET_LOADING', false);
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
