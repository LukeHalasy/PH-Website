import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
	sendFlashMessage,
	clearFlashMessages,
	fetchEvent,
	getClassData,
	getClassOptions,
	getMajorData,
	getMajorOptions,
	getMembersEventAttendance,
	getMembersEventAttendanceOptions,
	fetchEventsPriorToEvent
} from '../../actions';
import { err } from '../../constants';
import { CustomRedirect, Header } from '../Common';
import { Bar } from 'react-chartjs-2';

class ReportsPage extends Component {
	static propTypes = {
		match: PropTypes.shape({
			params: PropTypes.shape({
				id: PropTypes.string
			})
		}).isRequired,
		flash: PropTypes.func.isRequired,
		clear: PropTypes.func.isRequired
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

			//filter out events that members went too after the event
			//This way we can accurately track new event attenders and
			//how many events the members had attended before this event

			//Get all event ids for events before this one
			const { eventsBeforeIds } = await fetchEventsPriorToEvent(event._id);

			for (var i = 0; i < event.members.length; i++) {
				event.members[i].events = event.members[i].events.filter(eventId => {
					return eventsBeforeIds.includes(eventId);
				});
			}

			console.log('Fetched event:', event);

			this.setState({ event, loading: false });
		} catch (error) {
			this.setState({ loading: false });
			flash(err(error));
		}
	};

	setupClassData = () => {
		const gradeData = [0, 0, 0, 0];

		var FRESHMAN;
		var SOPHOMORE;
		var JUNIOR;
		var SENIOR;

		//if the event took place during first semester
		//0 indexed months so add 1..
		const eventDate = new Date(this.state.event.eventTime);
		if (eventDate.getMonth() + 1 >= 8) {
			FRESHMAN = eventDate.getFullYear() + 4;
		} else {
			//Spring
			FRESHMAN = eventDate.getFullYear() + 3;
		}

		SOPHOMORE = FRESHMAN - 1;
		JUNIOR = SOPHOMORE - 1;
		SENIOR = JUNIOR - 1;

		for (var i = 0; i < this.state.event.members.length; i++) {
			if (this.state.event.members[i].graduationYear) {
				switch (this.state.event.members[i].graduationYear) {
					case FRESHMAN:
						gradeData[0] += 1;
						break;
					//sophomore
					case SOPHOMORE:
						gradeData[1] += 1;
						break;
					//junior
					case JUNIOR:
						gradeData[2] += 1;
						break;
					//senior
					case SENIOR:
						gradeData[3] += 1;
						break;
					default:
						break;
				}
			}
		}

		return getClassData(gradeData, `in ${eventDate.getFullYear()}`);
	};

	setupMajorData = () => {
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

	setupMembersEventAttendance = () => {
		//Make this for the time of event
		const eventAttendance = {};
		const eventDate = new Date(this.state.event.eventTime);

		for (var i = 0; i < this.state.event.members.length; i++) {
			if (this.state.event.members[i].events != null) {
				if (eventAttendance[this.state.event.members[i].events.length]) {
					eventAttendance[this.state.event.members[i].events.length] += 1;
				} else {
					eventAttendance[this.state.event.members[i].events.length] = 1;
				}
			}
		}

		return getMembersEventAttendance(eventAttendance, `Attendees Event Attendance`);
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
						<h3>
							<Link key={`${match.params.id}-1`} to={`/event/${match.params.id}`}>
								<button type="button" className="pull-left btn btn-primary btn-sm">
									<span className="glyphicon glyphicon-chevron-left" aria-hidden="true" />
									Event
								</button>
							</Link>
							{event.name} Report
						</h3>
					</div>
				</div>
				<div className="section">
					<div className="section-container" style={{ paddingBottom: '30px' }}>
						<Header message="Class Data" />
						<Bar data={this.setupClassData()} options={getClassOptions()} />
					</div>
				</div>
				<div className="section" style={{ paddingBottom: '30px' }}>
					<div className="section-container">
						<Header message="Major Data" />
						<Bar data={this.setupMajorData()} options={getMajorOptions()} />
					</div>
				</div>
				<div className="section">
					<div className="section-container">
						<Header message="Member Event Attendance" />
						<Bar
							data={this.setupMembersEventAttendance()}
							options={getMembersEventAttendanceOptions()}
						/>
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
