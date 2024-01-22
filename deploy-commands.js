import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { config } from 'dotenv'
config('./.env');

const commands = [];
// Grab all the command folders from the commands directory you created earlier

const commandFiles = readdirSync('./src/commands');
for (const file of commandFiles) {
    await import(`./src/commands/${file}`)
        .then((c) => {
            const command = c.default
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
            } else {
                console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
            }
        })
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// and deploy your commands!
(async () => {
	/*try {
		console.log(`Started refreshing ${commands.length} application (/) commands in ${process.env.GUILD_ID}.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.APP_ID, process.env.GUILD_ID),
			{ body: commands },
		);

		console.log(`Successfully refreshed ${data.length} application (/) commands in ${process.env.GUILD_ID}.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}*/
	
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands globally.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(process.env.APP_ID),
			{ body: commands },
		);

		console.log(`Successfully refreshed ${data.length} application (/) commands globally.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();