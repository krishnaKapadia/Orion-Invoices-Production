import axios from 'axios';
import {connect} from 'react-redux';

/**
* Custom Axios component with base header containing current users credentials.
* Used in place of axios to send the header information with every request
*/

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

export default connect(mapStateToProps)(() => {
  // if(this.props.isLoggedIn){
    return axios.create({
      baseURL: '',
      headers: {
        'company_id': this.props.currentUserCredentials
      }
    });
  // } else {
  //   return axios.create({
  //     headers: {
  //       'company_id': null
  //     }
  //   });
  // }
});
