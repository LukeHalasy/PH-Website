import React from 'react';

import SponsorSection from './sections/SponsorSection';
import FaqSection from './sections/FaqSection';
import './index.css';
import '../Common/AboutSection.css';
import '../Common/EventSection.css';

export default () => (
	<React.Fragment>
		<div className="section about">
			<div className="section-container">
				<h1>Who Are We?</h1>
				<h3>
					We are a community of students who collaborate, learn, and build kick-ass technical
					projects.
				</h3>
				<div className="about-img" />
				<a href="//eepurl.com/MpyV1">
					<button className="buttn mailing-list">Join Our Mailing List!</button>
				</a>
			</div>
		</div>

		<div className="section events" style={{ textAlign: 'left' }}>
			<div className="section-container">
				<h1>What We Do</h1>
				<div className="content left">
					<h3>Hackathons</h3>
					<p>
						Hackathons are 36 hour coding competitions and the fastest way to build the
						project of your dreams. We send buses to hackathons across the country almost
						every week. While you're hacking, you can get to know representatives from
						companies like Google, Facebook, Microsoft, and more! Plus, every hackathon is
						filled to the brim with free food and free swag.
					</p>
					<h3>Social Events</h3>
					<p>
						Every few weeks Purdue Hackers hosts events where people hang out, work on
						projects, share ideas, and learn about cool new technologies. We strive to create
						an environment where it's easy to meet some of the students at the forefront of
						innovation at Purdue. We also invite speakers from cutting edge companies in the
						industry to share their experience with us.
					</p>
				</div>
				<div className="event-img" />
			</div>
		</div>
		<FaqSection />
		<SponsorSection />
	</React.Fragment>
);
