import { SlashCommandBuilder } from 'discord.js';
import { newCaptains } from '../captains.js';
import { addCustom } from '../db/mysql.js';

export default {
    data: new SlashCommandBuilder()
        .setName('captains')
        .setDescription('Create a scrim')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('Custom game name')
				.setRequired(true)),
    async execute(interaction) {
        try {
            let message = interaction.reply(newCaptains(interaction.options.getString('name')));
            await message
            console.log('message id: ' + message.id)
            await addCustom({message_id: message.id, name: interaction.options.getString('name')})
        } catch (error) {
            await interaction.reply({content: 'Couldn\'t make custom match, please try again.', ephemeral: true})
        }
	}
};