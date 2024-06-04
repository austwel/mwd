import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder, TextInputBuilder } from 'discord.js';
import { customsBuilder, rowsBuilder, gameData } from '../customs.js';

export default {
    data: new SlashCommandBuilder()
        .setName('custom-builder')
        .setDescription('Floating custom scrim builder'),
    async execute(interaction) {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(0x0033ee)
                    .setTitle('Customs')
                    .setDescription('Create a new scrim lobby')
                    .setTimestamp()
                    .setFooter({ text: 'MateriaWolvesDen Bot' })],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('random')
                            .setLabel('Randomised')
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId('teams')
                            .setLabel('Preset Teams')
                            .setStyle(ButtonStyle.Primary)
                    )],
            ephemeral: false
        })
	},
};