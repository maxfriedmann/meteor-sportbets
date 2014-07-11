var assert = require("assert");

// mocks
Bet = function(home, away)
{
	this.homegoals = home;
	this.awaygoals = away;
};

// includes
require("../../../app/js/03_services/BetService.js");

describe('BetService', function()
{
	describe('isBetable', function()
	{
		it('should return false for an object', function()
		{
			assert.equal(BetService.isBetable("test"), false);
		});
		
		it('should return false for undefined', function()
		{
			assert.equal(BetService.isBetable(), false);
		});
		
		it('should return true for a bet', function()
		{
			assert.equal(BetService.isBetable(new Bet({})), true);
		});
	});
	
	describe('getPoints for 1:2 match without multiplier', function()
	{
		var matchdata = {
			"points_team1" : 1,
			"points_team2" : 2,
			"multiplier" : 1
		};
		
		it('no matchdata should return undefined', function()
		{
			assert.equal(BetService.getPoints(new Bet(1, 0)), undefined);
		});
		
		it('1:0 bet should return 0 points', function()
		{
			assert.equal(BetService.getPoints(new Bet(1, 0), matchdata), 0);
		});
		
		it('1:1 bet should return 0 points', function()
		{
			assert.equal(BetService.getPoints(new Bet(1, 1), matchdata), 0);
		});
		
		it('1:4 bet should return 1 point', function()
		{
			assert.equal(BetService.getPoints(new Bet(1, 4), matchdata), 1);
		});
		
		it('2:3 bet should return 2 points', function()
		{
			assert.equal(BetService.getPoints(new Bet(2, 3), matchdata), 2);
		});
		
		it('1:2 bet should return 3 points', function()
		{
			assert.equal(BetService.getPoints(new Bet(1, 2), matchdata), 3);
		});
	});
	
	describe('getPoints for 1:2 match with multiplier 2', function()
	{
		var matchdata = {
			"points_team1" : 1,
			"points_team2" : 2,
			"multiplier" : 2
		};
		
		it('no matchdata should return undefined', function()
		{
			assert.equal(BetService.getPoints(new Bet(1, 0)), undefined);
		});
		
		it('1:0 bet should return 0 points', function()
		{
			assert.equal(BetService.getPoints(new Bet(1, 0), matchdata), 0);
		});
		
		it('1:1 bet should return 0 points', function()
		{
			assert.equal(BetService.getPoints(new Bet(1, 1), matchdata), 0);
		});
		
		it('1:4 bet should return 2 point', function()
		{
			assert.equal(BetService.getPoints(new Bet(1, 4), matchdata), 2);
		});
		
		it('2:3 bet should return 4 points', function()
		{
			assert.equal(BetService.getPoints(new Bet(2, 3), matchdata), 4);
		});
		
		it('1:2 bet should return 6 points', function()
		{
			assert.equal(BetService.getPoints(new Bet(1, 2), matchdata), 6);
		});
	});
});
