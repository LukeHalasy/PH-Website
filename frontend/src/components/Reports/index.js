import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { MemberTable, Header } from '../Common';
import routes, { hasPermission } from '../../constants';
import { fetchMembers } from '../../actions';

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
			loading: true
		};
	}

	componentDidMount = async () => {
		const { members } = await fetchMembers({});
		console.log('ReportsPage fetched members:', members);
		this.setState({ members, loading: false });
	};

	render() {
		const { members, loading } = this.state;
		const { user } = this.props;
		return (
			<div className="section">
				<div className="section-container">
					<Header message="Reports" />
					<h2>Please work please</h2>
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
