import { combineReducers } from 'redux'
import {
  REQUEST_HANDLERS, RECEIVE_HANDLERS, SELECT_HANDLER, REQUEST_TAGS, RECEIVE_TAGS, REQUEST_EVENTS, RECEIVE_EVENT, SEND_TAG_SUCCESS
} from '../actions'

function selectedHandler(state = '', action) {
  switch (action.type) {
    case SELECT_HANDLER:
      return action.handler
    default:
      return state
  }
}

function tags(state = {
  isFetching: false,
  items: []
}, action) {
  switch (action.type) {
    case REQUEST_TAGS:
      return Object.assign({}, state, {
        isFetching: true
      })
    case RECEIVE_TAGS:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.items,
        lastUpdated: action.receivedAt
      })
    case SEND_TAG_SUCCESS:
      var tags = state.items
      for (var i = 0; i < tags.length; i++) {
        var tag = tags[i]
        if (tag.name === action.tag) {
          tag.value = action.value
        }
      }
      return Object.assign({}, state, {
        isFetching: false,
        items: tags,
        lastUpdated: action.receivedAt
      })
    case RECEIVE_EVENT:
      let events = extractEvents(action.payload)
      let stateTags = state.items
      for (let i in events) {
        let event = events[i];
        let eventTagName = event.tag
        let eventTagValue = event.value
        for (let j in stateTags) {
          var tag = stateTags[j]
          if (tag.name === eventTagName) {
            tag.value = eventTagValue
          }
        }
      }
      return Object.assign({}, state, {
        isFetching: false,
        items: stateTags,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

function tagsByHandler(state = {}, action) {
  switch (action.type) {
    case REQUEST_TAGS:
    case RECEIVE_TAGS:
      return Object.assign({}, state, {
        [action.handler]: tags(state[action.handler], action)
      })
    case SEND_TAG_SUCCESS:
      return Object.assign({}, state, {
        [action.handler]: tags(state[action.handler], action)
      })
    case RECEIVE_EVENT:
      let events = extractEvents(action.payload)
      let affectedHandlers = []
      for (let i in events) {
        affectedHandlers.push(events[i].handler)
      }
      affectedHandlers= affectedHandlers.filter(function(item, pos) {
        return affectedHandlers.indexOf(item) == pos;
      })
      if (affectedHandlers.length > 0) {
        let newState = {};
        for (let j in affectedHandlers) {
          let handler = affectedHandlers[j]
          let newTags = tags(state[handler], action)
          newState[handler] = newTags
        }
        return Object.assign({}, state, newState)
      } else {
        return state
      }
    default:
      return state
  }
}

function handlers(state = {isFetching: false, items: []}, action) {
  console.log('State is', state)
  console.log('Action is', action)
  switch (action.type) {
    case REQUEST_HANDLERS:
      return Object.assign({}, state, {
        isFetching: true
      })
    case RECEIVE_HANDLERS:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.items,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

function extractEvents(payload) {
  let isArray = Object.prototype.toString.call(payload) === '[object Array]';
  let events = [];
  if (!isArray) {
    for (var j in payload) {
      if (payload.hasOwnProperty(j)) {
        let event = {
          ...payload[j],
          id: j
        }
        events.push(event)
      }
    }
  } else {
    for (let i in payload) {
      if (payload.hasOwnProperty(i)) {
        let ev = payload[i];
        for (let j in ev) {
          if (ev.hasOwnProperty(j)) {
            let event = {
              ...ev[j],
              id: j
            }
            events.push(event)
          }
        }
      }
    }
  }
  return events;
}

function events(state = {isFetching: false, data: []}, action) {
  switch (action.type) {
    case REQUEST_EVENTS:
      return Object.assign({}, state, {
        isFetching: true
      })
    case RECEIVE_EVENT:
      let events = extractEvents(action.payload)
      return Object.assign({}, state, {
        isFetching: false,
        data: [...state.data, ...events]
      })
    default:
      return state
  }
}

const rootReducer = combineReducers({
  tagsByHandler,
  selectedHandler,
  handlers,
  events
})

export default rootReducer
