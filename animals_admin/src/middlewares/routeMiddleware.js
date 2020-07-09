import React from "react";
import {Redirect, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import {isAuthenticated} from "../reducers/index";


class PrivateRouteContainer extends React.Component {
  render(){
    return(
      this.props.isAuthenticated ? (
      <Route {...this.props}/>
    ):
        <Redirect to='/sign-in' />
    );
  }
}

class PublicRouteContainer extends React.Component {
  render(){
    return(
      !this.props.isAuthenticated ?(
      <Route {...this.props}/>
        ):
        <Redirect to='/' />
    );
  }
}



const mapStateToProps = state => ({
  isAuthenticated: isAuthenticated(state),
});

export const PrivateRoute = connect(
  mapStateToProps
)(PrivateRouteContainer);

export const PublicRoute = connect(
  mapStateToProps
)(PublicRouteContainer);