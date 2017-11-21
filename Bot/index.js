const Discord = require("discord.js");
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const Config = require("./cfg.js");

let start;

let Target;
let VoiceChannel;
let VCData = [];

let timer = 0;

function reset() {
  VCData = [];
  VoiceChannel = undefined;
}

function hasChannelPermission(cl, permission) {
  return Target.voiceChannel.permissionsFor(cl).has(permission);
}

function msgRape() {
  if(Config.config.autoMsg == true) {
    timer=timer+1;

    if(timer >= Config.config.msgInterval) {
      Target.send(Config.config.messages[ Math.floor(Math.random() * Config.config.messages.length) ]);

      timer = 0;
    }
  }
}

function loop() {

}

setInterval(function() {
  if(typeof Target !== "undefined") {
    if(typeof Target.voiceChannel !== "undefined") {
      if(typeof VoiceChannel !== "undefined") {
        if(VoiceChannel !== Target.voiceChannel) {
          if(typeof VCData[1] !== "undefined") {
            VCData[1].end();
            VCData[0].disconnect();

            reset();

            if(hasChannelPermission(client.user, "CONNECT") && hasChannelPermission(client.user, "SPEAK")) {
              updateChannel();
              rape();
            }
            else {
              msgRape();
            }
          }
          else {
            updateChannel();
            rape();
          }
        }
        else {
          if(typeof VCData[1] !== "undefined") {
            if(VCData[1].destroyed) {
              VCData[1].end();

              const dispatcher = VCData[0].playFile(Config.config.musicFile);
              VCData[1] = dispatcher;
            }
          }
        }
      }
      else {
        updateChannel();
        if(typeof VoiceChannel !== "undefined") rape();
      }
    }
    else {
      if(typeof VCData[1] !== "undefined") {
        VCData[1].end();
        VCData[0].disconnect();
        reset();
      }

      msgRape();
    }
  }
}, 10);

function rape() {
  VoiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playFile(Config.config.musicFile);

    VCData[0] = connection;
    VCData[1] = dispatcher;
  })
  .catch(console.error);
}

function updateChannel() {
  if(typeof Target !== "undefined")
    VoiceChannel = Target.voiceChannel;
}

client.on('message', msg => {
  if (msg.content === (Config.config.cmdStart + ' ping')) {
    msg.member.send('Get ready to get raped!');
    msg.reply(':)');

    Target = msg.member;
    updateChannel();

    if(typeof Target.voiceChannel !== "undefined") rape();
  }

  if (msg.content === (Config.config.cmdStart + ' stop')) {
    msg.reply('Stopped!');

    Target = undefined;
    if(typeof VCData[1] !== "undefined") {
      VCData[1].end();
      VCData[0].disconnect();
    }
    reset();
  }
});

client.login(Config.config.token);
