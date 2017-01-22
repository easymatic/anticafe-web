import fetch from 'isomorphic-fetch'

export const REQUEST_HANDLERS = 'REQUEST_HANDLERS'
export const RECEIVE_HANDLERS = 'RECEIVE_HANDLERS'
export const SELECT_HANDLER = 'SELECT_HANDLER'
export const REQUEST_TAGS = 'REQUEST_TAGS'
export const RECEIVE_TAGS = 'RECEIVE_TAGS'
export const SEND_TAG = 'SEND_TAG'
export const SEND_TAG_SUCCESS = 'SEND_TAG_SUCCESS'
export const SEND_TAG_FAILURE = 'SEND_TAG_FAILURE'

export const SERVICE_BASE_URL = 'http://localhost:32774/'

export const REQUEST_EVENTS = 'REQUEST_EVENTS'
export const RECEIVE_EVENT = 'RECEIVE_EVENT'

export function selectHandler(handler) {
  return {
    type: SELECT_HANDLER,
    handler: handler
  }
}

function requestEvents() {
  return {
    type: REQUEST_EVENTS
  }
}

function receiveEvent(json) {
  return {
    type: RECEIVE_EVENT,
    payload: json
  }
}

function requestHandlers() {
  return {
    type: REQUEST_HANDLERS
  }
}

function receiveHandlers(json) {
  return {
    type: RECEIVE_HANDLERS,
    items: json,
    receivedAt: Date.now()
  }
}

function requestTags(handler) {
  return {
    type: REQUEST_TAGS,
    handler
  }
}

function receiveTags(handler, json) {
  console.log('Receive tags ', json)
  var tags = [];
  for (var i in json) {
    if (json.hasOwnProperty(i)) {
      console.log('Tag ', i, json[i]);
      var tag = {
        name: i,
        value: json[i]
      }
      tags.push(tag)
    }
  }

  console.log('Transform to tags array', tags)
  return {
    type: RECEIVE_TAGS,
    handler,
    items: tags,
    receivedAt: Date.now()
  }
}

function sendTag(handler, tag, value) {
  return {
    type: SEND_TAG,
    handler,
    tag,
    value
  }
}

function sendTagSuccess(handler, tag, value) {
  return {
    type: SEND_TAG_SUCCESS,
    handler,
    tag,
    value
  }
}

function sendTagFailure(handler, tag, value, error) {
  return {
    type: SEND_TAG_FAILURE,
    handler,
    tag,
    value,
    error
  }
}

export function startFetchEvents(lastEventId) {
  return dispatch => {
    dispatch(requestEvents())
    return fetch(SERVICE_BASE_URL + 'api/events?wait=true' + (lastEventId ? ('&index=' + lastEventId) : ''))
      .then(response => response.json())
      .then(json => dispatch(receiveEvent(json)))
  }
}

export function fetchHandlers() {
  return dispatch => {
    dispatch(requestHandlers())
    return fetch(SERVICE_BASE_URL + 'api/handlers/')
      .then(response => response.json())
      .then(json => dispatch(receiveHandlers(json)))
  }
}

function fetchTags(handler) {
  return dispatch => {
    dispatch(requestTags(handler))
    return fetch(SERVICE_BASE_URL + `api/handlers/${handler}/tags/`)
      .then(response => response.json())
      .then(json => dispatch(receiveTags(handler, json)))
  }
}

function shouldFetchTags(state, handler) {
  const tags = state.tagsByHandler[handler]
  if (!tags) {
    return true
  }
  if (tags.isFetching) {
    return false
  }
  return true
}

export function fetchTagsIfNeeded(handler) {
  return (dispatch, getState) => {
    if (shouldFetchTags(getState(), handler)) {
      return dispatch(fetchTags(handler))
    }
  }
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

export function updateTag(handler, tag, value) {
  return dispatch => {
    dispatch(sendTag(handler, tag, value))
    let data = new FormData();
    data.append( "value", value );
    return fetch(SERVICE_BASE_URL + `api/handlers/${handler}/tags/${tag}/`, {
      method: 'POST',
      body: data
    }).then(checkStatus)
      .then(response => response.json())
      .then(json => dispatch(sendTagSuccess(handler, tag, value)))
      .catch(function(error) {
        dispatch(sendTagFailure(handler, tag, value, error))
      })
  }
}
