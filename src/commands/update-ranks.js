import { SlashCommandBuilder } from 'discord.js';
import { updateRanks } from '../ranking.js';

export default {
    data: new SlashCommandBuilder()
    .setName('update-ranks')
    .setDescription('Update cache of rank information for materia pvp.'),
    async execute(interaction) {
        await updateRanks()
        await interaction.reply({ ephemeral: true, content: 'Updated ranks' })
    }
}