import { Client, Events, Collection, GatewayIntentBits } from 'discord.js';
import { readdirSync } from 'fs';
import { config } from 'dotenv'
config('./.env');

const client = new Client({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildIntegrations] });

client.login(process.env.DISCORD_TOKEN);

client.commands = new Collection()

readdirSync('./src/commands').forEach((file) => {
    import(`./commands/${file}`)
        .then((c) => {
            const command = c.default
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
            }
        })
})

readdirSync('./src/events').forEach((file) => {
    import(`./events/${file}`)
        .then((c) => {
            const event = c.default
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args));
            } else {
                client.on(event.name, (...args) => event.execute(...args));
            }
        })
})