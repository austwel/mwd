import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ActivityType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, Colors } from "discord.js";

export var queueData = {
    'message': null,
    'unranked': [],
    'bronze': [],
    'silver': [],
    'gold': [],
    'platinum': [],
    'diamond': [],
    'crystal': []
}

var pings = {
    ug: null,
    gp: null,
    pd: null,
    dc: null
}

export async function rank(interaction) {
    const selection = interaction.values[0]
    const ranks = ['unranked', 'bronze', 'silver', 'gold', 'platinum', 'diamond', 'crystal']
    queueData.message = interaction.message.id
    if (queueData[selection].includes(interaction.user.id)) {
        queueData[selection].splice(queueData[selection].indexOf(interaction.user.id), 1)
    } else {
        queueData[selection].push(interaction.user.id)
    }
    ranks.forEach(r => {
        if (r != selection) {
            if (queueData[r].includes(interaction.user.id)) {
                queueData[r].splice(queueData[r].indexOf(interaction.user.id), 1)
            }
        }
    })
    if (queueData.unranked.length + queueData.bronze.length + queueData.silver.length + queueData.gold.length >= 8) {
        if (pings.ug == null) {
            interaction.channel.send({ content: 'Queue up (Unranked-Gold): ' + queueData.unranked.map(i=>`<@${i}>`).join(' ') + queueData.bronze.map(i=>`<@${i}>`).join(' ') + queueData.silver.map(i=>`<@${i}>`).join(' ') + queueData.gold.map(i=>`<@${i}>`).join(' ') })
            .then(m => pings.ug = m)
        } else {
            pings.ug.update({ content: 'Queue up (Unranked-Gold): ' + queueData.unranked.map(i=>`<@${i}>`).join(' ') + queueData.bronze.map(i=>`<@${i}>`).join(' ') + queueData.silver.map(i=>`<@${i}>`).join(' ') + queueData.gold.map(i=>`<@${i}>`).join(' ') })
        }
    } else if (pings.ug != null) {
        pings.ug.delete()
        pings.ug = null
    }
    if (queueData.gold.length + queueData.platinum.length >= 8) {
        if (pings.gp == null) {
            interaction.channel.send({ content: 'Queue up (Gold-Platinum): ' + queueData.gold.map(i=>`<@${i}>`).join(' ') + queueData.platinum.map(i=>`<@${i}>`).join(' ') })
            .then(m => pings.gp = m)
        } else {
            pings.gp.update({ content: 'Queue up (Gold-Platinum): ' + queueData.gold.map(i=>`<@${i}>`).join(' ') + queueData.platinum.map(i=>`<@${i}>`).join(' ') })
        }
    } else if (pings.gp != null) {
        pings.gp.delete()
        pings.gp = null
    }
    if (queueData.platinum.length + queueData.diamond.length >= 8) {
        if (pings.pd == null) {
            interaction.channel.send({ content: 'Queue up (Platinum-Diamond): ' + queueData.platinum.map(i=>`<@${i}>`).join(' ') + queueData.diamond.map(i=>`<@${i}>`).join(' ') })
            .then(m => pings.pd = m)
        } else {
            pings.pd.update({ content: 'Queue up (Platinum-Diamond): ' + queueData.platinum.map(i=>`<@${i}>`).join(' ') + queueData.diamond.map(i=>`<@${i}>`).join(' ') })
        }
    } else if (pings.pd != null) {
        pings.pd.delete()
        pings.pd = null
    }
    if (queueData.diamond.length + queueData.crystal.length >= 8) {
        if (pings.dc == null) {
            interaction.channel.send({ content: 'Queue up (Diamond-Crystal): ' + queueData.diamond.map(i=>`<@${i}>`).join(' ') + queueData.crystal.map(i=>`<@${i}>`).join(' ') })
            .then(m => pings.dc = m)
        } else {
            pings.dc.update({ content: 'Queue up (Diamond-Crystal): ' + queueData.diamond.map(i=>`<@${i}>`).join(' ') + queueData.crystal.map(i=>`<@${i}>`).join(' ') })
        }
    } else if (pings.dc != null) {
        pings.dc.delete()
        pings.dc = null
    }
    await interaction.update({ 
        embeds: [queueBuilder()]
    })
}

export function rowsBuilder() {
    const rank = new StringSelectMenuBuilder()
        .setCustomId('rank')
        .setPlaceholder('Select your rank')
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('Crystal')
                .setValue('crystal'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Diamond')
                .setValue('diamond'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Platinum')
                .setValue('platinum'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Gold')
                .setValue('gold'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Silver')
                .setValue('silver'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Bronze')
                .setValue('bronze'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Unranked')
                .setValue('unranked'))

    return new ActionRowBuilder()
        .addComponents(rank)
}

export function queueBuilder() {
	return new EmbedBuilder()
		.setColor(0xFF0099)
		.setTitle('Ranked Queue')
		.setDescription('Select your rank to show as queueing. Select the same rank to leave.\n\n')
		.setTimestamp()
		.setFooter({ text: 'MateriaWolvesDen Bot' })
		.addFields(
			{ name: `Crystal: ${queueData.crystal.length}`, value: (queueData.crystal.length>0 ? queueData.crystal.map(i=>`<@${i}>`).join('\n') : 'None'), inline: true },
			{ name: `Diamond: ${queueData.diamond.length}`, value: (queueData.diamond.length>0 ? queueData.diamond.map(i=>`<@${i}>`).join('\n') : 'None'), inline: true },
			{ name: `Platinum: ${queueData.platinum.length}`, value: (queueData.platinum.length>0 ? queueData.platinum.map(i=>`<@${i}>`).join('\n') : 'None'), inline: true },
			{ name: `Gold: ${queueData.gold.length}`, value: (queueData.gold.length>0 ? queueData.gold.map(i=>`<@${i}>`).join('\n') : 'None'), inline: true },
			{ name: `Silver: ${queueData.silver.length}`, value: (queueData.silver.length>0 ? queueData.silver.map(i=>`<@${i}>`).join('\n') : 'None'), inline: true },
			{ name: `Bronze: ${queueData.bronze.length}`, value: (queueData.bronze.length>0 ? queueData.bronze.map(i=>`<@${i}>`).join('\n') : 'None'), inline: true },
			{ name: `Unranked: ${queueData.unranked.length}`, value: (queueData.unranked.length>0 ? queueData.unranked.map(i=>`<@${i}>`).join('\n') : 'None'), inline: true},
            { name: '\u200b', value: '\u200b', inline: false },
            { 
                name: 'Brackets', value: `Unranked - Gold: ${queueData.gold.length + queueData.silver.length + queueData.bronze.length + queueData.unranked.length}\n` +
                `Gold - Platinum: ${queueData.gold.length + queueData.platinum.length}\n` +
                `Platinum - Diamond: ${queueData.platinum.length + queueData.diamond.length}\n` +
                `Diamond - Crystal: ${queueData.diamond.length + queueData.crystal.length}\n`,
                inline: false 
            }
		);
}