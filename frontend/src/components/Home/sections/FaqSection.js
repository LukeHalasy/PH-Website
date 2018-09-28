import React from 'react';
import './FaqSection.css';

export default () => (
	<React.Fragment>
		<div className=" faq section" style={{ textAlign: 'left' }}>
			<div className="section-container">
				<h1>FAQ</h1>
				<div className="faq-img" />
				<div className="content right">
					<h3>What is hacking?</h3>
					<p>
						You&#39;re probably thinking of movies where hackers steal secrets from the FBI.
						That&#39;s not what we&#39;re about. To us, hacking means using cutting edge
						technology to create kick-ass projects.
					</p>
					<h3>
						I missed the callout!
						<br />
						Can I still join?
					</h3>
					<p>
						Absolutely! You can find all of our events in the Purdue Hackers
						<a
							href="https://www.facebook.com/groups/purduehackers/"
							rel="noopener noreferrer"
							target="_blank"
						>
							facebook group
						</a>
						. No prior knowledge or experience is needed, so come say hi!
					</p>
					<h3>What if I can&#39;t code?</h3>
					<p>
						No problem! As long as you&#39;re passionate about how technology can shape the
						future, you&#39;ll fit right in. We offer lots of events to help teach coding
						skills, including a semester-long coding bootcamp called Ignite.
					</p>
					<h3>What&#39;s up with the logo?</h3>
					<p>
						It&#39;s a glider from Conway&#39;s Game of Life. It&#39;s a universal symbol for
						hacking and was chosen because it&#39;s the only pattern in the game that can
						spread life to new areas.
					</p>
				</div>
			</div>
		</div>
	</React.Fragment>
);
