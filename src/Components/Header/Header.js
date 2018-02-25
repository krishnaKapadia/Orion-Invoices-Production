import React, { Component } from 'react';
import HeaderDropdown from './HeaderDropdown';
import {
  Nav,
  NavItem,
  NavbarToggler,
  NavbarBrand,
  NavLink,
  Badge,
} from 'reactstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setLogin } from '../../Redux/Actions/index';
import PropTypes from 'prop-types';
import {persistStore} from 'redux-persist';

class Header extends Component {

  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
  }

  sidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-hidden');
  }

  sidebarMinimize(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-minimized');
  }

  mobileSidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  }

  asideToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('aside-menu-hidden');
  }

  /**
  * Sets the redux isLoggedIn state variable to reflect logout,
  * Instead redux state is completly reset.
  */
  logout() {
    // set redux state variable
    // this.context.persistor.pause();
    persistStore(this.context.store).purge().then((i) => {

    })
    this.props.setLogin(false);
    this.props.dispatch( { type: 'RESET' });
    // Redirect
    // this.props.history.push("/login");
  }

  render() {
    return (
      <header className="app-header navbar">
        <NavbarToggler className="d-lg-none" onClick={this.mobileSidebarToggle}>
          <span className="navbar-toggler-icon"></span>
        </NavbarToggler>

        <NavbarBrand />

        <NavbarToggler className="d-md-down-none mr-auto" onClick={this.sidebarToggle}>
          <span className="navbar-toggler-icon"></span>
        </NavbarToggler>

        {/* <NavbarToggler className="d-md-down-none" onClick={this.asideToggle}>
          <span className="navbar-toggler-icon"></span>
        </NavbarToggler> */}
        {/* <HeaderDropdown/> */}

        <Nav className="d-md-down-none" pills>
          <NavItem>
            <NavLink href="#" onClick={this.asideToggle}>Settings</NavLink>
          </NavItem>

          <NavItem>
              <NavLink href="" onClick={this.logout}>Log out</NavLink>
          </NavItem>

        </Nav>

        <Nav navbar>
          <HeaderDropdown />
        </Nav>


      </header>
    )
  }
}

/**
* Sets props to be accessed by the Header component from redux
* global state. Variables & Objects
*/
function mapStateToProps(state) {
  return {
    isLoggedIn: state.isLoggedIn
  }
}

/**
* Sets action functions to be used by the Header component through props.
* Functions
*/
function mapDispatchToProps(dispatch) {
  // When setLogin is called, result is passed to all reducers
  return bindActionCreators({ setLogin: setLogin }, dispatch);
}

Header.contextTypes = {
  store: PropTypes.object
};

export default connect()(Header);
