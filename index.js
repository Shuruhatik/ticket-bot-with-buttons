const Discord = require("discord.js");
const client = new Discord.Client();
require('discord-reply');
const Dataa = require('st.db');
const db = new Dataa(`/Datas/tickets.json`);
const countsdb = new Dataa(`/Datas/tickets-counts.json`);
const ticketschannelsdb = new Dataa(`/Datas/tickets-channels.json`);
const randomstring = require("randomstring");
const app = require('express')();
app.get('/', (req, res) => res.send(`All Copy Right Reserved For: Shuruhatik  in YT`));
app.listen(3000)
const disbut = require('discord-buttons');
require('discord-buttons')(client);
const config = require(`./config.json`)
const prefix = config.prefix


//All Copy Right Reserved For: Shuruhatik  in YT
async function channelLog(embed) {
  if (!config.log_channel_id) return;
  let ch = await client.channels.cache.get(config.log_channel_id)
  if (!ch) return console.log(`ﻪﻨﻣ ﺪﻛﺄﺗ ﺀﺎﺟﺮﺑ ﺕﻼﺠﺳ ﻡﻭﺮﻟﺍ ﻱﺪﻳﺍ ﺓﺀﺍﺮﻗ ﻲﻓ ﺄﻄﺧ ﻞﺼﺣ`)
  ch.send(embed)
}

//All Copy Right Reserved For: Shuruhatik  in YT
client.on('ready', async () => {
  channelLog(`> The **Bot** is reconnecting`)
  client.on('message', async (message) => {
    let tickets = db.all()
    if (message.author.bot) return;
    tickets.forEach(async body => {
      let channel = await client.channels.cache.get(body.data.channelID)
      if (!channel) return;
      let msg = await channel.messages.fetch(body.data.msgID)
      if (!msg) return;
      let new_id = randomstring.generate({ length: 20 })
      let button = new disbut.MessageButton()
        .setStyle(`gray`)
        .setEmoji(`📩`)
        .setLabel(`Create ticket`)
        .setID(body.data.id)
      let embed = new Discord.MessageEmbed()
        .setTitle(body.data.reason)
        .setDescription("لإنشاء تذكرة تفاعل مع 📩")
        .setThumbnail(message.guild.iconURL())
        .setTimestamp()
        .setColor(0x5865F2)
        .setFooter(message.guild.name, message.guild.iconURL())
      try {
        msg.edit({ embed: embed, component: button })
      } catch{

      }
    })//All Copy Right Reserved For: Shuruhatik  in YT
  })
})



client.on('message', async (message) => {
  if (message.author.bot) return;
  let command = message.content.toLowerCase().split(" ")[0];
  if (command == prefix + `help`) {
    let embed = new Discord.MessageEmbed()
      .setTitle(`قائمة أوامر البوت`)
      .setDescription(`> \`${prefix}send\` - إرسال رسالة لفتح التذاكر
> \`${prefix}add\` - يضيف عضوًا إلى تذكرة محددة.
> \`${prefix}remove\` - يزيل عضوًا إلى تذكرة محددة.
> \`${prefix}delete\` - حذف تذكرة معينة
> \`${prefix}close\` - لإغلاق التذكرة
> \`${prefix}open\` - لفتح تذكرة
> \`${prefix}rename\` - إعادة تسمية تذكرة معينة`)
      .setTimestamp()
      .setColor(0x5865F2)
      .setFooter(`All rights belong to https://www.shuruhatik.xyz`)
    message.lineReply({ embed: embed })
  }//All Copy Right Reserved For: Shuruhatik  in YT
  if (command == prefix + `add`) {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.lineReply(`:x: This command requires \`MANAGE_MESSAGES\` permission.`);
    let args = message.content.split(' ').slice(1).join(' ');
    let channel = message.mentions.channels.first() || message.channel;
    if (await ticketschannelsdb.has(`ticket_${channel.id}`) == true) {
      let member = message.mentions.members.first() || message.guild.members.cache.get(args || message.guild.members.cache.find(x => x.user.username === args || x.user.username === args));
      if (!member) return message.lineReply(`الرجاء تحديد الشخص الذي تريد إضافته بشكل صحيح`);
      try {
        channel.updateOverwrite(member.user, {
          VIEW_CHANNEL: true,
          SEND_MESSAGES: true,
          ATTACH_FILES: true,
          READ_MESSAGE_HISTORY: true,
        }).then(() => {
          message.lineReply({ embed: { description: `أضيف بنجاح ${member} إلي ${channel}`, color: 0x5865F2 } });
          let log_embed = new Discord.MessageEmbed()
            .setTitle(`تمت إضافة شخص إلى تذكرة`)
            .addField(`التذكرة`, `<#${channel.id}>`)
            .addField(`شخص مضاف`, member.user)
            .addField(`الاجراء بواسطة`, `<@!${message.author.id}>`)
            .setTimestamp()
            .setColor(`GREEN`)
            .setFooter(message.guild.name, message.guild.iconURL())
          channelLog(log_embed)
        });
      }
      catch (e) {
        return message.channel.send('حدث خطأ ، يرجى المحاولة مرة أخرى!');
      }
    }
  }//All Copy Right Reserved For: Shuruhatik  in YT
  if (command == prefix + `remove`) {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.lineReply(`:x: This command requires \`MANAGE_MESSAGES\` permission.`);
    let args = message.content.split(' ').slice(1).join(' ');
    let channel = message.mentions.channels.first() || message.channel;
    if (await ticketschannelsdb.has(`ticket_${channel.id}`) == true) {
      let member = message.mentions.members.first() || message.guild.members.cache.get(args || message.guild.members.cache.find(x => x.user.username === args || x.user.username === args));
      if (!member) return message.lineReply(`الرجاء تحديد الشخص الذي تريد إضافته بشكل صحيح`);
      try {
        channel.updateOverwrite(member.user, {
          VIEW_CHANNEL: false,
        }).then(() => {
           let log_embed = new Discord.MessageEmbed()
            .setTitle(`تمت إزلة شخص إلى تذكرة`)
            .addField(`التذكرة`, `<#${channel.id}>`)
            .addField(`شخص مضاف`, member.user)
            .addField(`الاجراء بواسطة`, `<@!${message.author.id}>`)
            .setTimestamp()
            .setColor(`RED`)
            .setFooter(message.guild.name, message.guild.iconURL())
          channelLog(log_embed)
          message.lineReply({ embed: { description: `أنحذف بنجاح ${member} من ${channel}`, color: 0x5865F2 } });
        });
      }
      catch (e) {
        return message.channel.send('حدث خطأ ، يرجى المحاولة مرة أخرى!');
      }
    }
  }//All Copy Right Reserved For: Shuruhatik  in YT
  if (command == prefix + 'delete') {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.lineReply(`:x: This command requires \`MANAGE_MESSAGES\` permission.`);
    let channel = message.mentions.channels.first() || message.channel;
    if (await ticketschannelsdb.has(`ticket_${channel.id}`) == true) {
      message.lineReply({ embed: { description: `يتم تنفيذ طلبك بعد 5 ثانية ، وسيتم إغلاقه`, color: 0x5865F2 } })
      setTimeout(async () => {
        let log_embed = new Discord.MessageEmbed()
            .setTitle(`تم حذف تذكرة`)
            .addField(`رقم التذكرة`, `${await ticketschannelsdb.get(`ticket_${channel.id}`).count}`)
            .addField(`التذكرة بواسطة`,`<@!${await ticketschannelsdb.get(`ticket_${channel.id}`).ticket_by}>`)
            .addField(`الاجراء بواسطة`, `<@!${message.author.id}>`)
            .setTimestamp()
            .setColor(`RED`)
            .setFooter(message.guild.name, message.guild.iconURL())
          channelLog(log_embed)
          channel.delete()
      }, 5000)
    }
  }//All Copy Right Reserved For: Shuruhatik  in YT
  if (command == prefix + 'close') {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.lineReply(`:x: This command requires \`MANAGE_MESSAGES\` permission.`);
    let channel = message.mentions.channels.first() || message.channel;
    if (await ticketschannelsdb.has(`ticket_${channel.id}`) == true) {
      let msg = await message.lineReply({ embed: { description: `يتم تنفيذ طلبك بعد 5 ثانية ، وسيتم إغلاقه`, color: 0x5865F2 } })
      setTimeout(async () => {
        try {
          msg.delete()
          channel.send({ embed: { description: `تم إغلاق التذكرة من قبل <@!${message.author.id}>`, color: `YELLOW` } })
          let type = 'member'
          await Promise.all(channel.permissionOverwrites.filter(o => o.type === type).map(o => o.delete()));
          channel.setName(`closed-${await ticketschannelsdb.get(`ticket_${channel.id}`).count}`)
          let log_embed = new Discord.MessageEmbed()
            .setTitle(`تم إغلاق تذكرة`)
            .addField(`التذكرة`, `<#${channel.id}>`)
            .addField(`الاجراء بواسطة`, `<@!${message.author.id}>`)
            .setTimestamp()
            .setColor(`YELLOW`)
            .setFooter(message.guild.name, message.guild.iconURL())
          channelLog(log_embed)
        } catch {

        }
      }, 1000)
    }
  }//All Copy Right Reserved For: Shuruhatik  in YT
  if (command == prefix + 'open') {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.lineReply(`:x: This command requires \`MANAGE_MESSAGES\` permission.`);
    let channel = message.mentions.channels.first() || message.channel;
    if (await ticketschannelsdb.has(`ticket_${channel.id}`) == true) {
      let msg = await message.lineReply({ embed: { description: `يتم تنفيذ طلبك بعد 5 ثانية`, color: 0x5865F2 } })
      setTimeout(async () => {
        try {
          msg.delete()
          channel.send({ embed: { description: `تم فتح التذكرة من قبل <@!${message.author.id}>`, color: `GREEN` } })
          let meember = client.users.cache.get(await ticketschannelsdb.get(`ticket_${channel.id}`).ticket_by);
          channel.updateOverwrite(meember, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
          })
          channel.updateOverwrite(config.support_1, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
          })
          channel.updateOverwrite(config.support_2, {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            ATTACH_FILES: true,
            READ_MESSAGE_HISTORY: true,
          })
          channel.setName(`ticket-${await ticketschannelsdb.get(`ticket_${channel.id}`).count}`)
          let log_embed = new Discord.MessageEmbed()
            .setTitle(`تم إعادة فتح تذكرة`)
            .addField(`التذكرة`, `<#${channel.id}>`)
            .addField(`الاجراء بواسطة`, `<@!${message.author.id}>`)
            .setTimestamp()
            .setColor(`GREEN`)
            .setFooter(message.guild.name, message.guild.iconURL())
          channelLog(log_embed)
        } catch {

        }
      }, 1000)
    }
  }//All Copy Right Reserved For: Shuruhatik  in YT
  if (command == prefix + 'rename' || command == prefix + 'setname') {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.lineReply(`:x: This command requires \`MANAGE_MESSAGES\` permission.`);
    let channel = message.mentions.channels.first() || message.channel;
    if (await ticketschannelsdb.has(`ticket_${channel.id}`) == true) {
      let args = message.content.split(' ').slice(1).join(' ');
      if (!args) return message.lineReply({ embed: { description: `الرجاء تحديد الاسم الذي تريده للتذكرة`, color: 0x5865F2 } })
      channel.setName(args)
      message.delete()
      let log_embed = new Discord.MessageEmbed()
        .setTitle(`تغير اسم تذكرة`)
        .addField(`الاسم الجديد`, args)
        .addField(`التذكرة`, `<#${channel.id}>`)
        .addField(`بواسطة`, `<@!${message.author.id}>`)
        .setTimestamp()
        .setColor(0x5865F2)
        .setFooter(message.guild.name, message.guild.iconURL())
      channelLog(log_embed)
    }
  }//All Copy Right Reserved For: Shuruhatik  in YT
  if (command == prefix + 'send' || command == prefix + 'ticket') {
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.lineReply(`:x: This command requires \`ADMINISTRATOR\` permission.`);
    let idd = randomstring.generate({ length: 20 })
    let args = message.content.split(' ').slice(1).join(' ');
    if (!args) args = `تذاكر`
    let button = new disbut.MessageButton()
      .setStyle(`gray`)
      .setEmoji(`📩`)
      .setLabel(`Create ticket`)
      .setID(idd)
    let embed = new Discord.MessageEmbed()
      .setTitle(args)
      .setDescription("لإنشاء تذكرة تفاعل مع 📩")
      .setThumbnail(message.guild.iconURL())
      .setTimestamp()
      .setColor(0x5865F2)
      .setFooter(message.guild.name, message.guild.iconURL())
    let msg = await message.channel.send({ embed: embed, component: button }).then(async msg => {
      msg.pin()
      let log_embed = new Discord.MessageEmbed()
        .setTitle(`تم إرسال رسالة لفتح تذاكر جديدة`)
        .addField(`داخل روم`, `<#${message.channel.id}>`)
        .addField(`بواسطة`, `<@!` + message.author.id + `>`)
        .setTimestamp()
        .setColor(0x5865F2)
        .setFooter(message.guild.name, message.guild.iconURL())
      channelLog(log_embed)
      await db.set(`tickets_${idd}`, {
        reason: args,
        msgID: msg.id,
        id: idd,
        guildName: message.guild.name,
        guildAvatar: message.guild.iconURL(),
        channelID: message.channel.id
      })
    })
  }
})

//All Copy Right Reserved For: Shuruhatik  in YT
client.on('clickButton', async (button) => {
  if (db.has(`tickets_${button.id}`) == true) {
    await button.reply.send(`يتم تجهيز تذكرتك. أرجو الإنتظار`, true)
    await countsdb.math(`counts_${button.message.id}`, `+`, 1)
    let count = await countsdb.get(`counts_${button.message.id}`)
    let channel;
    button.guild.channels.create(`ticket-${count}`, {
      permissionOverwrites: [
        {
          id: button.guild.roles.everyone,
          deny: ['VIEW_CHANNEL'],
        },
        {
          id: config.support_1,
          allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`,`MANAGE_MESSAGES`],
        },
        {
          id: config.support_2,
          allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`,`MANAGE_MESSAGES`],
        },
        {
          id: button.clicker.user.id,
          allow: ['VIEW_CHANNEL', `READ_MESSAGE_HISTORY`, `ATTACH_FILES`, `SEND_MESSAGES`],
        },
      ], parent: config.category_id, position: 1, topic: `تذكرة : <@!${button.clicker.user.id}>`, reason: "All rights reserved to Shuruhatik.xyz"
    }).then(async channel => {
      channel = channel
      await ticketschannelsdb.set(`ticket_${channel.id}`, { count: count, ticket_by: button.clicker.user.id })

      await button.reply.edit(`
**تم فتح تذكرتك بنجاح ** <#${channel.id}>`, true)
          let log_embed = new Discord.MessageEmbed()
            .setTitle(`تم فتح تذكرة جديدة`)
            .addField(`التذكرة`, `<#${channel.id}>`)
            .addField(`التذكرة بواسطة`, `<@!${button.clicker.user.id}>`)
            .addField(`رقم التذكرة`, count)
            .setTimestamp()
            .setColor(`GREEN`)
          channelLog(log_embed)
      const embedticket = new Discord.MessageEmbed()
        .setTimestamp()
        .setFooter(`تم فتح التذكرة في`)
        .setColor(0x5865F2)
        .setDescription(`الدعم سيكون معك قريبا.
لإغلاق هذه التذكرة ، تفاعل مع 🔒`)
      let idd = randomstring.generate({ length: 25 })
      let bu1tton = new disbut.MessageButton()
        .setStyle(`gray`)
        .setEmoji(`🔒`)
        .setLabel(`Close`)
        .setID(idd)
      channel.send(`أهلا بك <@!${button.clicker.user.id}>`, { embed: embedticket, component: bu1tton }).then(msg => {
        msg.pin()
      })
      client.on('clickButton', async (button1) => {
        if (button1.id == idd) {
          let bu0tton = new disbut.MessageButton()
            .setStyle(`red`)
            .setLabel(`أغلق`)
            .setID(idd + `sure`)
          await button1.reply.send(`هل أنت متأكد أنك تريد إغلاق هذه التذكرة؟`, { component: bu0tton, ephemeral: true });
        }
        client.on('clickButton', async (button) => {
          if (button.id == idd + `sure`) {
            await button1.reply.edit(`يتم تنفيذ طلبك بعد 5 ثانية ، وسيتم إغلاقه`, true)
            let ch = channel
            if (!ch) return;
            setTimeout(async () => {
              try {
                await ch.send({ embed: { description: `تم إغلاق التذكرة من قبل <@!${button.clicker.user.id}>`, color: `YELLOW` } });
                let type = 'member'
                await Promise.all(ch.permissionOverwrites.filter(o => o.type === type).map(o => o.delete()));
                ch.setName(`closed-${await ticketschannelsdb.get(`ticket_${ch.id}`).count}`)
                let log_embed = new Discord.MessageEmbed()
                  .setTitle(`تم إغلاق تذكرة`)
                  .addField(`التذكرة`, `<#${ch.id}>`)
                  .addField(`الاجراء بواسطة`, `<@!${button.clicker.user.id}>`)
                  .setTimestamp()
                  .setColor(`YELLOW`)
                channelLog(log_embed)
              } catch {

              }
            }, 4000)
          }
        })
      })
    })
  }
})

client.on("ready", async () => {
  await client.user.setActivity(config.status || `Bot Created by Shuruhatik.yxz`)
  console.clear()
  console.log(`\u001b[38;5;220m------- ﺩﺭﻮﻜﺴﻳﺪﻠﻟ ﺭﺍﺭﺯﺄﺑ ﺮﻛﺍﺬﺗ ﺕﻮﺑ -------\n\u001b[38;5;220m> \x1b[32mﺭﺍﺪﺻﺇ: \x1b[37m1.0\n\u001b[38;5;220m> \x1b[32mﺕﻮﺒﻟﺍ ﺔﻟﺎﺣ: \x1b[37m\x1b[7mﻞﺼﺘﻣ\x1b[0m\n\u001b[38;5;220m------- ﺩﺭﻮﻜﺴﻳﺪﻠﻟ ﺭﺍﺭﺯﺄﺑ ﺮﻛﺍﺬﺗ ﺕﻮﺑ -------\x1b[37m\n\x1b[44mﺮﺸﻨﻟﺍﻭ ﻒﻴﻟﺄﺘﻟﺍ ﻕﻮﻘﺣ:\x1b[0m  \x1b[4mﻰﻟﺇ ﺮﺸﻨﻟﺍ ﻕﻮﻘﺣ ﻊﻴﻤﺟ https://www.shuruhatik.xyz/\x1b[0m \u001b[0m`);
})


client.login(process.env['token'])
