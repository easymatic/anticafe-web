/* eslint-disable */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Toggle from 'material-ui/Toggle';
import { ListItem } from 'material-ui/List';
import { updateTag } from '../actions'
import { grey500 } from 'material-ui/styles/colors';

class Tag extends Component {

  onToggle(tag, handler) {
    var st = (tag.value == 1 ? 0 : 1)
    console.log('Switch changed with state', tag, handler, st)
    this.props.dispatch(updateTag(handler.name, tag.name, st))
  }

  render() {
    var tag = this.props.tag
    var handler = this.props.handler
    return (
      <div>
        {tag.value == 1 || tag.value == 0 ?
            <ListItem primaryText={tag.name} rightToggle={
              <Toggle
                toggled={tag.value == 1}
                onToggle={this.onToggle.bind(this, tag, handler)}
              />
            }>
          </ListItem>
            :
            <ListItem primaryText={tag.name}>
              <span style={{
                float: 'right',
                color: grey500 
              }}>{tag.value}</span>
            </ListItem>
        }
      </div>
    )
  }
}

export default connect()(Tag);
