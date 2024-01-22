import { SlashCommandBuilder } from 'discord.js';
import { customsBuilder, rowsBuilder, presence, gameData } from '../customs.js';

export default {
    data: new SlashCommandBuilder()
        .setName('create-custom')
        .setDescription('Create a custom lobby')
		.addStringOption(option =>
			option.setName('style')
				.setDescription('Matchmaking style')
				.setRequired(true)
				.addChoices(
					{ name: 'Auto', value: 'Balanced Teams' },
					{ name: 'Custom', value: 'Custom Teams' }
				))
		.addStringOption(option =>
			option.setName('name')
				.setDescription('Custom game name')
				.setRequired(false)),
    async execute(interaction) {
		presence(interaction, true)
		let message = interaction.reply({
			embeds: [customsBuilder([], [], [], interaction.options.getString('name'), interaction.options.getString('style'))],
			components: [rowsBuilder(interaction.options.getString('style'))],
            ephemeral: false,
			fetchReply: true
		});
		await message
		gameData[message.id] = {
			waitlist: [],
			team1: [],
			team2: [],
			style: interaction.options.getString('style'),
			name: interaction.options.getString('name')
		}
	},
};