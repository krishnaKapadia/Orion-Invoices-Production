import React, { Component } from 'react';
import {
  Row, Col, Card, CardHeader, CardBody, CardFooter, Button, Table,
  Modal, ModalHeader, ModalBody, ModalFooter, Form, Input, FormGroup, Label
} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import Spinner from 'react-spinkit';
import { ToastContainer, toast } from 'react-toastify';

class Profile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loadingButton: false,
      editable: false
    }

    this.toggle = this.toggle.bind(this);
    this.submitToAPI = this.submitToAPI.bind(this);
  }

  /**
  * Toggles editable fields
  */
  toggle() {
    var editable = !this.state.editable;
    this.setState({ editable });
  }

  /**
  * Submits new profile information to API
  */
  submitToAPI(e) {
    e.preventDefault();
    this.setState({ loadingButton: true });
    var data = new FormData(e.target);

    var information = {
      username: data.get('username'),
      email: data.get('email'),
      company_name: data.get('company_name')
    }

    const user_id = this.props.currentUserCredentials._id;
    axios.put(`http://localhost:4000/api/v1/users/${user_id}`, information).then((response) => {
      this.setState({ loadingButton: false });
      this.toggle();
      toast.success("Profile Saved!", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }).catch((err) => {
      this.setState({ loadingButton: false });
      if(err) {
        toast.error("Could not save profile! Please try again. " + err, {
          position: toast.POSITION.BOTTOM_RIGHT
        })
      }
    })


  }

  render() {
    var data = this.props.currentUserCredentials;
    var date = new Date(data.company_created);
    date = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    return (
      <div className="animated fadeIn">
        <ToastContainer />
        <Form onSubmit={this.submitToAPI}>
        <Row>
          <Col xs={{ size: 12 }} md={{ size: 8 }} lg={{ size: 8 }}>
            <Card>
              <CardHeader>
                <Row>
                  <Col xs="12" md="10">
                    <h3>My Profile</h3>
                  </Col>

                </Row>
              </CardHeader>
              <CardBody>
                  <Row>
                    <Col xs="12" md="6" lg="6">
                      <FormGroup>
                        <Label>Username: </Label>
                        {
                          this.state.editable && <Input type="text" name="username" defaultValue={data.username}/>
                        }
                        {
                          !this.state.editable && <Input type="text" name="userFirstName" readOnly value={data.username}/>
                        }
                      </FormGroup>
                    </Col>

                    <Col xs="12" md="6" lg="6">
                      <FormGroup>
                        <Label>Email Address:</Label>
                        {
                          this.state.editable && <Input type="text" name="email" defaultValue={data.email}/>
                        }
                        {
                          !this.state.editable && <Input type="text" name="userEmail" readOnly value={data.email}/>
                        }
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs="12" md="6" lg="6">
                      <FormGroup>
                        <Label>Company Name:</Label>
                        {
                          this.state.editable && <Input type="text" name="company_name" defaultValue={data.company_name}/>
                        }
                        {
                          !this.state.editable && <Input type="text" name="userCompanyName" readOnly value={data.company_name} />
                        }
                      </FormGroup>
                    </Col>
                    <Col xs="12" md="6" lg="6">
                      <FormGroup>
                        <Label>Company Created:</Label>
                        <Input type="text" readOnly value={date}/>
                      </FormGroup>
                    </Col>
                  </Row>
              </CardBody>
            </Card>
          </Col>

          <Col xs={{ size: 12 }} md={{ size: 4 }} lg={{ size: 4 }}>
            <Card>
              <CardHeader>Options</CardHeader>
              <CardBody>
                <Row>
                  <Col>
                    {
                      this.state.editable && this.state.loadingButton &&  <Button color="primary" className="px-4"><Spinner name="circle" color="white" fadeIn="none" /></Button>
                    }
                    {
                      this.state.editable && !this.state.loadingButton && <Button className="fullWidthButton" color="primary" type="submit">Save Profile</Button>
                    }
                    {
                      !this.state.editable && <Button className="fullWidthButton" color="primary" onClick={this.toggle}>Edit Profile</Button>
                    }
                  </Col>

                  <Col>
                    <NavLink to="/dashboard">
                      <Button outline className="fullWidthButton" color="danger">Back</Button>
                    </NavLink>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>

        </Row>
      </Form>

      </div>
    );
  }

}

/**
* Sets props to be accessed by the Login component from redux
* global state, Variables & Objects
*/
function mapStateToProps(state) {
  return {
    isLoggedIn: state.isLoggedIn,
    currentUserCredentials: state.currentUserCredentials,
  }
}

export default connect(mapStateToProps)(Profile);
