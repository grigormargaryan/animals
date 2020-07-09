import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { func } from 'prop-types';
import SignInComponent from '../components/SignIn/SignInComponent';
import { loginAction } from '../actions/auth';
import { authErrors, getSuccessMsg, isAuthenticated } from '../reducers';


const SignInContainer = (props,state) => {

  const onSubmit = values => {
		props.loginAction(values);
	};

		return (
			<div className="login-page">
				<SignInComponent
					onSubmit={onSubmit}
					errors={props.errors}
					successMsg={props.successMsg}
					state={state}
				/>
			</div>
		);
};

SignInContainer.propTypes = {
  loginAction: func.isRequired,
};

const mapStateToProps = state => ({
	errors: authErrors(state),
	isAuthenticated: isAuthenticated(state),
	successMsg: getSuccessMsg(state)
});

const mapDispatchToProps = dispatch => bindActionCreators({ loginAction }, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SignInContainer);
