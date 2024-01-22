import { SlashCommandBuilder } from 'discord.js';
import { getRankFromUserId, getRankFromCharacterName, getNameFromUserId } from '../ranking.js'
import * as fs from 'fs';

export default {
    data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Get the rank of a Final Fantasy XIV Character')
    .addStringOption(option =>
        option.setName('character')
            .setDescription('Final Fantasy XIV Character Name')
            .setRequired(false))
    .addUserOption(option =>
        option.setName('user')
            .setDescription('Discord user to lookup')
            .setRequired(false)),
    async execute(interaction) {
        if (interaction.options.getString('character') != null) {
            let rank = getRankFromCharacterName(interaction.options.getString('character'))
            interaction.reply({ content: `${interaction.options.getString('character')} is ${rank}` })

        } else if (interaction.options.getUser('user') != null) {
            let rank = getRankFromUserId(interaction.options.getUser('user').id)
            let name = getNameFromUserId(interaction.options.getUser('user').id)
            if (rank === 'not linked') {
                interaction.reply({ content: `No characters registered for <@${interaction.options.getUser('user').id}>` })
            } else {
                interaction.reply({ content: `<@${interaction.options.getUser('user').id}> (${name}) is ${rank}` })
            }
        } else if (getNameFromUserId(interaction.user.id) != 'not linked') {
            let rank = getRankFromUserId(interaction.user.id)
            let name = getNameFromUserId(interaction.user.id)
            if (rank === 'not linked') {
                interaction.reply({ content: `No characters registered for <@${interaction.user.id}>` })
            } else {
                interaction.reply({ content: `<@${interaction.user.id}> (${name}) is ${rank}` })
            }
        } else {
            interaction.reply({ content: `No characters registered for <@${interaction.user.id}>` })
        }
    }
}