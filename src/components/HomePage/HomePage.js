import React from 'react';
import { connect } from 'react-redux';

import {
  Grid,
  Row,
  Modal,
} from 'react-bootstrap';
import { Col, Button } from 'reactstrap';
import Header from '../Header/Header';
import SideMenu from '../SideMenu/SideMenu';
import NewFlowPage from '../NewFlowPage/NewFlowPage';
import { mapStateToProps } from '../../helpers/mapStateToProps';
import Actions from '../../store/actions';
import './HomePage.css';

const EVENTS = [
  { date: 'July 23rd, 2018', 'event-type': 'Event Type A', username: 'Username x' },
  { date: 'July 23rd, 2019', 'event-type': 'Event Type B', username: 'Username x' },
  { date: 'July 23rd, 2020', 'event-type': 'Event Type C', username: 'Username x' },
  { date: 'July 23rd, 2021', 'event-type': 'Event Type D', username: 'Username x' },
  { date: 'July 23rd, 2022', 'event-type': 'Event Type E', username: 'Username x' },
  { date: 'July 23rd, 2023', 'event-type': 'Event Type F', username: 'Username x' },
  { date: 'July 23rd, 2024', 'event-type': 'Event Type G', username: 'Username x' },
  { date: 'July 23rd, 2025', 'event-type': 'Event Type H', username: 'Username x' },
  { date: 'July 23rd, 2025', 'event-type': 'Event Type H', username: 'Username x' },
  { date: 'July 23rd, 2025', 'event-type': 'Event Type H', username: 'Username x' },
  { date: 'July 23rd, 2025', 'event-type': 'Event Type H', username: 'Username x' },
  { date: 'July 23rd, 2025', 'event-type': 'Event Type H', username: 'Username x' },
  { date: 'July 23rd, 2025', 'event-type': 'Event Type H', username: 'Username x' },
  { date: 'July 23rd, 2025', 'event-type': 'Event Type H', username: 'Username x' },
  { date: 'July 23rd, 2025', 'event-type': 'Event Type H', username: 'Username x' },
  { date: 'July 23rd, 2025', 'event-type': 'Event Type H', username: 'Username x' },
  { date: 'July 23rd, 2025', 'event-type': 'Event Type H', username: 'Username x' },
];
class HomePage extends React.Component {
  static groupedArray(arr, chunkSize) {
    const groups = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      groups.push(arr.slice(i, i + chunkSize));
    }
    return groups;
  }

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      currentPage: 'first',
      activeGroupIndex: 0,
      eventsPerPage: 5,
      groupedEvents: HomePage.groupedArray(EVENTS, 5),
      isEditing: false,
      flowName: (this.props.global.flow && this.props.global.flow.flowName) || null,
      newFlowName: null,
      show: false,
    };
    this.toggle = this.toggle.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
    this.renderEventRows = this.renderEventRows.bind(this);
    this.handleEditButton = this.handleEditButton.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleFlowDeletion = this.handleFlowDeletion.bind(this);
    this.handleModalHide = this.handleModalHide.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      flowName: (nextProps.global.flow && nextProps.global.flow.flowName) || null,
    });
  }

  toggle() {
    const { dispatch } = this.props;
    dispatch(Actions.fetchFormsError(''));
    dispatch(Actions.handleFlowCreation(true, true, false, false, false));
    dispatch(Actions.receiveFormFields(null));

    this.setState({
      modal: !this.state.modal,
    });
  }

  handleInputChange(e) {
    this.setState({
      newFlowName: e.target.value,
    });
  }

  handleModalHide() {
    this.setState({
      show: !this.state.show,
    });
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleFormSubmit(e);
    } else {
      e.stopPropagation();
    }
  }

  handleFlowDeletion() {
    const { dispatch } = this.props;
    const { flow } = this.props.global;
    this.setState({
      show: false,
    });
    dispatch(Actions.deleteFlow(flow.flowName));
  }

  handleEditButton() {
    this.setState({
      isEditing: true,
    });
  }

  handleFormSubmit(e) {
    const { dispatch } = this.props;
    this.setState({
      ...this.state,
      isEditing: false,
      flowName: (e.target.id === 'save' || e.charCode === 13) && this.state.newFlowName ? this.state.newFlowName : this.state.flowName,
    });
    const currentFlow = this.props.global.flow.flowName;
    const currentFlowDets = this.props.global.flows[currentFlow];
    currentFlowDets.form = (e.target.id === 'save' || e.charCode === 13) && this.state.newFlowName ? this.state.newFlowName : this.state.flowName;
    currentFlowDets.oldForm = this.state.flowName;
    dispatch(Actions.saveFlow(currentFlowDets));
    dispatch(Actions.selectedFlow({
      ...this.props.global.flow,
      flowName: currentFlowDets.form,
    }));
    return true;
  }

  renderEventRows() {
    const { groupedEvents, activeGroupIndex } = this.state;
    return groupedEvents[activeGroupIndex].map((e, i) => (
      <tr key={i}>
        <td>{e.date}</td>
        <td>{e['event-type']}</td>
        <td>{e.username}</td>
      </tr>
    ));
  }

  handlePagination(e) {
    const { groupedEvents, activeGroupIndex } = this.state;
    const id = e.target.id;
    this.setState({
      currentPage: id,
      activeGroupIndex: id === 'first'
        ? 0 : id === 'next'
          ? activeGroupIndex + 1 : id === 'previous'
            ? activeGroupIndex - 1 : id === 'last'
              ? groupedEvents.length - 1
              : 0,
    });
  }

  async componentWillMount() {
    const { dispatch } = this.props;
    const token = this.props.global.access_token;
    try {
      await dispatch(Actions.getProjects(token));
      await dispatch(Actions.getUserForms(token));
    } catch (e) {
      return false;
    }
  }

  render() {
    const { activeGroupIndex, groupedEvents } = this.state;
    const { flow, flows } = this.props.global;
    return (
      <div>
        <Header />
        <div id="HomePage" className="homepage">
          <SideMenu toggle={this.toggle} />
          <Grid fluid>
            <Row className="main">
              <NewFlowPage toggle={this.toggle} isOpen={this.state.modal} />
            </Row>
            <Row className="main">
              <Modal show={this.state.show} onHide={this.handleModalHide}>
                <Modal.Header closeButton>
                  <Modal.Title>Delete Flow</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {'Are you sure you want to delete '}
                  <strong>
                    {flow && flow.flowName}
                    {' '}
?
                  </strong>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={() => this.handleFlowDeletion()}>Yes</Button>
                  <Button onClick={() => this.handleModalHide()}>No</Button>
                </Modal.Footer>
              </Modal>
            </Row>
            {this.props.global.flow && JSON.stringify(this.props.global.flow) !== '{}'
            && (
              <div>
                <Row>
                  <Col md="3" sm="4">
                    <div className="flow-name-section">
                      {!this.state.isEditing
                        ? (
                          <h4>
                            {this.state.flowName}
                          </h4>
                        ) : <input type="text" defaultValue={this.props.global.flow.flowName} onChange={e => this.handleInputChange(e)} onKeyPress={e => this.handleKeyPress(e)} />}
                      {!this.state.isEditing
                        ? <span className="glyphicon glyphicon-pencil" onClick={() => this.handleEditButton()} />
                        : (
                          <div className="edit-controls">
                            <Button id="save" type="submit" outline color="secondary" onClick={e => this.handleFormSubmit(e)}>
                    Save Changes
                            </Button>
                            <Button id="cancel" outline color="secondary" onClick={e => this.handleFormSubmit(e)}>Cancel</Button>
                          </div>
                        )}
                    </div>
                    <p>Last update 9:11am, 29th Jul</p>
                    <p>{`Live status: ${this.props.global.flow && JSON.stringify(this.props.global.flow) !== '{}' && this.props.global.flow.status && JSON.parse(this.props.global.flow.status) ? 'On' : 'Off'}`}</p>
                  </Col>
                  <Col md="9" className="activity-toolbars" style={{ textAlign: 'right' }}>
                    <h4>
                      <span className="glyphicon glyphicon-trash" onClick={e => this.handleModalHide(e)} />
                      <span className="glyphicon glyphicon-refresh" />
                      <span className="glyphicon glyphicon-cog" />
                    </h4>
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    <div className="activity-panel">
                      <div className="panel-heading">
                        <h3>Activity</h3>
                      </div>
                      <div className="panel-body">
                        <div className="flow-activity-stats clearfix">
                          <div className="stats-box">
                            <h3>{flows[flow.flowName].no_of_submissions}</h3>
                            <span>Events</span>
                          </div>
                          <div className="stats-box">
                            <h3>{flows[flow.flowName].last_submission_time}</h3>
                            <span>Last Event</span>
                          </div>
                          <div className="stats-box">
                            <h3>90</h3>
                            <span>Activated Users</span>
                          </div>
                        </div>
                        <div className="events-graph">
                          <div>
                            <h4><span>Events</span></h4>
                          </div>
                        </div>
                        <div className="events-table-container">
                          <table className="events-table">
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Event Type</th>
                                <th>Username</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.renderEventRows()}
                            </tbody>
                          </table>
                          <div className="pagination">
                            <p>{`Page ${activeGroupIndex + 1} / ${groupedEvents.length}`}</p>
                            <div className="pagination-buttons">
                              <button
                                className={`${activeGroupIndex === 0 ? 'inactive' : ''}`}
                                disabled={activeGroupIndex === 0}
                                onClick={e => this.handlePagination(e)}
                                id="first"
                              >
                                {'|<<'}
                              </button>
                              <button
                                className={`${activeGroupIndex === 0 ? 'inactive' : ''}`}
                                disabled={activeGroupIndex === 0}
                                onClick={e => this.handlePagination(e)}
                                id="previous"
                              >
                                {'<<'}
                              </button>
                              <button
                                className={`${activeGroupIndex === groupedEvents.length - 1 ? 'inactive' : ''}`}
                                disabled={activeGroupIndex === groupedEvents.length - 1}
                                onClick={e => this.handlePagination(e)}
                                id="next"
                              >
                                {'>>'}
                              </button>
                              <button
                                className={`${activeGroupIndex === groupedEvents.length - 1 ? 'inactive' : ''}`}
                                disabled={activeGroupIndex === groupedEvents.length - 1}
                                onClick={e => this.handlePagination(e)}
                                id="last"
                              >
                                {'|>>'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            )}
          </Grid>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(HomePage);
