const rp = require("request-promise");
const $ = require("cheerio");
var irc = require("irc");

var greet = require("./static/greet.json");
var config = {
  channels: ["#jiit"],
  server: "irc.freenode.net",
  botName: "markbot12345"
};

var bot = new irc.Client(config.server, config.botName, {
  channels: config.channels
});

// Listening for joins
bot.addListener("join", function(channel, who) {
  var max_len = Object.keys(greet).length - 1;
  var min = 0;
  var index = Math.floor(Math.random() * (+max_len - +min)) + +min;
  console.log(index);
  bot.say(channel, who + greet[index]);
  console.log(greet[index]);
});

bot.addListener("nick", function(oldnick, newnick, channel, message) {
  bot.say(channel, newnick + " seems kinda cool..");
});

bot.addListener("kick", function(channel, who, by, reason) {
  console.log("%s was kicked from %s by %s: %s", who, channel, by, reason);
});

bot.addListener("message", function(nick, to, text) {
  // removes ' ' and converts into array
  var args = text.split(" ");
  if (args[0] == "!xkcd") {
    var max = 3000;
    var min = 0;
    var index = Math.floor(Math.random() * (+max - +min)) + +min;
    const url = "https://xkcd.com/" + index;
    console.log(url);

    rp(url)
      .then(function(html) {
        //success!
        var strip = $("#comic > img", html)[0].attribs.src;
        bot.say(to, "Here is an xkcd strip for ya - https:" + strip);
      })
      .catch(function(err) {
        //handle error
        console.log("error");
      });
  }
});
