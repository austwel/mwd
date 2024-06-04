import { Events } from 'discord.js';
import { join, join1, join2, leave, remove, reset, start, sub, newRandom, newTeams, buildNewTeams, buildNewRandom } from '../customs.js';
import { joinWait, leaveWait } from '../captains.js'
import { rank } from '../queue.js'

export default {
	name: Events.InteractionCreate,
	async execute(interaction) {
        try {
            if (interaction.isChatInputCommand()) {
                const command = interaction.client.commands.get(interaction.commandName);

                if (!command) {
                    console.error(`No command matching ${interaction.commandName} was found.`);
                    return;
                }

                try {
                    await command.execute(interaction);
                } catch (error) {
                    console.error(`Error executing ${interaction.commandName}`);
                    console.error(error);
                }
            } else if (interaction.isButton()) {
                try {
                    if (interaction.customId === 'join') {
                        await join(interaction)
                    } else if (interaction.customId === 'join1') {
                        await join1(interaction)
                    } else if (interaction.customId === 'join2') {
                        await join2(interaction)
                    } else if (interaction.customId === 'leave') {
                        await leave(interaction)
                    } else if (interaction.customId === 'sub') {
                        await sub(interaction)
                    } else if (interaction.customId === 'start') {
                        await start(interaction)
                    } else if (interaction.customId == 'remove') {
                        await remove(interaction)
                    } else if (interaction.customId == 'reset') {
                        await reset(interaction)
                    } else if (interaction.customId == 'joinWait') {
                        await joinWait(interaction)
                    } else if (interaction.customId == 'leaveWait') {
                        await leaveWait(interaction)
                    } else if (interaction.customId == 'random') {
                        console.info(interaction.user.id)
                        await newRandom(interaction)
                    } else if (interaction.customId == 'teams') {
                        console.info(interaction.user.id)
                        await newTeams(interaction)
                    }
                } catch (error) {
                    console.error(`Error executing ${interaction.commandName}`);
                    console.error(error);
                }
            } else if (interaction.isStringSelectMenu()) {
                if (interaction.customId === 'rank') {
                    await rank(interaction)
                }
            } else if (interaction.isModalSubmit()) {
                if (interaction.customId === 'teamsModal') {
                    await buildNewTeams(interaction)
                } else if (interaction.customId === 'randomModal' ) {
                    await buildNewRandom(interaction)
                }
            }
        } catch (err) {
            console.error(err)
        }
	},
};