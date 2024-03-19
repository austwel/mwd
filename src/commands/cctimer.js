import { SlashCommandBuilder } from 'discord.js';
import { config } from 'dotenv'
import { updateCC } from '../timers.js'
config('./.env');

export default {
    data: new SlashCommandBuilder()
    .setName('cctimer')
    .setDescription('Define a voice channel to make the CC timer')
    .addStringOption(option =>
        option.setName('channel')
            .setDescription('Channel to make CC timer')
            .setRequired(true)),
    async execute(interaction) {
        if(process.env.AUTHORISED_USERS.toString().split(',').includes(interaction.user.id)) {
            if(interaction.client.channels.cache.get(interaction.options.getString('channel').trim()) != undefined) {
                updateCC(interaction.client, interaction.options.getString('channel'))
                setInterval(updateCC, 600000, interaction.client, interaction.options.getString('channel'))
                await interaction.reply({ ephemeral: true, content: `Set <#${interaction.options.getString('channel')}> as CC timer.` });
            } else {
                await interaction.reply({ ephemeral: true, content: 'Channel does not exist' })
            }
        } else {
            await interaction.reply({ ephemeral: true, content: 'Only authorised users can set this' })
        }
    }
}