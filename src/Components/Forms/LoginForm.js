import React, { Component } from 'react';
import { Row, Col, Panel, FormGroup } from 'react-bootstrap';

class LoginForm extends Component {

  render() {
    return (
      <div class="container">
        <Row>
          <Col md={6} mdOffset={3}>
            <Panel className="panel-body">
              <Row>
                <Col lg={12}>
                  <form action="#" className="loginForm">
                    <h2>LOGIN</h2>
                    <FormGroup>
                      <input type="text" name="username" id="username" tabindex="1" class="form-control" placeholder="Username" value="" />
                    </FormGroup>
                    <FormGroup>
                      <input type="password" name="password" id="password" tabindex="2" class="form-control" placeholder="Password" />
                    </FormGroup>
                    <FormGroup class="col-xs-6 pull-left checkbox">
                      <input id="checkbox1" type="checkbox" name="remember" />
                    </FormGroup>
                    <FormGroup class="col-xs-6 form-group pull-right">
                          <input type="submit" name="login-submit" id="login-submit" tabindex="4" class="form-control btn btn-login" value="Log In" />
                    </FormGroup>
                  </form>

                </Col>
              </Row>

              <div class="panel-heading">
                <div class="row">
                  <div class="col-xs-6 tabs">
                    <a href="#" className="login-form-link"><div className="login">LOGIN</div></a>
                  </div>
                  <div class="col-xs-6 tabs">
                    <a href="#" id="register-form-link"><div className="register">REGISTER</div></a>
                  </div>
                </div>
              </div>
              
            </Panel>
          </Col>
        </Row>
      </div>
    );
  }

}

export default LoginForm;
