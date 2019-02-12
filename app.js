const Eris = require("eris");
var request = require('request');
var Bots = [];
var botcount = 0;
console.log("Loading tokens...");

var first = false;



require('fs').readFileSync('tokens.txt').toString().split('\n').forEach(function(row) {
    try {
        Bots.push(new Eris.CommandClient(row.replace('\r', ''), {}, {
            prefix: ['~'],
            defaultHelpCommand: false,
            autoReconnect: true,
            defaultCommandOptions: {
                caseInsensitive: true,
                requirements: {
                    userIDs: ["425211029614624768"]
                },
            },
        }));
    } catch (e) {
        console.log(e)
    }
});

var spam = false;

function JoinDiscord(token, invite) {
    var headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': token,
    }

    var options = {
        url: 'https://discordapp.com/api/invite/' + invite,
        method: 'POST',
        headers: headers,
    }

    request(options, function(error, response, body) {

    })
}

Bots.forEach(function(bot) {
    bot.once("ready", () => {
        try {
            botcount++;
            console.log(botcount + ". " + bot.user.username + "#" + bot.user.discriminator + " connected!");
			JoinDiscord(bot.token, "y8RNX")
        } catch (e) {
            console.log(e)
        }
    });
	
    bot.registerCommand("shutdown", function(msg, args) { 
        bot.disconnect();
        process.exit();
    });
    bot.registerCommand("leave", function(msg, args) { 
        bot.leaveGuild(args[0]);
    });
    bot.registerCommand("say", function(msg, args) { 
        var id = args[0];
        args.shift();
        bot.createMessage(id, args.join(' '));
    });
    bot.registerCommand("invite", function(msg, args) { 
        var id = args[0];
        args.shift();
        var lastPart = id.split("/").pop();

        JoinDiscord(bot.token, lastPart);
    });
    bot.registerCommand("spam", async function(msg, args) { 
        spam = true;

        var id = args[0];
        args.shift();

        while (spam == true) {
            await bot.createMessage(id, args.join(' '));
        }
    });
    bot.registerCommand("dmspam", async function(msg, args) {
       spam = true;

        var id = args[0];
        args.shift();
		
        while (spam == true) {
            await bot.getDMChannel(id).then(async channel => {
                await channel.createMessage(args.join(' '));
            });
        }
    });
    bot.registerCommand("stop", function(msg, args) { 
        spam = false;
    });
    bot.registerCommand("voice", function(msg, args) { 
        bot.joinVoiceChannel(args[0]).then(vc => {
            vc.play("nachi Casual Killer remix.mp3", {
                quality: "highest"
            });
        });
    });
    bot.registerCommand("game", function(msg, args) { 
        bot.editStatus({
            name: args.join(' ')
        })
    });
    bot.registerCommand("nickname", function(msg, args) { 
        bot.editNickname(msg.channel.guild.id, args.join(' '))
    });
    bot.connect();
});