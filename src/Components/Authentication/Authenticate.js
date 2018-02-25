import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

/**
* Ensures that the user is logged in, in order to use the app.
* Otherwise user gets directed to login/register page.
* Connected to Redux global state
*/
class Authenticate extends Component {

  componentDidMount() {
    const { dispatch, currentURL } = this.props;

    if(!this.props.isLoggedIn) {
      // Redirect
      this.props.history.push("/login");
    }
  }

  render() {
    if(this.props.isLoggedIn) return(<Redirect to="/dashboard" />);
    else return(null);
  }

}

/**
* Sets props to be accessed by the Authenticate component from redux
* global state
*/
function mapStateToProps(state) {
  return {
    isLoggedIn: state.isLoggedIn
  }
}

// Connects the set props to the Authenticate component
export default connect(mapStateToProps)(Authenticate);
