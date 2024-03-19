import { SlashCommandBuilder } from 'discord.js';
import { config } from 'dotenv'
import { updateFL } from '../timers.js'
config('./.env');

export default {
    data: new SlashCommandBuilder()
    .setName('fltimer')
    .setDescription('Define a voice channel to make the Frontlines timer')
    .addStringOption(option =>
        option.setName('channel')
            .setDescription('Channel to make Frontlines timer')
            .setRequired(true)),
    async execute(interaction) {
        if(process.env.AUTHORISED_USERS.toString().split(',').includes(interaction.user.id)) {
            if(interaction.client.channels.cache.get(interaction.options.getString('channel').trim()) != undefined) {
                updateFL(interaction.client, interaction.options.getString('channel'))
                setInterval(updateFL, 6000000, interaction.client, interaction.options.getString('channel'))
                await interaction.reply({ ephemeral: true, content: `Set <#${interaction.options.getString('channel')}> as FL timer.` });
            } else {
                await interaction.reply({ ephemeral: true, content: 'Channel does not exist' })
            }
        } else {
            await interaction.reply({ ephemeral: true, content: 'Only authorised users can set this' })
        }
    }
}