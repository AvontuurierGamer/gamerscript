const discord = require("discord.js");
const botconfig = require("./botconfig.json");

const client = new discord.Client();
client.login(botconfig.token);


client.on("ready", async () => {

    console.log(`${client.user.username} is online.`)

    client.user.setActivity("!help", { type: "WATCHING" });

});

client.on("message", async message =>{

    if(message.author.bot) return;

    if(message.channel.type == "dm") return;

    var prefix = botconfig.prefix;

    var messageArray = message.content.split(" ");

    var command = messageArray[0];

    if(command === `${prefix}help`){
        
        var botEmbed = new discord.MessageEmbed()
            .setTitle("help")
            .setDescription("dit zijn alle bot commandos")
            .setColor("#ff1100")
            .addFields(
                {name: "!ip", value: "zie het ip van de server"},
                {name: "!serverinfo", value: "zie informatie van de server"},
                {name: "!shop", value: "verkrijg de link naar de shop"}
            )
            .setFooter("help")
            .setTimestamp();
        
        return message.channel.send(botEmbed);
    }

    if(command === `${prefix}serverinfo`){
        
        var botEmbed = new discord.MessageEmbed()
            .setTitle("Server Info")
            .setDescription("server informatie")
            .setColor("#15ff00")
            .addFields(
                {name: "Bot Naam", value:client.user.username},
                {name: "Je bent de server gejoint op: ", value: message.member.joinedAt},
                {name: "Totaal aantal members: ", value:message.guild.memberCount}
            )
            .setFooter("Server info")
            .setTimestamp();
        
        return message.channel.send(botEmbed);
    }

    if(command === `${prefix}ip`){
        
        var botEmbed = new discord.MessageEmbed()
            .setColor("#21ccc6")
            .addFields(
                {name: "ip:", value: "mc-survivalspel.nl"},
            )
            .setFooter("ip")
            .setTimestamp();
        
        return message.channel.send(botEmbed);
    }

    if(command === `${prefix}shop`){
        
        var botEmbed = new discord.MessageEmbed()
            .setColor("#21ccc6")
            .addFields(
                {name: "shop:", value: "https://survival-spel.tebex.io/"},
            )
            .setFooter("shop")
            .setTimestamp();
        
        return message.channel.send(botEmbed);
    }

    if(command === `${prefix}kick`) {

        var args = message.content.slice(prefix.lenght).split(/ +/);

        if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply("Je kan dit niet");

        if(!message.guild.me.hasPermission("KICK_MEMBERS"))return message.reply("geen perms");

        if(!args[1]) return message.reply("geen gebruiker opgegeven");

        if(!args[2]) return message.reply("geen reden opgegeven");

        var kickUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[1]));

        var reason = args.slice(2).join(" ");

        if(!kickUser) return message.reply("Gebruiker niet gevonden");

        var embedPrompt = new discord.MessageEmbed()
            .setColor("RED")
            .setTitle("Reageer binnen 30 seconden")
            .setDescription(`wil je ${kickUser} kicken?`);

        var embed = new discord.MessageEmbed()
            .setColor("#ff0000")
            .setFooter(message.member.displayName)
            .setTimestamp()
            .setDescription(`**Gekickt: ** ${kickUser} (${kickUser.id})
            **Gekickt door:** ${message.author}
            **Redenen: ** ${reason}`);

        message.channel.send(embedPrompt).then(async msg => {
            
            var emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            if (emoji === "✅") {

                msg.delete();

                kickUser.kick(reason).catch(err => {
                    if (err) return message.reply("er is iets fout gegaan");
                });

                message.channel.send(embed);

            } else if (emoji === "❌") {

                msg.delete();

                message.reply("kick geanuleerd").then(m => m.delete(5000));

            }

        })

    }

});


async function promtMessage(message, author, time, reactions){

    time *= 1000;

    for(const reaction of reactions){
        await message.react(reactions);
    }

    var filter = (reaction, user) => reactions.includes(reaction.emoji.name) && user.id === author.id;

    return message.awaitreactions(filter, {max:1, time: time}).then(collected => collected.first() && collected.first().emoji.name);

}

bot.login(process.env.token);