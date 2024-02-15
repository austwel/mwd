import { SlashCommandBuilder } from 'discord.js';
import { config } from 'dotenv'
config('./.env');

function updateCC(client, channel) {
    const cc_schedule = ['Palaistra → VH', 'Volcanic → CC', 'Clockwork → PL', 'Palaistra → C9', 'Cloud Nine → RS', 'Red Sands → PL']
    let current_timestamp = Date.now()
    let now = Math.floor((current_timestamp % 32400000)/5400000) //Which map
    let into_map = Math.round(Math.floor((current_timestamp % 5400000)/60000)/5)*5 //Minutes into map

    console.log(`Updating ${cc_schedule[now]} (${90-into_map}m)`)
    client.channels.cache.get(channel).setName(`${cc_schedule[now]} (${90-into_map}m)`)
}

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