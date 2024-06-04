import { SlashCommandBuilder } from 'discord.js';
import { customsBuilder, rowsBuilder, gameData } from '../customs.js';

export default {
    data: new SlashCommandBuilder()
        .setName('swap')
        .setDescription('Swap out a player from a custom game')
		.addStringOption(option =>
			option.setName('messageid')
				.setDescription('Message ID of custom game')
				.setRequired(true))
        .addUserOption(option => 
            option.setName('outuser')
                .setDescription('User to remove from team')
                .setRequired(true))
        .addUserOption(option => 
            option.setName('inuser')
                .setDescription('User to add to team')
                .setRequired(true)),
    async execute(interaction) {
        const messageId = interaction.options.getString('messageid')
        const outUserId = interaction.options.getUser('outuser').id
        const inUserId = interaction.options.getUser('inuser').id
        console.info(`attemping to swap ${outUserId} to ${inUserId} in ${messageId}.`)
        if (!(messageId in gameData)) {
            interaction.reply({
                content: `Could not find lobby with message id ${messageId}.`,
                ephemeral: true
            })
            return
        } else {
            let d = gameData[messageId]

            if (d.team1.indexOf(outUserId) == -1 && d.team2.indexOf(outUserId) == -1) {
                interaction.reply({
                    content: `Could not find <@${outUserId}> in team 1 or 2.`,
                    ephemeral: true
                })
                return
            } else if (d.waitlist.indexOf(inUserId) == -1) {
                interaction.reply({
                    content: `Could not find <@${inUserId}> in waitlist.`,
                    ephemeral: true
                })
                return
            }

            if (d.team1.includes(outUserId)) {
                d.team1[d.team1.indexOf(outUserId)] = inUserId
            } else {
                d.team2[d.team2.indexOf(outUserId)] = inUserId
            }
            d.waitlist[d.waitlist.indexOf(inUserId)] = outUserId
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

        await interaction.reply({
            content: `Swapped <@${outUserId}> with <@${inUserId}> in the lobby.`,
            ephemeral: true
        })
    }
};