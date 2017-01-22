import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'

class Event extends Component {
  render() {
    var eventStyle = {
      display: 'inline-block',
      padding: '10px',
      marginBottom: '5px',
      color: 'rgba(0, 0, 0, 0.8)',
      width: '100%',
      float: 'left',
      borderBottom: '1px solid rgba(0, 0, 0, 0.8)'
    }
    var event = this.props.event
    console.log('EVENT', event)
    return (
      <div style={eventStyle}>
      <b>{event.event.handler} {event.event.tag}</b>: {event.event.value}
      </div>
    )
  }
}

Event.propTypes = {
  event: PropTypes.object.isRequired
}
export default connect()(Event);
