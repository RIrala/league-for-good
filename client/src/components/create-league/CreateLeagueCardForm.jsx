import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import { TextField } from 'redux-form-material-ui';
import RaisedButton from 'material-ui/RaisedButton';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import validate from './validate';
import SportTypeSelector from './CreateLeagueButton.jsx';
import {createLeague} from '../../actions/index';

const formStyle = {
	width:'80%',
	margin:'40px auto 30px'
};

const textFieldStyle = { marginRight: '10%' };
const buttonStyle = { marginTop:'30px' };


class CreateLeagueForm extends Component{

	onSubmit = formBody => {
		const {createLeague, history} = this.props;
		const redirectMethod = () => history.push('/');

		//call the createLeague action and pass in the validated form fields
		//and a callback function to redirect the url.
		//I cant figure out another way to trigger the redirect after a successful form submission
		//than by accessing react-routers built in method from inside the component
		createLeague(formBody, redirectMethod);	
	}

	render(){
		const {error, handleSubmit, change, SelectedSportType} = this.props;

		return(
			<div>
				<SportTypeSelector 
					onSelect={(sport)=> change('sportType', sport)}
					selectedSport = {SelectedSportType}
				/>
				{SelectedSportType &&	 
				<form 
					onSubmit={ handleSubmit(this.onSubmit)}
					style={formStyle}
				>
					<Field 
						name="sportType"
						type="hidden"
						component="input"
					/>
					<Field
						name="name" 
						component={TextField}
						floatingLabelText={`${SelectedSportType} League Name`}
						fullWidth={true}
						style={textFieldStyle}
					/>
					<RaisedButton
						label="Create"
						style={buttonStyle}
						primary={true}
						type="submit"
					/>
				</form>
				}
			</div>
		);
	}
}

//redux-form method to access form field values
const selector = formValueSelector('CreateLeagueForm');

//Decorate component with redux-form
CreateLeagueForm = reduxForm({form:'CreateLeagueForm',validate})(CreateLeagueForm)

// Callback function passed to the connect function to access the form state
function mapFormStateToProps(state){
	return {SelectedSportType: selector(state, 'sportType')}
}

function mapDispatchToProps(dispatch){
	return bindActionCreators({createLeague}, dispatch);
}

//Decorate component with redux bindings
CreateLeagueForm = connect(mapFormStateToProps, mapDispatchToProps)(CreateLeagueForm);

//Decorate component one last time with react-router bindings in order to redirect user
//after a successful form submission
export default withRouter(CreateLeagueForm);
