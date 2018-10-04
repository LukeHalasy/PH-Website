import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { MemberTable, Header } from '../Common';
import routes, { hasPermission } from '../../constants';
import { fetchMembers, fetchMajors } from '../../actions';
import { Bar, Line } from 'react-chartjs-2';
import '../Common/AboutSection.css';
import '../Common/EventSection.css';

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
			loading: true
		};
	}

	componentDidMount = async () => {
		const { members } = await fetchMembers({});
		const { majors } = await fetchMajors();
		console.log('ReportsPage fetched members:', members);
		console.log('ReportsPage fetched majors:', majors);
		this.setState({ members, majors, loading: false });
	};

	getClassData = () => {
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
					case 2019:
						gradeData[3] += 1;
					//senior
					default:
						break;
				}
			}
		}

		const data = {
			labels: ['Freshman', 'Sophomore', 'Junior', 'Senior'],
			datasets: [
				{
					label: 'Class Distribution',
					backgroundColor: 'rgba(255,99,132,0.2)',
					borderColor: 'rgba(255,99,132,1)',
					borderWidth: 1,
					hoverBackgroundColor: 'rgba(255,99,132,0.4)',
					hoverBorderColor: 'rgba(255,99,132,1)',
					data: gradeData
				}
			]
		};

		return data;
	};

	getMajorData = () => {
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

		const date = {
			labels: ['CS', 'CGT', 'CIT', 'ECE', 'EE', 'FYE', 'ME', 'Other'],
			datasets: [
				{
					label: 'Major Distribution',
					backgroundColor: 'rgba(50,144,154,0.2)',
					borderColor: 'rgba(50,144,154,1)',
					borderWidth: 1,
					hoverBackgroundColor: 'rgba(50,144,154,0.4)',
					hoverBorderColor: 'rgba(50,144,154,1)',
					data: Object.values(majorDataDict)
				}
			]
		};

		return date;
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

		for (var i = Object.keys(numPeopleAtDate).length - 2; i >= 0; i--) {
			const currDate = Object.keys(numPeopleAtDate)[i];
			const prevDate = Object.keys(numPeopleAtDate)[i + 1];
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

	render() {
		const { members, loading } = this.state;
		const { user } = this.props;

		return (
			<div>
				<div className="section events" style={{ textAlign: 'left' }}>
					<div className="section-container">
						<Header message="Class Data" />
						<Bar data={this.getClassData} />
					</div>
				</div>
				<div className="section about">
					<div className="section-container">
						<Header message="Reports" />
						<Bar data={this.getMajorData} />
					</div>
				</div>
				<div className="section about">
					<div className="section-container">
						<Header message="Reports" />
						<Line data={this.getSpecificDateJoinedData()} />
					</div>
				</div>
				<div className="section about">
					<div className="section-container">
						<Header message="Reports" />
						<Line data={this.getCumulativeDateJoinedData()} />
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

//<h2>{JSON.stringify(this.state.members[0])}</h2>

// <-----------------------CHART IMPLEMENTATION CODE -------------------->

// @extends("app")
//
// @section("content")
//
// <div class="section"><div class='section-container'>
// 	<h3>Members Graphs
// 		<button type="button" class="btn btn-primary btn-sm pull-right">{{ count($members) }} members</button>
// 	</h3>
//
// 	<div class="panel panel-default">
// 		<div id="joinDates" class="graph"></div>
// 		<div id="loginDates" class="graph"></div>
// 		<div id="eventAttendance" class="graph"></div>
// 		<div id="numAttended" class="graph"></div>
// 		<div id="memberYears" class="graph"></div>
// 		<div id="majorsGraph" class="graph"></div>
// 	</div>
//
// </div></div>
//
// @stop
//
// @section("customJS")
// <!-- Graphs (AMCharts) -->
// <script type="text/javascript" src="//www.amcharts.com/lib/3/amcharts.js"></script>
// <script type="text/javascript" src="//www.amcharts.com/lib/3/serial.js"></script>
// <script type="text/javascript" src="//www.amcharts.com/lib/3/themes/light.js"></script>
//
// <script type="text/javascript">
// 	var joinDatesData = JSON.parse('{!! json_encode($joinDates); !!}');
// 	var joinDates = AmCharts.makeChart("joinDates", $.extend(true, {
// 			"dataProvider": joinDatesData,
// 			"titles": [{
// 				"text": "Join Date",
// 				"size": 11
// 			}],
// 		}, dateChartProperties));
//
// 	var loginDatesData = JSON.parse('{!! json_encode($loginDatesData); !!}');
// 	var loginDates = AmCharts.makeChart("loginDates", $.extend(true, {
// 			"dataProvider": loginDatesData,
// 			"titles": [{
// 				"text": "Last Login Date",
// 				"size": 11
// 			}],
// 		}, dateChartProperties));
//
// 	var eventAttendanceData = JSON.parse('{!! json_encode($eventAttendanceData); !!}');
// 	var eventAttendance = AmCharts.makeChart("eventAttendance", $.extend(true, {
// 			"dataProvider": eventAttendanceData,
// 			"titles": [{
// 				"text": "Event Attendance",
// 				"size": 11
// 			}],
// 		}, dateChartProperties));
//
// 	var numAttendedData = JSON.parse('{!! json_encode($numAttendedData); !!}');
// 	var numAttended = AmCharts.makeChart("numAttended", $.extend(true, {
// 			"dataProvider": numAttendedData,
// 			"titles": [{
// 				"text": "# Events Attended",
// 				"size": 11
// 			}],
// 		}, intChartProperties));
//
// 	var memberYearsData = JSON.parse('{!! json_encode($memberYears); !!}');
// 	var memberYears = AmCharts.makeChart("memberYears", $.extend(true, {
// 			"dataProvider": memberYearsData,
// 			"titles": [{
// 				"text": "Graduation Year",
// 				"size": 11
// 			}],
// 		}, intChartProperties));
//
// 	var majorsGraphData = JSON.parse('{!! json_encode($majorsData); !!}');
// 	var majorsGraph = AmCharts.makeChart("majorsGraph", $.extend(true, {
// 			"dataProvider": majorsGraphData,
// 			"titles": [{
// 				"text": "Major",
// 				"size": 11
// 			}],
// 		}, textChartProperties));
// </script>
//
// @stop

// ------------- CHART OPTION SHIT -------------------------------

// var dateChartProperties = {
//     "type": "serial",
//     "dataDateFormat": "YYYY-MM-DD",
//     "legend": {
//         "useGraphSettings": true
//     },
//     "valueAxes": [{
//         "id":"v1",
//         "axisColor": "#FF6600",
//         "position": "left"
//     }],
//     "graphs": [{
//         "valueAxis": "v1",
//         "lineColor": "#FF6600",
//         "bullet": "round",
//         "hideBulletsCount": 30,
//         "title": "# Members",
//         "valueField": 'count',
//         "type": "smoothedLine",
//     }],
//     "chartScrollbar": {
// 		"scrollbarHeight": 15
// 	},
//     "chartCursor": {
//         "cursorPosition": "mouse"
//     },
//     "categoryField": 'date',
//     "categoryAxis": {
//         "parseDates": true,
//         "axisColor": "#DADADA",
//         "minorGridEnabled": true
// 	}
// };
//
// var intChartProperties = {
//     "type": "serial",
//     "legend": {
//         "useGraphSettings": true
//     },
//     "valueAxes": [{
//         "id":"v1",
//         "axisColor": "#FF6600",
//         "position": "left"
//     }],
//     "graphs": [{
//         "valueAxis": "v1",
//         "lineColor": "#FF6600",
//         "bullet": "round",
//         "hideBulletsCount": 30,
//         "title": "# Members",
//         "valueField": 'count',
//         "type": "smoothedLine",
//     }],
//     "chartScrollbar": {
// 		"scrollbarHeight": 15
// 	},
//     "chartCursor": {
//         "cursorPosition": "mouse"
//     },
//     "categoryField": 'key',
//     "categoryAxis": {
//         "axisColor": "#DADADA",
//         "minorGridEnabled": true
// 	}
// };
//
// var textChartProperties = {
//     "type": "serial",
//     "legend": {
//         "useGraphSettings": true
//     },
//     "valueAxes": [{
//         "id":"v1",
//         "axisColor": "#FF6600",
//         "position": "left"
//     }],
//     "graphs": [{
//         "valueAxis": "v1",
//         "lineColor": "#FF6600",
//         "bullet": "round",
//         "hideBulletsCount": 30,
//         "title": "# Members",
//         "valueField": 'count',
//         "type": "smoothedLine",
//     }],
//     "chartScrollbar": {
// 		"scrollbarHeight": 15
// 	},
//     "chartCursor": {
//         "cursorPosition": "mouse"
//     },
//     "categoryField": 'key',
//     "categoryAxis": {
//         "axisColor": "#DADADA",
//         "minorGridEnabled": true,
// 	}
// };

/////////////////////////////// Graph Data Processing Functions ///////////////////////////////
//
// public function graphDataJoinDates($members)
// {
//     $joinDatesDict = [];
//     $start = Member::orderBy('created_at')->first()->created_at;
//     $end = Carbon::now()->modify('+1 day');
//     for ($i = $start; $i < $end; $i->modify('+1 day')) {
//         $joinDatesDict[$i->toDateString()] = 0;
//     }
//     foreach ($members as $member) {
//         $dateString = $member->created_at->toDateString();
//         $joinDatesDict[$dateString]++;
//     }
//     $joinDates = [];
//     foreach ($joinDatesDict as $date=>$count) {
//         array_push($joinDates, compact('date', 'count'));
//     }
//
//     return $joinDates;
// }
//
// public function graphDataLoginDates($members)
// {
//     $loginDatesDict = [];
//     $start = Member::orderBy('created_at')->first()->created_at;
//     $end = Carbon::now()->modify('+1 day');
//     for ($i = $start; $i < $end; $i->modify('+1 day')) {
//         $loginDatesDict[$i->toDateString()] = 0;
//     }
//     foreach ($members as $member) {
//         $dateString = $member->authenticated_at->toDateString();
//         if ($member->authenticated_at->year > 0) {
//             $loginDatesDict[$dateString]++;
//         }
//     }
//     $loginDates = [];
//     foreach ($loginDatesDict as $date=>$count) {
//         array_push($loginDates, compact('date', 'count'));
//     }
//
//     return $loginDates;
// }
//
// public function graphDataEventAttendance($members)
// {
//     // Set to Correct Date Range
//     $datesDict = [];
//     $start = Member::orderBy('created_at')->first()->created_at;
//     $datesDict[$start->toDateString()] = 0;
//     $end = Carbon::now()->modify('+1 day');
//     $datesDict[$end->toDateString()] = 0;
//
//     // Sum Public Event Attendance
//     foreach ($members as $member) {
//         $events = $member->events()->where('privateEvent', false)->get();
//         foreach ($events as $event) {
//             $dateString = $event->event_time->toDateString();
//             $datesDict[$dateString] = isset($datesDict[$dateString]) ? $datesDict[$dateString] + 1 : 1;
//         }
//     }
//
//     // Sort and Format Data
//     ksort($datesDict);
//     $datesFormated = [];
//     foreach ($datesDict as $date=>$count) {
//         array_push($datesFormated, compact('date', 'count'));
//     }
//
//     return $datesFormated;
// }
//
// public function graphDataNumAttended($members)
// {
//     $numAttendedDict = [];
//     foreach ($members as $member) {
//         $numAttended = $member->publicEventCount();
//         $numAttendedDict[$numAttended] = isset($numAttendedDict[$numAttended]) ? $numAttendedDict[$numAttended] + 1 : 1;
//     }
//     $numAttended = [];
//     ksort($numAttendedDict);
//     foreach ($numAttendedDict as $key=>$count) {
//         array_push($numAttended, compact('key', 'count'));
//     }
//
//     return $numAttended;
// }
//
// public function graphDataMemberYears($members)
// {
//     $memberYearsDict = [];
//     foreach ($members as $member) {
//         $memberYear = $member->graduation_year;
//         $memberYearsDict[$memberYear] = isset($memberYearsDict[$memberYear]) ? $memberYearsDict[$memberYear] + 1 : 1;
//     }
//     $memberYears = [];
//     ksort($memberYearsDict);
//     foreach ($memberYearsDict as $key=>$count) {
//         array_push($memberYears, compact('key', 'count'));
//     }
//
//     return $memberYears;
// }
//
// public function graphDataMajor($members)
// {
//     $majors = Major::all();
//     $majorsDict = [];
//     foreach ($majors as $major) {
//         $majorsDict[$major->name] = 0;
//     }
//     foreach ($members as $member) {
//         if (isset($member->major)) {
//             $majorsDict[$member->major->name]++;
//         }
//     }
//     $majorsData = [];
//     foreach ($majorsDict as $key=>$count) {
//         $key = preg_replace('~\b(\w)|.~', '$1', $key); // Create 2 Character Abbreviateion
//         array_push($majorsData, compact('key', 'count'));
//     }
//
//     return $majorsData;
// }
//
