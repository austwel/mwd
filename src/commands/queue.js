import { SlashCommandBuilder } from 'discord.js';
import { queueBuilder, rowsBuilder, queueData } from '../queue.js';

export default {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Create a queue display and reset data'),
    async execute(interaction) {
        await interaction.member.guild.channels.fetch(interaction.channelId).then(channel => {
            channel.messages.fetch(queueData.message).then(message => {
                if (Object.hasOwn(message, 'id')) {
                    channel.messages.delete(queueData.message)
                }
            })
        })
        queueData.unranked = []
        queueData.bronze = []
        queueData.silver = []
        queueData.gold = []
        queueData.platinum = []
        queueData.diamond = []
        queueData.crystal = []
		interaction.reply({
			embeds: [queueBuilder()],
			components: [rowsBuilder()],
            ephemeral: false,
            fetchReply: true
		});
        const message = await interaction.fetchReply()
        queueData.message = message.id
	},
};