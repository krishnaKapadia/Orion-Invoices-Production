import React, {Component} from 'react';
import {
  Container, Row, Col, CardGroup, Card, CardBody, Button, Input,
  InputGroup, InputGroupAddon, Form
} from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setLogin, setCurrentUserCredentials } from '../../Redux/Actions/index';
import { ToastContainer, toast } from 'react-toastify';
import Spinner from 'react-spinkit';
import axios from 'axios';

class Register extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false
    }

    this.register = this.register.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
  * Registers entered user credentials with backend API by first creating a Company
  */
  register(data) {
    const userCredentials = {
      name: data.get("company"),
      username: data.get("username"),
      password: data.get("password"),
      email: data.get("email")
    }

    axios.post("http://localhost:4000/api/v1/companies", userCredentials).then((response) => {
      if(response.data.result) {
        console.log(response.data.data);
        this.props.setCurrentUserCredentials(response.data.data);
        this.props.setLogin(true);


        // TODO redirection and toast is not working!!!!!!!!!!
        // redirect to dashboard
         this.props.history.push("/dashboard");

        // TODO put the company_id to every header request using: axios.defaults.headers.common['Auth-Token'] = 'foo bar';

         toast.success("Company registered! Welcome to Orion invoices", {
           position: toast.POSITION.BOTTOM_RIGHT
         });
      }
    }).catch((err) => {
      if(err) {
        this.setState({ loading: false });
        toast.error("Could not register, please try again, " + err.response.data.error, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      }
    });
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
    this.register(data);
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
                    <h1>Register</h1>
                    <p className="text-muted">Create your account</p>

                    <Form onSubmit={this.handleSubmit}>
                      <InputGroup className="mb-3">
                        <InputGroupAddon><i className="icon-rocket"></i></InputGroupAddon>
                        <Input type="text" placeholder="Company name" name="company" required />
                      </InputGroup>
                      <InputGroup className="mb-3">
                        <InputGroupAddon>@</InputGroupAddon>
                        <Input type="text" placeholder="Email" name="email" required />
                      </InputGroup>

                      <InputGroup className="mb-3">
                        <InputGroupAddon><i className="icon-user"></i></InputGroupAddon>
                        <Input type="text" placeholder="Username" name="username" required />
                      </InputGroup>

                      <InputGroup className="mb-3">
                        <InputGroupAddon><i className="icon-lock"></i></InputGroupAddon>
                        <Input type="password" placeholder="Password" name="password" required />
                      </InputGroup>

                      <InputGroup className="mb-4">
                        <InputGroupAddon><i className="icon-lock"></i></InputGroupAddon>
                        <Input type="password" placeholder="Repeat password" required/>
                      </InputGroup>

                      <Row>
                        <Col xs="6">
                          {
                            this.state.loading &&  <Button color="success" className="px-4"><Spinner name="circle" color="white" fadeIn="none" /></Button>
                          }
                          {
                            !this.state.loading && <Button type="submit" color="success" block>Create Account</Button>
                          }
                          {/* <Button type="submit" color="primary" className="px-4">Login</Button> */}
                        </Col>

                      </Row>

                    </Form>

                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: 44 + '%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Login</h2>
                      <p>If you already have an account then just login!</p>
                      <Button color="primary" className="mt-3" onClick={() => this.props.history.push('/login')} active>Login!</Button>
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
  return bindActionCreators({ setLogin: setLogin, setCurrentUserCredentials: setCurrentUserCredentials }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
