import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index'
import { fetchHandlers } from '../../actions'
import HandlersList from '../../components/HandlersList'
import TagsList from '../../components/TagsList'
import './App.css'
import { grey300 } from 'material-ui/styles/colors'
import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import SocialPerson from 'material-ui/svg-icons/social/person';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import ActionList from 'material-ui/svg-icons/action/list';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import AppBar from 'material-ui/AppBar';
import Subheader from 'material-ui/Subheader';
import classnames from 'classnames';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {open: false};
    this.handleToggle = this.handleToggle.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchHandlers())
  }

  handleToggle() {
    console.log('set state')
    this.setState({open: !this.state.open});
  }

  handleChange(nextHandler) {
    this.props.dispatch()
  }

  handleRefreshClick(e) {
    e.preventDefault()
    const { dispatch } = this.props
    dispatch(fetchHandlers())
  }

  render() {
    const { handlers, selectedHandler, isFetching, events } = this.props
    var handlersTagsContainerStyle = {
      height: '90vh',
      borderBottom: '1px solid',
      borderColor: grey300
    }
    return (
      <div>
        <AppBar
          className={classnames('app-bar', {'expanded': this.state.open})}
          onLeftIconButtonTouchTap={this.handleToggle}
          iconElementLeft={<IconButton><NavigationMenu /></IconButton>}
          title="anticafe"
          titleStyle={{
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: '300'
          }}
      />
      <Drawer
        open={this.state.open}
        onRequestChange={(open) => this.setState({open})}
      >
        <List>
          <ListItem primaryText="All Persons" leftIcon={<SocialPerson />} />
          <ListItem primaryText="Sessions" leftIcon={<ActionList />} />
        </List>
      </Drawer>
      <Grid>
        {isFetching && handlers.length === 0 &&
            <h2>Loading...</h2>
        }
        {!isFetching && handlers.length === 0 &&
            <h2>Empty.</h2>
        }
        {handlers.length > 0 &&
            <Row top="xs" style={handlersTagsContainerStyle}>
              <Col xs={3} md={3} style={{height: '100%', overflowY: 'scroll'}}>
                <HandlersList handlers={handlers} selectedHandler={selectedHandler}/>
              </Col>
              <Col xs={6} md={6} style={{height: '100%', overflowY: 'scroll'}}>
                {selectedHandler && selectedHandler.tags && selectedHandler.tags.items && selectedHandler.tags.items.length > 0 &&
                    <TagsList tags={selectedHandler.tags.items} handler={selectedHandler} />
                }
              </Col>
              <Col xs={3} md={3} style={{height: '100%', overflowY: 'scroll'}}>
              </Col>
            </Row>
        }
      </Grid>
    </div>
    )
  }
}

App.propTypes = {
  handlers: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  let selectedHandlerName = state.selectedHandler;
  var tags = state.tagsByHandler
  var handlersOriginal = state.handlers.items
  var isFetching = state.handlers.isFetching
  var lastUpdated = state.handlers.lastUpdated || Date.now()
  var handlers = [];
  for (var i = 0; i < handlersOriginal.length; i++) {
    var handler = {};
    handler['name'] = handlersOriginal[i];
    handler['tags'] = tags[handlersOriginal[i]] || []
    handlers.push(handler)
  }
  let selectedHandler = handlers[0]
  for (var j = 0; j < handlers.length; j++) {
    if (handlers[j].name === selectedHandlerName) {
      selectedHandler = handlers[j]
    }
  }
  var events = state.events
  return {
    handlers,
    selectedHandler,
    tags,
    isFetching,
    lastUpdated,
    events
  }
}

export default connect(mapStateToProps)(App)
