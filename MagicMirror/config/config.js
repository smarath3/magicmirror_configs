/* Custom Config 
 *
 * For more information on how you can configure this file
 * see https://docs.magicmirror.builders/configuration/introduction.html
 * and https://docs.magicmirror.builders/modules/configuration.html
 *
 * You can use environment variables using a `config.js.template` file instead of `config.js`
 * which will be converted to `config.js` while starting. For more information
 * see https://docs.magicmirror.builders/configuration/introduction.html#enviromnent-variables
 */
let config = {
	address: "localhost",	// Address to listen on, can be:
							// - "localhost", "127.0.0.1", "::1" to listen on loopback interface
							// - another specific IPv4/6 to listen on a specific interface
							// - "0.0.0.0", "::" to listen on any interface
							// Default, when address config is left out or empty, is "localhost"
	port: 8080,
	basePath: "/",	// The URL path where MagicMirror² is hosted. If you are using a Reverse proxy
									// you must set the sub path here. basePath must end with a /
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"], // Set [] to allow all IP addresses
									// or add a specific IPv4 of 192.168.1.5 :
									// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
									// or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
									// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

	useHttps: false,	// Support HTTPS or not, default "false" will use HTTP
	httpsPrivateKey: "",	// HTTPS private key path, only require when useHttps is true
	httpsCertificate: "",	// HTTPS Certificate path, only require when useHttps is true
	debug: true,
	language: "en",
	locale: "en-US",
	logLevel: ["INFO", "LOG", "WARN", "ERROR"], // Add "DEBUG" for even more logging
    timeFormat: 24,
	units: "metric",

	modules: [
	
		/* Common modules before we get to the calendar */
		
		/* Show Clock on all Scenes */
		{
			module: "clock",
			position: "top_left",
                        timeFormat: 12,
			timezone: "America/Los_Angeles",
		},

		/* Show wallpaper on all Scenes */	
		{
			module: "MMM-Wallpaper",
			position: "fullscreen_below",
			config: { // See "Configuration options" for more information.
				source: "chromecast",	//"bing",
				slideInterval: 60 * 1000, // Change slides every minute
				filter: "grayscale(0.75) brightness(0.25)" // contrast(0.75)" //"grayscale(0.1)" //"brightness(0.1)"
				}
		},
		
		/* Show Newsfeed on Bottom - MAYBE ONLY 1ST SCENE */	
		{
			module: "newsfeed",
			position: "bottom_bar",
			hiddenOnStartup: true,
			classes: "FAMILY_ROLE",			
			config: {
				feeds: [
					{
							title: "New York Times",
							url: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
							ignoreOlderThan: 604800000, //so it should now ignore anything older than 7 days (in ms)
					},
					{
							title: "BBC World",
							url: "https://feeds.bbci.co.uk/news/rss.xml?edition=int",  //url: "http://feeds.bbci.co.uk/news/world/rss.xml",
							ignoreOlderThan: 604800000, //so it should now ignore anything older than 7 days (in ms)

					},
				],
				showSourceTitle: true,
				showPublishDate: true,
				broadcastNewsFeeds: true,
				broadcastNewsUpdates: true
			}
		},

		/* Show Weather forecast - ONLY 1ST SCENE */
		{
			module: "MMM-OpenWeatherMapForecast",
			header: "Forecast",
			position: "top_center",
			hiddenOnStartup: true,
			classes: "FAMILY_ROLE", 
			disabled: false,
			config: {
				apikey: "<add_your_api_key>", //only string here
				latitude: "37.368832",            //number works here
				longitude: "-122.036346",          //so does a string
				showCurrentConditions: true,
				showExtraCurrentConditions: true,
				showSummary: false,
				showPrecipitation: true,
				showWind: false,
				maxHourliesToShow: 6,
				maxDailiesToShow: 4,
				iconset: "4c",
				concise: true,
				units: "imperial",
				forecastLayout: "table",
			}
		},

		/* For other scenes */
		{
			module: "MMM-OpenWeatherMapForecast",
			header: "Forecast",
			position: "top_center",
			hiddenOnStartup: true,
			classes: "SPOUSE_ROLE", 
			disabled: false,
			config: {
				apikey: "<add_your_api_key>", //only string here
				latitude: "37.368832",            //number works here
				longitude: "-122.036346",          //so does a string
				showSummary: false,
				showPrecipitation: false,
				showWind: false,
				maxHourliesToShow: 0,
				maxDailiesToShow: 0,
				iconset: "4c",
				concise: true,
				units: "imperial",
				forecastLayout: "table",
				layout: "horizontal",
			}
		},

		
		/* Initialize all calendars */
		
		// 1. US Holidays
		{
			module: "calendar",
			header: "Upcoming US Holidays",
            name: "us_holiday",
			position: "top_left",
			hiddenOnStartup: true,
			classes: "FAMILY_ROLE", 
			config: {
				calendars: [
					{
						fetchInterval: 7 * 24 * 60 * 60 * 1000,
						symbol: "calendar-check",
                        maximumEntries: 3,
                        name: "calusholiday",
						url: "https://ics.calendarlabs.com/76/mm3137/US_Holidays.ics"
					}
				]
			}
		}, 

		/* Show Todoist - ONLY 1ST SCENE but below Events - US Holidays */
		{
			module: 'MMM-Todoist',
			position: 'top_left', // This can be any of the regions. Best results in left or right regions.
			header: 'Todo List', // This is optional
			classes: "FAMILY_ROLE",
			hiddenOnStartup: true,
			config: { // See 'Configuration options' for more information.
				hideWhenEmpty: true,
				accessToken: '<add_your_access_token>', /* API token from Dev setting */
				maximumEntries: 60,
				updateInterval: 1*60*1000, // Update every 1 minutes
				fade: false,
				projects: [ <your_project_id> ],
				labels: [ "MagicMirror", "Important" ], // Tasks for any projects with these labels will be shown.
				showProject: false
			}
		}, 

		// 2. Family Common Calendar - family_gmail@gmail.com - Has imp details like travel, events - birthday etc. etc.
		{
			module: "calendar",
			header: "",
			name: "Family",
			hiddenOnStartup: true,
			classes: "FAMILY_ROLE",
			config: {
				calendars: [
					{
						color: "gold",
						fetchInterval: 60 * 60 * 1000,
						symbol: "calendar-check",
						maximumEntries: 2,
						name: "calfamily",
						url: "<fam_calendar_ics_file>"
					}
				]
			}
		},

		
		// 3. Outschool  or can be other calendars other than your gmail
		{
				module: "calendar",
				header: "",
				name: "outschool",
				hiddenOnStartup: true,
				classes: "FAMILY_ROLE", 
				config: {
					calendars: [
						{
							color: "red",
							fetchInterval: 60000 * 60,
							symbol: "calendar-check",
							maximumEntries: 1,
							name: "caloutschool",
							url: "<outschool_ics>"
						}
					]
				}
		},

		//SPOUSE OFFICE CALENDAR
		{
			module: "calendar",
			header: "",
			hiddenOnStartup: true,
			classes: "SPOUSE_ROLE",
			config: {
				calendars: [
					{
						color: "gold",
						fetchInterval: 60000,
						symbol: "calendar-check",
						maximumEntries: 2,
						name: "calspouseofc",
						url: "<spouse_outlook_readonly_sharable_calendar.ics>"
					}
				]
			}
		},

		// FAMILY CALENDAR - Show as Agenda
		{
			module: "MMM-CalendarExt3Agenda",
			position: "top_right",
			hiddenOnStartup: true,
			classes: "FAMILY_ROLE",
			header: "My Agenda",
			config: {
				width: '100%',
				firstDayOfWeek: 1,
				startDayIndex: -1,
				endDayIndex: 8,
				calendarSet: ['calusholiday', 'caloutschool', 'calfamily'],
			}
		},

		//SPOUSE CALENDAR (can add other common calendars to the view) - Show as a journal
		{
			module: "MMM-CalendarExt3Journal",
			position: "middle_center",
			header: "FAMILY CALENDAR",
			hiddenOnStartup: true,
			classes: "SPOUSE_ROLE",        
			config: {
				height: '40vh',
				width: '100%',
				dayIndex:-1,
				days:7,
				staticTime: true,
				hourLength: 10,
				beginHour:  8,
				calendarSet: ['caloutschool', 'calspouseofc']
			}
		},
		
		
        // Finally create SCENES
		{
			module: "MMM-Scenes2",
			position: "bottom_bar",
			config: {
				life: 1000 * 5,
				defaultEnter: {
					animation: "fadeIn",
					duration: 1500,
					gap: 1000,
				},
				defaultExit: {
					animation: "fadeOut",
					duration: 1000,
					gap: 1000,
				},
				scenario: [
					//SCENE 1 - FAMILY
					{
						exit: ["SPOUSE_ROLE"],
						enter: ["FAMILY_ROLE"],
						life: 1000 * 10,
					},

					//SCENE 2 - SPOUSE	
					{
						exit: [ "FAMILY_ROLE"],
						enter: ["SPOUSE_ROLE"],
						life: 1000 * 5,
					},
					
				],
			}
		},


                
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") { module.exports = config; }
