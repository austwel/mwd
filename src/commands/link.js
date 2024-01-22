import { SlashCommandBuilder } from 'discord.js';
import * as fs from 'fs';

export default {
    data: new SlashCommandBuilder()
    .setName('link')
    .setDescription('Link a Final Fantasy XIV Character')
    .addStringOption(option =>
        option.setName('character')
            .setDescription('Final Fantasy XIV Character Name')
            .setRequired(true)),
    async execute(interaction) {
        fs.readFile('./src/characters.json', (error, data) => {
            if (error) {
                console.error(error)
            } else {
                var characters = JSON.parse(data)
                if (characters.characters.some((obj) => obj.discord === interaction.user.id)) {
                    characters.characters.splice(characters.characters.findIndex(obj => obj.discord === interaction.user.id), 1)
                }
                characters.characters.push({
                    discord: interaction.user.id,
                    name: interaction.options.getString('character')
                })
                fs.writeFile('./src/characters.json', JSON.stringify(characters), (error) => {
                    if (error) {
                        console.error(error)
                    }
                })
                interaction.reply({ content: `Linked <@${interaction.user.id}> to character: '${interaction.options.getString('character')}'`, ephemeral: true });
            }
        })
    }
}