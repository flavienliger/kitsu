import notificationsApi from '../api/notifications'
import { sortByDate } from '../../lib/sorting'

import {
  LOAD_NOTIFICATION_END,
  LOAD_NOTIFICATIONS_END,
  MARK_ALL_NOTIFICATIONS_AS_READ,

  NOTIFICATION_ADD_PREVIEW,

  RESET_ALL
} from '../mutation-types'

const initialState = {
  notifications: []
}

const state = {
  ...initialState
}

const getters = {
  notifications: state => state.notifications,
  isNewNotification: (state) => {
    const unreadNotifications = state.notifications.filter((notification) => {
      return !notification.read
    })
    return unreadNotifications.length > 0
  },
  unreadNotificationsLength: (state) => {
    return state.notifications.filter(n => !n.read).length
  }
}

const actions = {
  loadNotifications ({ commit, state }) {
    return notificationsApi.getNotifications()
      .then(notifications => {
        commit(LOAD_NOTIFICATIONS_END, notifications)
        Promise.resolve()
      })
  },

  loadNotification ({ commit, state }, notificationId) {
    return notificationsApi.getNotifications(notificationId)
      .then(notification => {
        commit(LOAD_NOTIFICATION_END, notification)
        Promise.resolve()
      })
  },

  markAllNotificationsAsRead ({ commit }) {
    commit(MARK_ALL_NOTIFICATIONS_AS_READ)
  }
}

const mutations = {
  [LOAD_NOTIFICATIONS_END] (state, notifications) {
    state.notifications = sortByDate(notifications)
  },

  [LOAD_NOTIFICATION_END] (state, notification) {
    state.notifications.push(notification)
    state.notifications = sortByDate(state.notifications)
  },

  [MARK_ALL_NOTIFICATIONS_AS_READ] (state) {
    state.notifications.forEach((notification) => {
      notification.read = true
    })
  },

  [NOTIFICATION_ADD_PREVIEW] (state, { commentId, previewId }) {
    const notification = state.notifications.find((notification) => {
      return notification.comment_id === commentId
    })

    if (notification) {
      notification.preview_file_id = previewId
    }
  },

  [RESET_ALL] (state) {
    Object.assign(state, { ...initialState })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
