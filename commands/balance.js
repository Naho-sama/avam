const Discord = require ("discord.js");
const mongoose = require("mongoose");
const Money = require("../models/money.js");
const dbUrl = require("../configuration.json").dbURL;

mongoose.connect(dbUrl, {
    useNewUrlParser: true
});

module.exports = {
    name: 'balance',
	description: 'Check user\'s balance for current server.',
    cooldown: 5000,
    aliases: [`bal`],
    module: "economy",
    usage: "[@user_mention/user_id]",
    guildOnly: true,
	async execute(client, message, args, reply) {
        let target = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member;

    if(target.user.bot) return reply(`<:uncheck:515840843933024256> Seems like **${target.user.username}** is a bot.`);
    
    Money.findOne({
        userID: target.user.id,
        serverID: message.guild.id
    }, async (err, money) => {
        if(target.user.avatarURL === null) target.user.avatarURL = "https://mraugu.ga/avam_assets/pfp.png";
        let balanceEmbed = new Discord.RichEmbed()
        .setAuthor(target.user.tag, target.user.avatarURL)
        .setColor("#54a041");

        if(!money) {
            balanceEmbed.setDescription(`- ${target.user.tag} • <:aa:515884030508400641>0`)
        } else if(money) {
            balanceEmbed.setDescription(`- ${target.user.tag} • <:aa:515884030508400641>${money.coins.toLocaleString()} `)
        }

        reply(balanceEmbed);
    });
    },
};