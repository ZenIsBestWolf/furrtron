//Documentation done by ZenIsBestWolf. (The developer.)
//Imports
const Discord = require('discord.js');
const client = new Discord.Client({disableEveryone: true});
const roleList = require("./roles.json");
const commandList = require("./commandlist.json")
var token = process.env.TOKEN
var errorCount = 0
//Startup
client.on('ready', () => {
	console.log('Online and ready to go! Bot running with prefix ' + prefix);
	client.user.setActivity('RESTARTED! THIS WILL CLEAR!').then(e => setTimeout(function() {
		client.user.setActivity('being fuzzy. | 0 errors have occurred.')
	}, 10000));
});
process.on('unhandledRejection', error => {
	console.log(error.stack)
	errorCount++
	client.user.setActivity('UHR OCCURRED CHECK LOGS').then(e => setTimeout(function() {
		client.user.setActivity('being fuzzy. | ' + errorCount + ' errors have occurred.');
	}, 10000));
});
//Variables
var prefix = ".";
var zen = "183672121522782208";
client.on('message', message => {
	if (!message.content.startsWith(prefix)) return;
	if (message.author.bot) return;
	var args = message.content.substring(prefix.length).split(" ");
	var command = commandList[args[0].toLowerCase()];
	//Check if the command exists.
	if (command === undefined) return;
	var userPermLevel = 0
	if (message.channel.type === "text") {
		if (message.member.roles.exists("name", "Staff")) userPermLevel = 1
		if (message.member.roles.exists("name", "Mayor") || message.member.roles.exists("name", "Co-Mayor")) userPermLevel = 2
	};
	if (message.author.id === zen) userPermLevel = 3
	if (message.channel.id === "424197586879250444" && !message.author.id === zen) {
		message.reply("Bot commands are disabled here.").then(e => setTimeout(function() {
			e.delete();
			message.delete();
		}, 10000));
		return;
	};
	switch (args[0].toLowerCase()) {
		case "8ball":
			var ballResponses = ["Yes", "No", "Maybe", "I\'m not sure.", "I\'m sure.", "Probably.", "Probably not.", "Absolutely.", "Absolutely not.", "No way."]
			message.reply("**:8ball: says...** " + ballResponses[Math.floor(Math.random() * ballResponses.length)]);
			break;
		case "about":
			var aboutBotEmbed = new Discord.RichEmbed().setTitle("About Furrtron").setDescription("A bot for Furrmont.").addField("Prefix", "The prefix is ``" + prefix + "``.").addField("Number of Commands", "There are ``" + Object.values(commandList).length + "`` commands.").addField("Developer", "The developer is ZenIsBestWolf#0446.").addField("GitHub", "Want to contribute to Furrtron or see its code? Head here: https://github.com/ZenIsBestWolf/furrtron.").setColor(0x876021)
			message.channel.send(aboutBotEmbed)
			break;
		case "chat":
			if (userPermLevel > 1 && !message.member.id === "80818394315624448") {
				message.reply("You cannot use this command! This command is Level 2. You are Level " + userPermLevel + ".").then(e => setTimeout(function() {
					if (message.channel.type === "text") {
						e.delete();
						message.delete();
					};
				}, 10000));
				return;
			};
			var msg = args.join(' ').slice(args[0].length)
			message.channel.send(msg);
			if (message.channel.type === "text") message.delete();
			break;
		case "help":
			if (args[1]) {
				var lookupCommand = commandList[args[1].toLowerCase()]
				if (lookupCommand === undefined) {
					message.reply("No such command exists.").then(e => setTimeout(function() {
						if (message.channel.type === "text") {
							e.delete();
							message.delete();
						};
					}, 10000));
					return;
				};
				var permissionName = ""
				if (lookupCommand.permission === 0) permissionName = "Everyone"
				if (lookupCommand.permission === 1) permissionName = "Staff"
				if (lookupCommand.permission === 2) permissionName = "Mayors"
				if (lookupCommand.permission === 3) permissionName = "Zen"
				var usageEmbed = new Discord.RichEmbed().setTitle('Information on command ``' + prefix + args[1].toLowerCase() + '``.').addField('Name', args[1].toLowerCase()).addField('Description', lookupCommand.description).addField('Usage', lookupCommand.usage).addField('Permission Level', permissionName)
				message.author.send(usageEmbed)
				if (message.channel.type === "text") message.delete();
				return;
			}
			//This automated help system was developed by RadioactiveHydra for my Maddie bot. https://github.com/RadioactiveHydra
			var helpMessages = 0
			for (i = 0; Object.keys(commandList).length > i; i++) {
				if (Object.values(commandList)[i].permission == 0) {
					helpMessages++
				}
			}
			var helpPages = Math.ceil(helpMessages / 25)
			var currentHelpPage = 1
			var tempHelpNum = 0
			var helpEmbed = []
			for (i = 0; helpPages > i; i++) {
				helpEmbed[i + 1] = new Discord.RichEmbed().setTitle('Command List (' + (i + 1) + '/' + helpPages + ')').setDescription('These commands are able to be used by everyone!').setColor(0x876021)
			};
			for (i = 0; Object.keys(commandList).length > i; i++) {
				if (Object.values(commandList)[i].permission == 0 && tempHelpNum < 25) {
					helpEmbed[currentHelpPage].addField(prefix + Object.keys(commandList)[i], Object.values(commandList)[i].description)
					tempHelpNum++
				} else if (Object.values(commandList)[i].permission == 0 && tempHelpNum >= 24) {
					currentHelpPage++
					helpEmbed[currentHelpPage].addField(prefix + Object.keys(commandList)[i], Object.values(commandList)[i].description)
					tempHelpNum = 1
				};
			};
			for (i = 0; i < helpPages; i++) {
				message.author.send(helpEmbed[i + 1])
			};
			message.delete();
			break;
		case "override":
			if (userPermLevel < 3) {
				message.reply("You cannot use this command! This command is Level 3. You are level " + userPermLevel + ".").then(e => setTimeout(function() {
					if (message.channel.type === "text") {
						e.delete();
						message.delete();
					};
				}, 10000));
				return;
			};
			switch (args[1].toLowerCase()) {
				case "selfaddrole":
					var selfCalledAddRole = args.join(' ').slice(args[0].length + args[1].length + 2)
					message.member.addRole(message.member.guild.roles.find("name", selfCalledAddRole)).catch(err => {
						console.log("An error occcured. This is likely from the role not existing, me not having permission to add roles, the role is above me, or already having the role.")
					});
					break;
				case "selfremoverole":
					var selfCalledRemoveRole = args.join(' ').slice(args[0].length + args[1].length + 2)
					message.member.removeRole(message.member.guild.roles.find("name", selfCalledRemoveRole)).catch(err => {
						console.log("An error occcured. This is likely from the role not existing, me not having permission to add roles, the role is above me, or already having the role.")
					})
					break;
			};
			message.delete();
			break;
		case "role":
			if (message.channel.type !== "text") {
				message.reply("This command is not valid in DMs.")
				return;
			};
			if (args[1] === undefined) {
				message.reply("No role provided!").then(e => setTimeout(function() {
					e.delete();
					message.delete();
				}, 10000));
				return;
			};
			var calledRole = roleList[args[1].toLowerCase()]
			if (args[1].toLowerCase() === "multiple" && args[2]) {
				if (args[2].toLowerCase() === "sonas") calledRole = roleList["multiple sonas"]
			};
			if (args[1].toLowerCase() === "not" && args[2]) {
				if (args[2].toLowerCase() === "interested") calledRole = roleList["not interested"]
			};
			if (args[1].toLowerCase() === "original" && args[2]) {
				if (args[2].toLowerCase() === "species") calledRole = roleList["original species"]
			};
			if (args[1].toLowerCase() === "rocket" && args[2]) {
				if (args[2].toLowerCase() === "league") calledRole = roleList["rocket league"]
			};
			if (args[1].toLowerCase() === "pc" && args[2]) {
				if (args[2].toLowerCase() === "gamer") calledRole = roleList["pc gamer"]
			};
			if (args[1].toLowerCase() === "nintendo" && args[2]) {
				if (args[2].toLowerCase() === "switch") calledRole = roleList["nintendo switch"]
			};
			if (args[1].toLowerCase() === "other" && args[2]) {
				if (args[2].toLowerCase() === "console") calledRole = roleList["other console"]
			};
			if (args[1].toLowerCase() === "dark" && args[2]) {
				if (args[2].toLowerCase() === "blue") calledRole = roleList["dark blue"]
			};
			if (args[1].toLowerCase() === "grand" && args[2]) {
				if (args[2].toLowerCase() === "theft" && args[3]) {
					if (args[3].toLowerCase() == "auto") calledRole = roleList["gta"]
				};
			};
			if (args[1].toLowerCase() === "league" && args[2]) {
				if (args[2].toLowerCase() === "of" && args[3]) {
					if (args[3].toLowerCase() == "legends") calledRole = roleList["lol"]
				};
			};
			if (args[1].toLowerCase() === "call" && args[2]) {
				if (args[2].toLowerCase() === "of" && args[3]) {
					if (args[3].toLowerCase() == "duty") calledRole = roleList["cod"]
				};
			};
			if (calledRole === "ow") calledRole = "overwatch";
			if (calledRole === "ps") calledRole = "playstation";
			if (calledRole === "grey") calledRole = "gray";
			if (calledRole === undefined) {
				message.reply("There is no existing assignable role under that name.").then(e => setTimeout(function() {
					e.delete();
					message.delete();
				}, 10000));
				return;
			};
			if (args[2] && userPermLevel > 0) {
				if (message.mentions.members.first()) {
					if (!message.mentions.members.first().roles.exists("name", calledRole.displayname)) {
						message.mentions.members.first().addRole(message.member.guild.roles.find("name", calledRole.displayname))
						message.reply(":white_check_mark: Role added to " + message.mentions.members.first() + "!").then(e => setTimeout(function() {
							e.delete();
							message.delete();
						}, 10000));
						return;
					} else if (message.mentions.members.first().roles.exists("name", calledRole.displayname)) {
						message.mentions.members.first().removeRole(message.member.guild.roles.find("name", calledRole.displayname))
						message.reply(":white_check_mark: Role removed from " + message.mentions.members.first() + "!").then(e => setTimeout(function() {
							e.delete();
							message.delete();
						}, 10000));
						return;
					};
				} else {
					if (args[1].toLowerCase() !== "multiple" && args[1].toLowerCase() !== "original" && args[1].toLowerCase() !== "not") {
						message.reply("Error, no mentioned user found.").then(e => setTimeout(function() {
							e.delete();
							message.delete();
						}, 10000));
						return;
					};
				};
			};
			if (!message.member.roles.exists("name", calledRole.displayname)) {
				message.member.addRole(message.member.guild.roles.find("name", calledRole.displayname))
				message.reply(":white_check_mark: Role added!").then(e => setTimeout(function() {
					e.delete();
					message.delete();
				}, 10000));
				return;
			} else if (message.member.roles.exists("name", calledRole.displayname)) {
				message.member.removeRole(message.member.guild.roles.find("name", calledRole.displayname))
				message.reply(":white_check_mark: Role removed!").then(e => setTimeout(function() {
					e.delete();
					message.delete();
				}, 10000));
				return;
			};
			break;
		case "rolelist":
			//This automated system was developed by RadioactiveHydra for my Maddie bot. I modified it to fit the need for roles. https://github.com/RadioactiveHydra
			var roleMessages = 0
			for (i = 0; Object.keys(roleList).length > i; i++) {
				roleMessages++
			}
			var rolePages = Math.ceil(roleMessages / 25)
			var currentRolePage = 1
			var tempRoleNum = 0
			var roleEmbed = []
			for (i = 0; rolePages > i; i++) {
				roleEmbed[i + 1] = new Discord.RichEmbed().setTitle('Role List (' + (i + 1) + '/' + rolePages + ')').setDescription('These are all the assignable roles.').setColor(0x876021)
			};
			for (i = 0; Object.keys(roleList).length > i; i++) {
				if (Object.values(roleList)[i] && tempRoleNum < 25) {
					roleEmbed[currentRolePage].addField(Object.values(roleList)[i].displayname, Object.values(roleList)[i].description)
					tempRoleNum++
				} else if (Object.values(roleList)[i] && tempRoleNum >= 24) {
					currentRolePage++
					roleEmbed[currentRolePage].addField(Object.values(roleList)[i].displayname, Object.values(roleList)[i].description)
					tempRoleNum = 1
				};
			};
			for (i = 0; i < rolePages; i++) {
				if (message.channel.id === "445660928521011201") {
					message.channel.send(roleEmbed[i + 1])
				} else {
					message.author.send(roleEmbed[i + 1])
				};
			};
			if (message.channel.type === "text") message.delete();
			break;
		case "wipe":
			if (userPermLevel < 1) {
				message.reply("You cannot use this command! This command is level 1. You are level 0.").then(e => setTimeout(function() {
					if (message.channel.type === "text") {
						e.delete();
					};
				}, 10000));
				return;
			};
			if (message.channel.id != "495030535626686489") {
				message.reply("That command is only available in <#495030535626686489>.").then(e => setTimeout(function() {
					if (message.channel.type === "text") {
						e.delete();
					};
				}, 10000));
			};
			message.channel.fetchMessages({
				after: "495387422524440605"
			}).then(messages => {
				var runCount = Math.ceil(messages.size/100)
				for (i = 0; runCount > i; i++) {
					message.channel.bulkDelete(messages)
				}
			});
			break;
	};
});
//Login to Discord.
client.login(token);
