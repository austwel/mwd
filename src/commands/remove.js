import { SlashCommandBuilder } from 'discord.js';
import { customsBuilder, rowsBuilder, gameData } from '../customs.js';

export default {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove a player from a custom game')
		.addStringOption(option =>
			option.setName('messageid')
				.setDescription('Message ID of custom game')
				.setRequired(true))
        .addUserOption(option => 
            option.setName('user')
                .setDescription('User to remove from lobby')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({
            ephemeral: true
        })
        const messageId = interaction.options.getString('messageid')
        const userId = interaction.options.getUser('user').id
        console.info(`attemping to remove ${userId} from ${messageId}.`)
        if (!(messageId in gameData)) {
            interaction.editReply({
                content: `Could not find lobby with message id ${messageId}.`,
                ephemeral: true
            })
            return
        } else {
            let d = gameData[messageId]
            if (d.waitlist.includes(userId)) {
                d.waitlist.splice(d.waitlist.indexOf(userId), 1)
            } else if (d.team1.includes(userId)) {
                d.team1.splice(d.team1.indexOf(userId), 1)
            } else if (d.team2.includes(userId)) {
                d.team2.splice(d.team2.indexOf(userId), 1)
            } else {
                interaction.editReply({
                    content: `Could not find user <@${userId}> in this lobby.`,
                    ephemeral: true
                })
                return
            }
            gameData[messageId] = d
        }

        await interaction.channel.messages.fetch(messageId)
            .then(message => message.edit({
                embeds: [customsBuilder(
                    gameData[messageId].waitlist,
                    gameData[messageId].team1,
                    gameData[messageId].team2,
                    gameData[messageId].desc,
                    gameData[messageId].name,
                    gameData[messageId].style
                )]
            }))

        await interaction.editReply({
            content: `Removed <@${userId}> from the lobby.`,
            ephemeral: true
        })
    }
};