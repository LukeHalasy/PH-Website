import React, { Component } from 'react';

class CalendarPage extends Component {
	render() {
		return (
			<div className="section">
				<div className="section-container">
					<h1>Calendar</h1>
					<br />
					<iframe
						title="Purdue Hackers Calender"
						src="https://calendar.google.com/calendar/embed?showTitle=0&amp;showPrint=0&amp;height=600&amp;wkst=1&amp;bgcolor=%23ffff99&amp;src=purduehackers%40gmail.com&amp;color=%23875509&amp;ctz=America%2FNew_York"
						style={{ borderWidth: 0 }}
						width="800"
						height="600"
						frameBorder="0"
						scrolling="no"
					/>
				</div>
			</div>
		);
	}
}

export default CalendarPage;
