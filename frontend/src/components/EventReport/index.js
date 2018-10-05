import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
	sendFlashMessage,
	clearFlashMessages,
	fetchEvent,
	getClassData,
	getMajorData
} from '../../actions';
import { err } from '../../constants';
import { CustomRedirect, Header } from '../Common';
import { Bar, Line } from 'react-chartjs-2';

class ReportsPage extends Component {
	static propTypes = {
		match: PropTypes.shape({
			params: PropTypes.shape({
				id: PropTypes.string
			})
		}).isRequired,
		flash: PropTypes.func.isRequired,
		clear: PropTypes.func.isRequired,
		user: PropTypes.object.isRequired
	};

	constructor(props) {
		super(props);
		this.state = {
			event: [],
			loading: true
		};
		console.log('Event report page props', this.props);
	}

	componentDidMount = async () => {
		const {
			match: {
				params: { id }
			},
			flash,
			clear
		} = this.props;
		try {
			clear();
			const event = await fetchEvent(id);
			console.log('Fetched event:', event);

			this.setState({ event, loading: false });
		} catch (error) {
			this.setState({ loading: false });
			flash(err(error));
		}
	};

	setUpMajorData = () => {
		const majorDataDict = {
			'Computer Science': 0,
			'Computer Graphics Technology': 0,
			'Computer Information Technology': 0,
			'Electrical Computer Engineering': 0,
			'Electrical Engineering': 0,
			'First Year Engineering': 0,
			Math: 0,
			'Mechanical Engineering': 0,
			Other: 0
		};

		for (var i = 0; i < this.state.event.members.length; i++) {
			if (this.state.event.members[i].major) {
				majorDataDict[this.state.event.members[i].major] += 1;
			}
		}

		return getMajorData(majorDataDict);
	};

	render() {
		const { match } = this.props;
		const { event, loading } = this.state;

		if (loading) return <span>Loading...</span>;
		if (!loading && !event) return <CustomRedirect msgRed="Event not found" />;

		return (
			<div>
				<div className="section">
					<div className="section-container">
						<Header message={event.name} />
						<h3>Event - {event.name} </h3>
						<Link key={`${match.params.id}-1`} to={`/event/${match.params.id}`}>
							<button type="button" className="pull-left btn btn-primary btn-sm">
								<span className="glyphicon glyphicon-chevron-left" aria-hidden="true" />
								Event
							</button>
						</Link>
					</div>
				</div>
				<div className="section">
					<div className="section-container">
						<Header message="Class Data" />
						<Bar data={getClassData(event.members)} />
					</div>
				</div>
				<div className="section">
					<div className="section-container">
						<Header message="Major Data" />
						<Bar data={this.setUpMajorData()} />
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	...state.sessionState
});

export default connect(
	mapStateToProps,
	{
		flash: sendFlashMessage,
		clear: clearFlashMessages
	}
)(ReportsPage);
