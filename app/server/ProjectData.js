Meteor.startup(function () {
    function leagueImport(id, openligadb) {

        Competitions.upsert({
            name: id
        }, {
            name: id,
            image: "/images/competitions/" + id + ".png",
            started: true,
            openligadb: openligadb
        });
        console.log("Successfully updated league : " + id);
    }


    // WORLD CUPS
    leagueImport("wc2014", {
        id: 676,
        shortcut: "WM-2014",
        saison: 2014,
        resultTypeId: 3
    });


    // BUNDESLIGA
    leagueImport("buli2013", {
        id: 623,
        shortcut: "bl1",
        saison: 2013,
        resultTypeId: 2
    });

    leagueImport("buli2014", {
        id: 720,
        shortcut: "bl1",
        saison: 2014,
        resultTypeId: 2
    });

    leagueImport("2ndbuli2014", {
        id: 721,
        shortcut: "bl2",
        saison: 2014,
        resultTypeId: 2
    });

    // PREMIER LEAGUE
    leagueImport("pl2014", {
        id: 744,
        shortcut: "PL",
        saison: 2014,
        resultTypeId: 2
    });


    // CHAMPIONS LEAGUE
    leagueImport("cl2013", {
        id: 651,
        shortcut: "cl",
        saison: 2013,
        resultTypeId: 4
    });

    leagueImport("cl2014", {
        id: 769,
        shortcut: "cls",
        saison: 2014,
        resultTypeId: 4
    });
});