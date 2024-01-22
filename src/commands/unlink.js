import { SlashCommandBuilder } from 'discord.js';
import * as fs from 'fs';

export default {
    data: new SlashCommandBuilder()
    .setName('unlink')
    .setDescription('Unlink your Final Fantasy XIV Character'),
    async execute(interaction) {
        fs.readFile('./src/characters.json', (error, data) => {
            if (error) {
                console.error(error)
            } else {
                var characters = JSON.parse(data)
                if (characters.characters.some((obj) => obj.discord === interaction.user.id)) {
                    characters.characters.splice(characters.characters.findIndex(obj => obj.discord === interaction.user.id), 1)
                }
                fs.writeFile('./src/characters.json', JSON.stringify(characters), (error) => {
                    if (error) {
                        console.error(error)
                    }
                })
                interaction.reply({ content: `Unlinked character`, ephemeral: true });
            }
        })
    }
}