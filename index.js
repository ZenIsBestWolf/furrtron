//Documentation done by ZenIsBestWolf. (The developer.)
//Imports
const Discord = require('discord.js');
const client = new Discord.Client();
const roleList = require("./roles.json");
const commandList = require("./commandlist.json")
var token = process.env.TOKEN
//Startup
client.on('ready', () => {
  console.log('Online and ready to go! Bot running with prefix ' + prefix);
  client.user.setActivity('beep boop bop.');
});
//Variables
var prefix = "!";
var zen = "183672121522782208";
var curGuild = "423992378941243402";
client.on('message', message => {
  if (!message.content.startsWith(prefix)) return;
  if (message.author.bot) return;
  var args = message.content.substring(prefix.length).split(" ");
  var command = commandList[args[0].toLowerCase()];
  //Check if the command exists.
  if (command === undefined) {
    message.reply("That's not a valid command!").then(e => setTimeout(function() {
      if (message.channel.type === "text") e.delete();
    }, 10000));
    return;
  };
  switch (args[0].toLowerCase()) {
    case "help":
      if (args[1]) {
        var lookupCommand = commandList[args[1].toLowerCase()]
        if (lookupCommand === undefined) {
          message.reply("No such command exists.").then(e => setTimeout(function() {
            if (message.channel.type === "text") {
              e.delete();
              message.delete();
            }
          }, 10000));
          return;
        };
        var permissionName = ""
        if (lookupCommand.permission === 0) permissionName = "Everyone"
        if (lookupCommand.permission === 1) permissionName = "Staff"
        if (lookupCommand.permission === 2) permissionName = "Jim (Server Owner)"
        if (lookupCommand.permission === 3) permissionName = "Zen (Bot Owner)"
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
      if (calledRole === undefined) {
        message.reply("There is no existing assignable role under that name.").then(e => setTimeout(function() {
          e.delete();
          message.delete();
        }, 10000));
        return;
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
      if (tempRoleNum < 25) {
        roleEmbed[currentRolePage].addField(Object.values(roleList)[i].displayname, Object.values(roleList)[i].description)
        tempRoleNum++
      } else if (tempRoleNum >= 24) {
        currentRolePage++
        roleEmbed[currentRolePage].addField(Object.values(roleList)[i].displayname, Object.values(roleList)[i].description)
        tempRoleNum = 1
      };
    };
    for (i = 0; i < rolePages; i++) {
      message.author.send(roleEmbed[i + 1])
    };
    if (message.channel.type === "text") message.delete();
      break;
    };
});
//Login to Discord.
client.login(token);
