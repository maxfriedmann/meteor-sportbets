Meteor
		.methods({
			setupTestData : function(t) {
				if (Meteor.settings && Meteor.settings.developerMode == true) {

					// create test league
					Competitions.upsert({
						"name" : "testleague"
					}, {
						"name" : "testleague",
						"image" : "images/soccer.png",
						"groups" : [ {
							"group_id" : 1,
							"group_order_id" : 1,
							"group_name" : "1. Spieltag"
						}, {
							"group_id" : 2,
							"group_order_id" : 2,
							"group_name" : "2. Spieltag"
						} ]
					});
					var testLeague = Competitions.findOne({
						"name" : "testleague"
					});

					if (testLeague == undefined) {
						throw new Meteor.Error(501,
								"Could not create test league!");
					}

					// create test matches
					Matches.upsert({
						match_id : "-111",
						competitionId : testLeague._id
					}, {
						match_id : "-111",
						competitionId : testLeague._id,
						name_team1 : "Test Team A",
						name_team2 : "Test Team B",
						id_team1 : "761",
						id_team2 : "2670",
						group_id : "1",
						group_name : "1. Spieltag",
						points_team1 : "3",
						points_team2 : "1",
						match_is_finished : true,
						match_date_time_utc : "2012-08-31T19:00:00+00:00"
					});
					Matches.upsert({
						match_id : "-110",
						competitionId : testLeague._id
					}, {
						match_id : "-110",
						competitionId : testLeague._id,
						name_team1 : "Test Team B",
						name_team2 : "Test Team A",
						id_team1 : "2670",
						id_team2 : "761",
						group_id : "2",
						group_name : "2. Spieltag",
						points_team1 : "-1",
						points_team2 : "-1",
						match_is_finished : false,
						match_date_time_utc : "2018-08-31T19:00:00+00:00"
					});

					// create test player
					Meteor.users
							.upsert(
									{
										"nickname" : "test@test.com"
									},
									{
										"_id" : "b88tNdHu2nzuJzv6p",
										"administrator" : false,
										"createdAt" : new Date(
												"01.01.2014 19:00:00"),
										"emails" : [ {
											"address" : "test@test.com",
											"verified" : true
										} ],
										"language" : "en",
										"nickname" : "test@test.com",
										"profile" : {
											"online" : true,
											"picture" : "/images/avatars/contractor_128.png"
										},
										"services" : {
											"email" : {
												"verificationTokens" : [ {
													"token" : "9xY3DydJlyN2nWxkgHvzWVUFmBy5YPk7BgtMQwmlKHw",
													"address" : "test@test.com",
													"when" : new Date(
															"01.01.2014 19:00:00")
												} ]
											},
											"password" : {
												"srp" : {
													"identity" : "Mpgu5fBoZ9XagbVNSCpVGunj1Ds-BEpE02R_niP8OsH",
													"salt" : "l-jAVTxCHT5KeStyAwAmRGEM37_PELZ5RRho4RqRIY0",
													"verifier" : "86f48d3bbf44cb6bca50b5a40fc144d9c2f2d1b99b1497bf2468c508a9b0b245ebc74ab8eddfe81cf1b84b8424c7eaf67f85e5bafee64ed89749b3e49576b6d7c423f9caa046d8b081ce253958ad8c981cb1519a57f6e057eebff4f782b4259c1d1a30763c90ac7f8774dc5ebd8cbfa599f95150fcc77e6e5d7b2ab7164376e8"
												}
											}
										}
									});

					// delete all bets
					Bets.remove({
						competitionId : testLeague._id
					});

					return "TEST_DATA_CREATED";
				}
				throw new Meteor.Error(401, "You're not in the developer mode!");
			}
		});
