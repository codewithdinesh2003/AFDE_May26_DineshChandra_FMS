import { feedbackAPI } from '../api'

export async function fetchAllFeedback(params = {}) {
  try {
    const res = await feedbackAPI.getAll(params)
    return { data: res.data, error: null }
  } catch (err) {
    return { data: null, error: err.response?.data?.detail || 'Failed to fetch feedback' }
  }
}

export async function fetchFeedbackById(id) {
  try {
    const res = await feedbackAPI.getById(id)
    return { data: res.data, error: null }
  } catch (err) {
    return { data: null, error: err.response?.data?.detail || 'Feedback not found' }
  }
}

export async function submitFeedback(data) {
  try {
    const res = await feedbackAPI.create(data)
    return { data: res.data, error: null }
  } catch (err) {
    return { data: null, error: err.response?.data?.detail || 'Failed to submit feedback' }
  }
}

export async function editFeedback(id, data) {
  try {
    const res = await feedbackAPI.update(id, data)
    return { data: res.data, error: null }
  } catch (err) {
    return { data: null, error: err.response?.data?.detail || 'Failed to update feedback' }
  }
}

export async function removeFeedback(id) {
  try {
    await feedbackAPI.delete(id)
    return { success: true, error: null }
  } catch (err) {
    return { success: false, error: err.response?.data?.detail || 'Failed to delete feedback' }
  }
}

export async function searchFeedback(params) {
  try {
    const res = await feedbackAPI.search(params)
    return { data: res.data, error: null }
  } catch (err) {
    return { data: null, error: err.response?.data?.detail || 'Search failed' }
  }
}

export async function fetchStats() {
  try {
    const res = await feedbackAPI.getStats()
    return { data: res.data, error: null }
  } catch (err) {
    return { data: null, error: err.response?.data?.detail || 'Failed to fetch stats' }
  }
}
