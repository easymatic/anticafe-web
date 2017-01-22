import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { List } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Tag from '../components/Tag'
import {
  green500, green700,
  orangeA200,
  cyan500,
  grey100, grey300, grey400, grey500,
  white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';

class TagsList extends Component {
  render() {
    var tags = this.props.tags
    var handler = this.props.handler
    console.log('Tags is ', this.props.handler, this.props.tags)
    return (
      <List>
        <Subheader>Tags for 
          <span style={{
            color: green500
          }}>
          &nbsp;{this.props.handler.name}
        </span>
      </Subheader>
      {tags.map((tag, i) =>
        <Tag key={i} tag={tag} handler={handler}/>
      )}
    </List>
    )
  }
}

TagsList.propTypes = {
  tags: PropTypes.array.isRequired
}
export default connect()(TagsList);
