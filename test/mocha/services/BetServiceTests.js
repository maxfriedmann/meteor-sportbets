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
	
	describe('getPoints for 1:2 match with multiplier 1', function()
	{
		var matchdata = {
			"points_team1" : 1,
			"points_team2" : 2,
			"multiplier" : 1
		};
		
		it('should return undefined for no parameters ', function()
		{
			assert.equal(BetService.getPoints(), undefined);
		});
		
		it('should return undefined for no matchdata ', function()
			{
			assert.equal(BetService.getPoints(new Bet(1, 0)), undefined);
			});
		
		it('should return 0 points for 1:0 bet', function()
		{
			assert.equal(BetService.getPoints(new Bet(1, 0), matchdata), 0);
		});
		
		it('should return 0 points for 1:1 bet', function()
		{
			assert.equal(BetService.getPoints(new Bet(1, 1), matchdata), 0);
		});
		
		it('should return 1 point for 1:4 bet', function()
		{
			assert.equal(BetService.getPoints(new Bet(1, 4), matchdata), 1);
		});
		
		it('should return 2 points for 2:3 bet', function()
		{
			assert.equal(BetService.getPoints(new Bet(2, 3), matchdata), 2);
		});
		
		it('should return 3 points for 1:2 bet', function()
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
		
		it('should return 0 points for 1:0 bet', function()
		{
			assert.equal(BetService.getPoints(new Bet(1, 0), matchdata), 0);
		});
		
		it('should return 0 points for 1:1 bet', function()
		{
			assert.equal(BetService.getPoints(new Bet(1, 1), matchdata), 0);
		});
		
		it('should return 2 points for 1:4 bet', function()
		{
			assert.equal(BetService.getPoints(new Bet(1, 4), matchdata), 2);
		});
		
		it('should return 4 points for 2:3 bet', function()
		{
			assert.equal(BetService.getPoints(new Bet(2, 3), matchdata), 4);
		});
		
		it('should return 6 points for 1:2 bet', function()
		{
			assert.equal(BetService.getPoints(new Bet(1, 2), matchdata), 6);
		});
	});
});
