import { ObjectId } from 'mongodb';
import { Event } from '../models/event';
import CONFIG from '../config';
const axios = require('axios');
// import { successRes } from 'index';

const accessToken = CONFIG.FACEBOOK_ACCESS_TOKEN;
export const syncFacebookEvents = async () => {
	//Get all upcoming facebook events id's
	try {
		const response = await axios.get(
			`https://graph.facebook.com/purduehackers/events?time_filter=upcoming&access_token=${accessToken}`
		);

		let upcomingEvents = response.data.data;
		for (var i = 0; i < upcomingEvents.length; i++) {
			let currEventId = upcomingEvents[i].id;
			const dbResponse = await Event.findOne({
				facebook: `https://www.facebook.com/events/${currEventId}/`
			});

			if (!dbResponse) {
				//Create db event
				//making event
				const event = new Event({
					name: upcomingEvents[i].name,
					location: upcomingEvents[i].place.name,
					privateEvent: 0,
					eventTime: upcomingEvents[i].start_time,
					facebook: `https://www.facebook.com/events/${currEventId}/`
				});

				await event.save();
				console.log('Saved succesfully');
			}
		}
	} catch (error) {
		console.log(error);
	}
};
