import { SlashCommandBuilder } from 'discord.js';
import { top100Image } from '../ranking.js';

export default {
    data: new SlashCommandBuilder()
    .setName('top100')
    .setDescription('Get the top 100 players from the datacenter.'),
    async execute(interaction) {
        interaction.deferReply();
        let image = await top100Image()
        interaction.editReply({ files: [image] })
    }
}