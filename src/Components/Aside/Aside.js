import React, { Component } from 'react';
import {
  Nav, NavItem, NavbarToggler, NavbarBrand, NavLink, Badge, TabContent, TabPane,
  Label, Input, Progress, Button, Row, Col, Form, InputGroup, InputGroupAddon
} from 'reactstrap';
import classnames from 'classnames';
import Settings from '../Tabs/Settings';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setLogin, setCurrentUserCredentials } from '../../Redux/Actions/index';
import { toast } from 'react-toastify';

// Handles main sidebar menu, also theme selection
class Aside extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '3',
      themeColor: ""
    };

    this.submitInvoiceNumberToApi = this.submitInvoiceNumberToApi.bind(this);
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  /**
  * Handles the invoice number change
  */
  submitInvoiceNumberToApi(e) {
    e.preventDefault();
    const data = new FormData(e.target);

    const packet = {
      inv_number: parseFloat(data.get("inv_number"))
    }

    axios.put(`http://localhost:4000/api/v1/companies/${this.props.currentUserCredentials.company_id}`, packet).then((response) => {
      var credentials = this.props.currentUserCredentials;
      credentials.inv_number = packet.inv_number + 1;
      console.log(this.props.currentUserCredentials);
      this.props.setCurrentUserCredentials(credentials)
      console.log(this.props.currentUserCredentials);

      toast.success("Invoice number updated!", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }).catch((err) => {
      if(err) {
        toast.error("Could not update invoice number, please try again. " + err, {
          position: toast.POSITION.BOTTOM_RIGHT
        })
      }
    })
  }

  render() {
    return (
      <aside className="aside-menu">
        {/*Aside Menu*/}

        <Nav tabs>
          <NavItem>
            <NavLink className={classnames({ active: this.state.activeTab === '1' })}
                     onClick={() => { this.toggle('1'); }}>
              <i className="icon-list"></i>
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink className={classnames({ active: this.state.activeTab === '3' })}
                     onClick={() => { this.toggle('3'); }}>
              <i className="icon-settings"></i>
            </NavLink>
          </NavItem>
        </Nav>

        {/* Tab Contents */}
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1" className="p-3">
            <h6>Notes</h6>

            <hr/>
          </TabPane>

          {/* Settings Tab */}
          <TabPane tabId="3" className="p-3">
            <h6>Settings</h6>
            <hr />
            <div className="aside-options">
              <div className="clearfix mt-4">
                <small><b>Send anonymous data to server</b></small>
                <Label className="switch switch-text switch-pill switch-success switch-sm ">
                  <Input type="checkbox" className="switch-input" defaultChecked/>
                  <span className="switch-label" data-on="On" data-off="Off"></span>
                  <span className="switch-handle"></span>
                </Label>
              </div>
              <div>
                <small className="text-muted">This data will be used to improve the service and solve issues.
                </small>
              </div>
            </div>

            <div className="aside-options">
              <div className="clearfix mt-4">
                <small><b>Change Current invoice number</b></small>
                <Label className="switch switch-text switch-pill switch-success switch-sm"></Label>
              </div>
              <div>
                <Form onSubmit={this.submitInvoiceNumberToApi}>
                  <InputGroup className="smallInputGroup" size="xs">
                    <Input type="number" name="inv_number" placeholder={this.props.currentUserCredentials.inv_number} className="fullWidthButton" />
                    <InputGroupAddon className="noBackground" addonType="append">
                      <Button size="sm" className="smallButton" color="none" type="submit">Submit</Button>
                    </InputGroupAddon>
                  </InputGroup>
                </Form>
                <small className="text-muted">This will change the current invoice number that a new invoice will have.</small>
              </div>
            </div>

            <hr/>

            {/* <div className="aside-options">
              <div className="clearfix mt-4">
                <small><b>Theme Color</b></small>
                <Label className="switch switch-text switch-pill switch-success switch-sm float-right"></Label>
              </div>
              <div>
                <Row className="themePickerRow">
                  <Col md="3">
                    <Button className="smallSquare blueSquare"> B </Button>
                  </Col>

                  <Col md="3">
                    <Button className="smallSquare paddingLeft greenSquare"> G </Button>
                  </Col>

                  <Col md="3">
                    <Button className="smallSquare paddingLeft blueSquare"> P </Button>
                  </Col>

                  <Col md="3">
                    <Button className="smallSquare paddingLeft blueSquare"> D </Button>
                  </Col>
                </Row>
              </div>
            </div> */}

            {/* <h6>System Utilization</h6>

            <div className="text-uppercase mb-1 mt-4">
              <small><b>CPU Usage</b></small>
            </div>
            <Progress className="progress-xs" color="info" value="25"/>
            <small className="text-muted">348 Processes. 1/4 Cores.</small>

            <div className="text-uppercase mb-1 mt-2">
              <small><b>Memory Usage</b></small>
            </div>
            <Progress className="progress-xs" color="warning" value="70"/>
            <small className="text-muted">11444GB/16384MB</small>

            <div className="text-uppercase mb-1 mt-2">
              <small><b>SSD 1 Usage</b></small>
            </div>
            <Progress className="progress-xs" color="danger" value="95"/>
            <small className="text-muted">243GB/256GB</small>

            <div className="text-uppercase mb-1 mt-2">
              <small><b>SSD 2 Usage</b></small>
            </div> */}
            {/* <Progress className="progress-xs" color="success" value="10"/>
            <small className="text-muted">25GB/256GB</small> */}
          </TabPane>
        </TabContent>
      </aside>
    )
  }
}

/**
* Sets props to be accessed by the Login component from redux
* global state, Variables & Objects
*/
function mapStateToProps(state) {
  return {
    isLoggedIn: state.isLoggedIn,
    currentUserCredentials: state.currentUserCredentials
  }
}

/**
* Sets action functions to be used by the Login component through props
* Functions
*/
function mapDispatchToProps(dispatch) {
  // When setLogin is called, result is passed to all reducers
  return bindActionCreators({ setLogin: setLogin, setCurrentUserCredentials: setCurrentUserCredentials  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Aside);
