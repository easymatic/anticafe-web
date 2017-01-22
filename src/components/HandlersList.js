import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import Handler from '../components/Handler'
import {List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import { green100 } from 'material-ui/styles/colors';
import { selectHandler } from '../actions'

class HandlersList extends Component {
  
  onSelect(handlerName) {
    this.props.dispatch(selectHandler(handlerName));
  }

  render() {
    let selectedHandler = this.props.selectedHandler;
    let activeStyle = {
      backgroundColor: green100
    }
    return (
      <List style={{
        borderRight: '1px solid rgb(224, 224, 224)',
        height: '100%'
      }}>
        <Subheader>Handlers</Subheader>
        {this.props.handlers.map((handler, i) =>
          <ListItem 
            key={i} 
            value={i} 
            onClick={this.onSelect.bind(this, handler.name)}
            style={(handler.name === selectedHandler.name) ? activeStyle : {}}>
            <Handler handler={handler.name} />
          </ListItem>
        )}
      </List>
    )
  }
}

HandlersList.propTypes = {
  handlers: PropTypes.array.isRequired
}
export default connect()(HandlersList);
