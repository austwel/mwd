import { SlashCommandBuilder } from 'discord.js';
import { top100Image } from '../ranking.js';

export default {
    data: new SlashCommandBuilder()
    .setName('top100')
    .setDescription('Get the top 100 players from the datacenter.'),
    async execute(interaction) {
        await interaction.deferReply();
        let image = await top100Image()
        if(image == null) {
            interaction.editReply({ content: 'Unable to talk to lodestone, is FFXIV down for maint?'})
            console.error('Couldn\'t pull top 100')
        } else {
            interaction.editReply({ files: [image] })
        }
    }
}