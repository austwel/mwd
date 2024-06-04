import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ActivityType } from "discord.js";
import { getRankFromUserId } from "./ranking.js";
import { getCustom, addCustom, editCustom, removeCustom } from "./db/mysql.js";

export function newCaptains(name) {
	return {...waitlistBuilder({name: name, waitlist: ''}), ephemeral: false, fetchReply: true}
}

export async function joinWait(interaction) {
	let game = (await getCustom(interaction.message.id))[0]
	console.log(game)
	if (!game.waitlist.split(",").includes(interaction.user.id)) {
		game.waitlist += ',' + interaction.user.id
	}
	editCustom(game)
	interaction.update(waitlistBuilder(game))
}

export async function leaveWait(interaction) {
	let game = (await getCustom(interaction.message.id))[0]
	console.log(game)
	if (game.waitlist.split(",").includes(interaction.user.id)) {
		game.waitlist = game.waitlist.replace(interaction.user.id, '').replace(',,', ',');
	}
	editCustom(game)
	interaction.update(waitlistBuilder(game))
}

let waitlistBuilder = (game) => ({
	embeds: [new EmbedBuilder()
		.setColor(0x000000)
		.setTitle(game.name)
		.setDescription('Waiting for 10 players...')
		.setFooter({ text: 'MateriaWolvesDen Bot'})
		.addFields(
			{ name: 'Waitlist', value: game.waitlist.length > 0 ? game.waitlist.map((id) => `<@${id}>`).join('\n') : 'None' }
		)],
	components: [new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId('joinWait')
			.setLabel('Join Waitlist')
			.setStyle(ButtonStyle.Success),
		new ButtonBuilder()
			.setCustomId('leaveWait')
			.setLabel('Leave')
			.setStyle(ButtonStyle.Danger)
	)]
})

function picksBuilder(name, waitlist, astra, umbra) {
	return {
		embeds: [new EmbedBuilder()
			.setColor(0x4b7a77)
			.setTitle(name)
			.setDescription(`Waiting for <@${astra.length > umbra.length ? astra[0] : umbra[0]}> to pick.`)
			.setFooter({ text: 'MateriaWolvesDen Bot'})
			.addFields(
				{ name: 'Waiting', value: waitlist.map((id) => `<@${id}>`).join('\n') },
				{ name: 'Astra', value: '[Captain] ' + astra.map((id) => `<@${id}>`).join('\n') },
				{ name: 'Umbra', value: '[Captain] ' + umbra.map((id) => `<@${id}>`).join('\n') }
			)],
		components: [new ActionRowBuilder().addComponents(

		)]
	}
}

function gameBuilder(name, astra, umbra) {
	return new EmbedBuilder()
		.setColor(0x1b81c3)
		.setTitle(name)
		.setDescription(`Game in progress. <@${astra[0]}> to create the lobby.`)
		.setFooter({ text: 'MateriaWolvesDen Bot'})
		.addFieldss(
			{ name: 'Astra', value: '[Captain] ' + astra.map((id) => `<@${id}>`).join('\n') },
			{ name: 'Umbra', value: '[Captain] ' + umbra.map((id) => `<@${id}>`).join('\n') }
		)
}