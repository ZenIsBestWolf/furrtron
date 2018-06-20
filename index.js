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
  client.user.setActivity('being fuzzy. | Prefix is ' + prefix);
});
process.on('unhandledRejection', console.error);
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
    if (message.member.roles.exists("name", "| • Trial Moderator • |") || message.member.roles.exists("name", "| • Moderator • |") || message.member.roles.exists("name", "| • Administrator • |")) userPermLevel = 1
    if (message.member.roles.exists("name", "| • Mayor • |") || message.member.roles.exists("name", "| • Co-Mayors • |")) userPermLevel = 2
};
  if (message.author.id === zen) userPermLevel = 3
  if (message.channel.id === "424197586879250444") {
    message.reply("Bot commands are disabled here.").then(e => setTimeout(function() {
      e.delete();
      message.delete();
    }, 10000));
    return;
  };
  switch (args[0].toLowerCase()) {
    case "8ball":
      var ballResponses = ["Yes","No","Maybe","I\'m not sure.","I\'m sure.","Probably.","Probably not.","Absolutely.","Absolutely not.", "No way."]
      message.reply("**:8ball: says...** " + ballResponses[Math.floor(Math.random() * ballResponses.length)]);
      break;
    case "about":
      var aboutBotEmbed = new Discord.RichEmbed().setTitle("About Furrtron").setDescription("A bot for Furrmont.").addField("Prefix","The prefix is ``" + prefix + "``.").addField("Number of Commands", "There are ``" + Object.values(commandList).length + "`` commands.").addField("Developer", "The developer is ZenIsBestWolf#0446.").addField("GitHub", "Want to contribute to Furrtron or see its code? Head here: https://github.com/ZenIsBestWolf/furrtron.").setColor(0x876021)
      message.channel.send(aboutBotEmbed)
      break;
    case "chat":
      if (userPermLevel < 2) {
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
            }
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
      if (Object.values(roleList)[i].permission === 0 && tempRoleNum < 25) {
        roleEmbed[currentRolePage].addField(Object.values(roleList)[i].displayname, Object.values(roleList)[i].description)
        tempRoleNum++
      } else if (Object.values(roleList)[i].permission === 0 && tempRoleNum >= 24) {
        currentRolePage++
        roleEmbed[currentRolePage].addField(Object.values(roleList)[i].displayname, Object.values(roleList)[i].description)
        tempRoleNum = 1
      };
    };
    for (i = 0; i < rolePages; i++) {
      if (message.channel.id === "424020950837886998" || message.channel.id === "424231304557756426") {
        message.channel.send(roleEmbed[i + 1])
      } else {
        message.author.send(roleEmbed[i + 1])
      };
    };
    if (message.channel.type === "text") message.delete();
      break;
    };
});
//Login to Discord.
client.login(token);
