import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Header } from '../Common';
import {
	fetchMembers,
	fetchMajors,
	fetchMembersNumEvents,
	fetchEvents,
	getClassData,
	getClassOptions,
	getMajorData,
	getMajorOptions,
	getMembersEventAttendance,
	getMembersEventAttendanceOptions
} from '../../actions';
import { Bar, Line } from 'react-chartjs-2';

class ReportsPage extends Component {
	static propTypes = {
		history: PropTypes.shape({
			push: PropTypes.func
		}).isRequired,
		user: PropTypes.object
	};

	static defaultProps = { user: null };

	constructor(props) {
		super(props);
		this.state = {
			members: [],
			majors: [],
			membersNumEvents: [],
			events: [],
			loading: true
		};
	}

	componentDidMount = async () => {
		const { members } = await fetchMembers({});
		const { majors } = await fetchMajors();
		const { membersNumEvents } = await fetchMembersNumEvents();
		const { events } = await fetchEvents({});

		console.log('ReportsPage fetched members:', members);
		console.log('ReportsPage fetched majors:', majors);
		console.log('ReportsPage fetched membersNumEvents:', membersNumEvents);
		console.log('ReportsPage fetched events:', events);
		this.setState({ members, majors, membersNumEvents, events, loading: false });
	};

	setupClassData = () => {
		const gradeData = [0, 0, 0, 0];

		for (var i = 0; i < this.state.members.length; i++) {
			if (this.state.members[i].graduationYear) {
				switch (this.state.members[i].graduationYear) {
					//freshman
					case 2022:
						gradeData[0] += 1;
						break;
					//sophomore
					case 2021:
						gradeData[1] += 1;
						break;
					//junior
					case 2020:
						gradeData[2] += 1;
						break;
					//senior
					case 2019:
						gradeData[3] += 1;
						break;
					default:
						break;
				}
			}
		}

		return getClassData(gradeData);
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

		for (var i = 0; i < this.state.majors.length; i++) {
			if (this.state.majors[i]) {
				majorDataDict[this.state.majors[i]] += 1;
			}
		}

		return getMajorData(majorDataDict);
	};

	getSpecificDateJoinedData = () => {
		var numPeoplePerDateJoined = {};

		for (var i = 0; i < this.state.members.length; i++) {
			if (this.state.members[i].createdAt) {
				const date = new Date(this.state.members[i].createdAt);
				const month = date.getMonth();
				const year = date.getFullYear();
				var formattedDate;
				if (month + 1 < 10) {
					formattedDate = `0${month + 1}/${year}`;
				} else {
					formattedDate = `${month + 1}/${year}`;
				}

				if (!numPeoplePerDateJoined[formattedDate]) {
					numPeoplePerDateJoined[formattedDate] = 1;
				} else {
					numPeoplePerDateJoined[formattedDate] += 1;
				}
			}
		}

		const data = {
			labels: Object.keys(numPeoplePerDateJoined).reverse(),
			datasets: [
				{
					label: '# New Members Per Month',
					fill: false,
					lineTension: 0.1,
					backgroundColor: 'rgba(155, 232, 184, 0.4)',
					borderColor: 'rgba(155, 232, 184, 1)',
					borderCapStyle: 'butt',
					borderDash: [],
					borderDashOffset: 0.0,
					borderJoinStyle: 'miter',
					pointBorderColor: 'rgba(155, 232, 184, 1)',
					pointBackgroundColor: '#fff',
					pointBorderWidth: 1,
					pointHoverRadius: 5,
					pointHoverBackgroundColor: 'rgba(155, 232, 184, 1)',
					pointHoverBorderColor: 'rgba(155, 232, 1840, 1)',
					pointHoverBorderWidth: 2,
					pointRadius: 1,
					pointHitRadius: 10,
					data: Object.values(numPeoplePerDateJoined).reverse()
				}
			]
		};

		return data;
	};

	getCumulativeDateJoinedData = () => {
		var numPeopleAtDate = {};

		for (var i = 0; i < this.state.members.length; i++) {
			if (this.state.members[i].createdAt) {
				const date = new Date(this.state.members[i].createdAt);
				const month = date.getMonth();
				const year = date.getFullYear();
				var formattedDate;
				if (month + 1 < 10) {
					formattedDate = `0${month + 1}/${year}`;
				} else {
					formattedDate = `${month + 1}/${year}`;
				}

				if (!numPeopleAtDate[formattedDate]) {
					numPeopleAtDate[formattedDate] = 1;
				} else {
					numPeopleAtDate[formattedDate] += 1;
				}
			}
		}

		for (var j = Object.keys(numPeopleAtDate).length - 2; j >= 0; j--) {
			const currDate = Object.keys(numPeopleAtDate)[j];
			const prevDate = Object.keys(numPeopleAtDate)[j + 1];
			numPeopleAtDate[currDate] = numPeopleAtDate[currDate] + numPeopleAtDate[prevDate];
		}

		const data = {
			labels: Object.keys(numPeopleAtDate).reverse(),
			datasets: [
				{
					label: '# Members',
					fill: false,
					lineTension: 0.1,
					backgroundColor: 'rgba(238, 218, 105, 0.4)',
					borderColor: 'rgba(238, 218, 105, 1)',
					borderCapStyle: 'butt',
					borderDash: [],
					borderDashOffset: 0.0,
					borderJoinStyle: 'miter',
					pointBorderColor: 'rgba(238, 218, 105, 1)',
					pointBackgroundColor: '#fff',
					pointBorderWidth: 1,
					pointHoverRadius: 5,
					pointHoverBackgroundColor: 'rgba(238, 218, 105, 1)',
					pointHoverBorderColor: 'rgba((238, 218, 105, 1)',
					pointHoverBorderWidth: 2,
					pointRadius: 1,
					pointHitRadius: 10,
					data: Object.values(numPeopleAtDate).reverse()
				}
			]
		};

		return data;
	};

	setupMembersEventAttendance = () => {
		const eventAttendance = {};

		for (var i = 0; i < this.state.membersNumEvents.length; i++) {
			if (eventAttendance[this.state.membersNumEvents[i]]) {
				eventAttendance[this.state.membersNumEvents[i]] += 1;
			} else {
				eventAttendance[this.state.membersNumEvents[i]] = 1;
			}
		}

		return getMembersEventAttendance(eventAttendance, 'Members Event Attendance');
	};

	getEventAttendance = () => {
		var numAttendeesPerDate = {};

		for (var i = 0; i < this.state.events.length; i++) {
			if (this.state.events[i].members && this.state.events[i].members.length > 0) {
				const date = new Date(this.state.events[i].eventTime);
				const month = date.getMonth();
				const year = date.getFullYear();
				var formattedDate;
				if (month + 1 < 10) {
					formattedDate = `0${month + 1}/${year}`;
				} else {
					formattedDate = `${month + 1}/${year}`;
				}

				if (!numAttendeesPerDate[formattedDate]) {
					numAttendeesPerDate[formattedDate] = this.state.events[i].members.length;
				} else {
					numAttendeesPerDate[formattedDate] += this.state.events[i].members.length;
				}
			}
		}

		const data = {
			labels: Object.keys(numAttendeesPerDate).reverse(),
			datasets: [
				{
					label: 'Total Event Attendance Per Month',
					fill: false,
					lineTension: 0.12,
					backgroundColor: 'rgba(255, 99, 132, 0.4)',
					borderColor: 'rgba(255, 99, 132, 1)',
					borderCapStyle: 'butt',
					borderDash: [],
					borderDashOffset: 0.0,
					borderJoinStyle: 'miter',
					pointBorderColor: 'rgba(255, 99, 132, 1)',
					pointBackgroundColor: '#fff',
					pointBorderWidth: 1,
					pointHoverRadius: 5,
					pointHoverBackgroundColor: 'rgba(255, 99, 132, 1)',
					pointHoverBorderColor: 'rgba(255, 99, 132, 1)',
					pointHoverBorderWidth: 2,
					pointRadius: 1,
					pointHitRadius: 10,
					data: Object.values(numAttendeesPerDate).reverse()
				}
			]
		};

		return data;
	};

	render() {
		return (
			<div>
				<div className="section">
					<div className="section-container">
						<Header message="Members Report" />
						<h3>Members Report</h3>
					</div>
				</div>
				<div
					className="section"
					style={{ textAlign: 'left' }}
					style={{ paddingBottom: '30px' }}
				>
					<div className="section-container">
						<Bar data={this.setupClassData()} options={getClassOptions()} />
					</div>
				</div>
				<div className="section" style={{ paddingBottom: '30px' }}>
					<div className="section-container">
						<Bar data={this.setupMajorData()} options={getMajorOptions()} />
					</div>
				</div>
				<div className="section" style={{ paddingBottom: '30px' }}>
					<div className="section-container">
						<Line data={this.getSpecificDateJoinedData()} />
					</div>
				</div>
				<div className="section" style={{ paddingBottom: '30px' }}>
					<div className="section-container">
						<Line data={this.getCumulativeDateJoinedData()} />
					</div>
				</div>
				<div className="section" style={{ paddingBottom: '30px' }}>
					<div className="section-container">
						<Bar
							data={this.setupMembersEventAttendance()}
							options={getMembersEventAttendanceOptions()}
						/>
					</div>
				</div>
				<div className="section">
					<div className="section-container">
						<Line data={this.getEventAttendance()} />
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
	{}
)(ReportsPage);
