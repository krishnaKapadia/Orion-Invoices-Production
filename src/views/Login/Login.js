import React, {Component} from 'react';
import {
  Container, Row, Col, CardGroup, Card, CardBody, Button, Input,
  InputGroup, InputGroupAddon, Form, FormFeedback }
from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setLogin, setCurrentUserCredentials } from '../../Redux/Actions/index';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Spinner from 'react-spinkit';

class Login extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      invalid_username: false,
      invaild_password: false
    }

    this.handleSubmit      = this.handleSubmit.bind(this);
    this.authenticateLogin = this.authenticateLogin.bind(this);
  }

  /**
  * Authenticates entered user credentials with backend API
  */
  authenticateLogin(data) {
    const userCredentials = {
      username: data.get("username"),
      password: data.get("password")
    }

    axios.post("http://localhost:4000/api/v1/users/login", userCredentials).then((response) => {
      if(response.data.result) {

        this.props.setCurrentUserCredentials(response.data.data);
        this.props.setLogin(true);

        // redirect to dashboard
         this.props.history.push("/dashboard");

         toast.success("Login Successful! Welcome to Orion invoices", {
           position: toast.POSITION.BOTTOM_RIGHT
         });
      }
    }).catch((err) => {
      this.setState({ loading: false });
      console.log(err);
      if(err) {
        this.setState({ invalid_username: true, invalid_password: true });
        toast.error("Could not login, please try again. " + err, {
          position: toast.POSITION.BOTTOM_RIGHT
        })
      }
    })
  }

  /**
  * Handles the submittion of the login and delegates to authenticateLogin
  */
  handleSubmit(e) {
    e.preventDefault();

    // Set loading state to true
    this.setState({ loading: true });

    // Create object from form data
    const data = new FormData(e.target);

    // Delegate
    this.authenticateLogin(data);
  }

  render() {
    return (
      <div className="app flex-row align-items-center coverBackground">
        <ToastContainer />
        <Container>
          <Row className="justify-content-center fadeIn">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>

                    <Form onSubmit={this.handleSubmit}>
                      <InputGroup className="mb-3">
                        <InputGroupAddon><i className="icon-user"></i></InputGroupAddon>
                        { !this.state.invalid_username &&
                          <Input type="text" placeholder="Username" name="username" required/>
                        }
                        { this.state.invalid_username &&
                            <Input valid={false} type="text" placeholder="Username" name="username" required/>
                        }
                      </InputGroup>

                      <InputGroup className="mb-4">
                        <InputGroupAddon><i className="icon-lock"></i></InputGroupAddon>
                        { !this.state.invalid_password &&
                          <Input type="password" placeholder="Password" name="password" required/>
                        }
                        { this.state.invalid_password &&
                            <Input valid={false} type="password" placeholder="Password" name="password" required/>
                        }
                      </InputGroup>
                        {
                          (this.state.invalid_username || this.state.invalid_password) &&
                            <p className="red"><small>Invalid Username/Password</small></p>
                        }
                      <Row>
                        <Col xs="6">
                          {
                            this.state.loading &&  <Button color="primary" className="px-4"><Spinner name="circle" color="white" fadeIn="none" /></Button>
                          }
                          {
                            !this.state.loading && <Button type="submit" color="primary" className="px-4">Login</Button>
                          }

                        </Col>

                        {/* <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">Forgot password?</Button>
                        </Col> */}
                      </Row>

                    </Form>

                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Sign up to the Orion Invoices platform to start saving
                        time and help to better manage your business.</p>
                      <Button color="primary" className="mt-3" onClick={() => this.props.history.push('/register')} active>Register Now!</Button>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
