import React, {Component} from 'react';
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown
} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class HeaderDropdown extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  dropAccnt() {
    return (
      <Dropdown className="usernameContainer" nav isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        {/* <DropdownToggle> */}
        <NavLink to="/profile" className="username" >
            {/* <img src={'img/avatars/2.jpg'} style={ { width: '70%' } } className="img-avatar" alt="Profile Picture"/> */}
            {this.props.currentUserCredentials.username.toUpperCase()}
          {/* </DropdownToggle> */}
        </NavLink>
      </Dropdown>
    );
  }

  render() {
    const {...attributes} = this.props;
    return (
      this.dropAccnt()
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
    _persist: state.persist
  }
}

export default connect(mapStateToProps)(HeaderDropdown);
