import { queryPersonPermissions } from '@/api/hrmList'
const state = {
  talentPoolPermission: ''
}
const mutations = {
  SET_TALENTPOOLPERMISSIONS: (state, talentPoolPermission) => {
    state.talentPoolPermission = talentPoolPermission
  },
}
const actions = {
  queryPersonPermissions({ commit }, userId) {
    return new Promise((resolve, reject) => {
      queryPersonPermissions(userId).then(response => {
        console.log(userId)
        const permissionList = {
          permissions: [...response.data['permissions'].map(item => item.permId)],
          deptPermissions: [...response.data['deptPermissions'].map(item => item.permId)],
        }
        commit('SET_TALENTPOOLPERMISSIONS', permissionList)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
