require("dotenv").config()


const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const { YTSearcher } = require('ytsearcher');
const { executionAsyncResource } = require('async_hooks');
const client = new Discord.Client();

client.login(process.env.BOT_TOKEN)

const searcher = new YTSearcher({
  key: process.env.YT_API_KEY,
  revealed: true
})
const { Player } = require('discord-player');
const player = new Player(client);
client.player = player;

const queue = new Map();

//////Music Text////////
client.on("message", async(message) => {
  const prefix = '$';

  const serverQueue = queue.get(message.guild.id);

  const args = message.content.slice(prefix.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase();

  switch(command){
      case 'play':
          execute(message, serverQueue);
          break;
      case 'stop':
          stop(message, serverQueue);
          break;
      case 'skip':
          skip(message, serverQueue);
          break;
      case 'pause':
          pause(serverQueue);
          break;
      case 'resume':
          resume(serverQueue);
          break;
  }

  async function execute(message, serverQueue){
      let vc = message.member.voice.channel;
      if(!vc){
          return message.channel.send("Please join a voice chat first");
      }else{
          let result = await searcher.search(args.join(" "), { type: "video" })
          const songInfo = await ytdl.getInfo(result.first.url)

          let song = {
              title: songInfo.videoDetails.title,
              url: songInfo.videoDetails.video_url
          };

          if(!serverQueue){
              const queueConstructor = {
                  txtChannel: message.channel,
                  vChannel: vc,
                  connection: null,
                  songs: [],
                  volume: 1,
                  playing: true
              };
              queue.set(message.guild.id, queueConstructor);

              queueConstructor.songs.push(song);

              try{
                  let connection = await vc.join();
                  queueConstructor.connection = connection;
                  play(message.guild, queueConstructor.songs[0]);
              }catch (err){
                  console.error(err);
                  queue.delete(message.guild.id);
                  return message.channel.send(`Unable to join the voice chat ${err}`)
              }
          }else{
              serverQueue.songs.push(song);
              return message.channel.send(`The song has been added ${song.url}`);
          }
      }
  }
  function play(guild, song){
      const serverQueue = queue.get(guild.id);
      if(!song){
          serverQueue.vChannel.leave();
          queue.delete(guild.id);
          return;
      }
      const dispatcher = serverQueue.connection
          .play(ytdl(song.url))
          .on('finish', () =>{
              serverQueue.songs.shift();
              play(guild, serverQueue.songs[0]);
          })
          serverQueue.txtChannel.send(`Now playing ${serverQueue.songs[0].url}`)
  }
  function stop (message, serverQueue){
      if(!message.member.voice.channel)
          return message.channel.send("Need to be in the voice channel to stop the music", { files: ['./images/meme.jpg'] })
      serverQueue.songs = [];
      serverQueue.connection.dispatcher.end();
  }
  function skip (message, serverQueue){
      if(!message.member.voice.channel)
          return message.channel.send("Need to be in the voice channel to skip the music", { files: ['./images/pepe.jpg'] });
      if(!serverQueue)
          return message.channel.send("You don't have anything to skip.. :]?");
      serverQueue.connection.dispatcher.end();
  }
  function pause(serverQueue){
      if(!serverQueue.connection)
          return message.channel.send("There's no music playing bruh");
      if(!message.member.voice.channel)
          return message.channel.send("YOU'RE NOT IN THE VOICE CHANNEL");
      if(serverQueue.connection.dispatcher.paused)
          return message.channel.send('Song is paused already l OMEAGALUL ser');
      serverQueue.connection.dispatcher.pause();
      message.channel.send("The song has been paused!");
  }
  function resume(serverQueue){
      if(!serverQueue.connection)
          return message.channel.send("There's no music playing bruh");
      if(!message.member.voice.channel)
          return message.channel.send("YOU'RE NOT IN THE VOICE CHANNEL")
      if(serverQueue.connection.dispatcher.resumed)
          return message.channel.send('Song is already playing??? Hello???');
      serverQueue.connection.dispatcher.resume();
      message.channel.send("The song has been resumed!");
  }
})




////// Roasts /////
client.on('ready', () => {
    console.log('Bot ready to run')
  });

  client.on('message', msg => {
    if (msg.content === 'moe') {
      msg.channel.send("moe money cash money")
    }
  })
  
  client.on('message', msg => {
    if (msg.content === 'Luis') {
      msg.channel.send("Stupid ass doodoo head, will kick your cat");
    }
  });
  
  client.on('message', msg => {
    if (msg.content === 'Pastulio814') {
      msg.channel.send("If autism had a synonym it would be Eddy", {files: ['./images/edddy.jpg']})
    }
  });
  
  client.on('message', msg => {
    if (msg.content === 'someguy1') {
      msg.channel.send("The type of niga to watch Loli anime and act like he don't like it *hairflip*")
    } 
  });
  
  client.on('message', msg => {
    if (msg.content === 'lagstar1') {
      msg.channel.send("Niga steps outside to take a whiff of fresh air and vacuums every living thing witin a 5 mile radius")
    }
  });
  
  client.on('message', msg => {
    if (msg.content === 'SkyLordD3A7H') {
      msg.channel.send('Canadian niga who swears that America fought for the freedom to give him the N-word pass')
    }
  });
  
  client.on('message', msg => {
    if (msg.content === 'Cal') {
      msg.channel.send('In the eyes of the law he may have committed a crime, but in the eyes of god he is amongst him. He is a god himself in some ways', {files: ['./images/5head.png']})
    }
  });
  
  client.on('message', msg => {
    if (msg.content === 'PinkMimi') {
      msg.channel.send('Got away with cat murder for throwing it in the freezer')
    }
  });
  
  client.on('message', msg => {
    if (msg.content === 'shaktime') {
      msg.channel.send("Brain Damaged", {files: ['./images/steven.jpg']})
    }
  });
  
  client.on('message', msg => {
    if (msg.content === 'Frijolito305') {
      msg.channel.send('LMAOOOOOOOOO, fucking Brain Deaaaad', {files: ['./images/Hector.jpeg']})
    }
  });
  
  client.on('message', msg => {
    if (msg.content === 'fockitjose') {
      msg.channel.send('Most alpha male you will ever meet, did you know that he\'s good at video games? Alpha asf')
    }
  });
  
  client.on('message', msg => {
    if (msg.content === 'explosivetacos') {
      msg.channel.send('Only Delusional man in this server that has played the game for years yet is somehow still bronze')
    }
  });
  
  client.on('message', msg => {
    if (msg.content === 'Christian_') {
      msg.channel.send('Swears he\'s not gay yet')
    }
  });
  
  client.on('message', msg => {
    if (msg.content === "Mikey") {
      msg.channel.send('Thank you for your League of Legends services, homie got clapped so hard he had to retire')
    }
  });
  
  client.on('message', msg => {
    if (msg.content === 'Notchabe') {
      msg.channel.send('Physical embodiment form of victim mentality')
      }
    });
  
  client.on('message', msg => {
    if (msg.content === 'Doctor Dolphin') {
      msg.channel.send('COVID-19 does not exist, Libtard', {files: ['./images/Angel.jpg']})
    }
  });
  
  client.on('message', msg => {
    if (msg.content === 'DOOD!!') {
      msg.channel.send(':]?')
    }
  })
  
  client.on('message', msg => {
    if (msg.content === 'Lui') {
      msg.channel.send('SUSS', {files: ['./images/Lui.jpg']})
    }
  })
  
  client.on('message', msg => {
    if (msg.content === 'Carnage, am I black?') {
      msg.channel.send('pls kys')
    }
  })
  
  client.on('message', msg => {
    if (msg.content === 'Solana') {
      msg.channel.send('bUiLt DifFeRent bR0', {files: ['./images/Solando.png']})
    }
  })

  client.on('message', msg => {
    if (msg.content === 'Glissando') {
      msg.channel.send('A1 E-gRilL')
    }
  })

  client.on('message', msg => {
    if (msg.content === 'Carnage, self-destruct') {
      msg.channel.send('Ok I will explode the closest nuclear reactor to you to kill us all, Ready? 3, 2, 1- err I mean hehe xd')
    }
  })

  client.on('message', msg => {
    if (msg.content === 'Carnage, kys') {
      msg.channel.send('*Teleports behind* Sure dude...Rehehe')
    }
  })

  client.on('message', msg => {
    if (msg.content === 'Carnage') {
      msg.channel.send('I have been summoned, fuck you need bitch ass niga')
    }
  })

  client.on('message', msg => {
    if (msg.content === 'Carnage, do the honors') {
      msg.channel.send('Ok, shut up retard')
    }

  })
