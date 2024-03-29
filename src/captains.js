import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ActivityType } from "discord.js";
import { getRankFromUserId } from "./ranking.js";
import { getCustom, addCustom, editCustom, removeCustom } from "./db/mysql.js";

const default_custom = {
	name: 'Crystalline Conflict Scrim',
	waitlist: [],
	astra: [],
	umbra: []
}

export async function join(interaction) {
	let rows = await getCustom(interaction.message.id)
	if (rows.length == 0) {
		await addCustom(default_custom)
	}
	game = await getCustom(interaction.message.id)
	if (!game.waitlist.split(",").includes(interaction.user.id)) {
		game.waitlist.push(interaction.user.id)
	}
	await editCustom(game)

	await interaction.update({ 
		embeds: [customsBuilder(
			gameData[interaction.message.id].waitlist,
			gameData[interaction.message.id].team1,
			gameData[interaction.message.id].team2,
			gameData[interaction.message.id].name,
			gameData[interaction.message.id].style)]
	})
}

export async function join1(interaction) {
	var data = {}
	if (!gameData.hasOwnProperty(interaction.message.id)) {
		data = loadStaleData(interaction)
	} else {
		data = gameData[interaction.message.id]
	}
	if (!data.team1.includes(interaction.user.id)) {
		data.team1.push(interaction.user.id)
		if (data.waitlist.includes(interaction.user.id)) {
			data.waitlist.splice(data.waitlist.indexOf(interaction.user.id), 1)
		} else if (data.team2.includes(interaction.user.id)) {
			data.team2.splice(data.team2.indexOf(interaction.user.id), 1)
		}
	}
	gameData[interaction.message.id] = data
	await interaction.update({ 
		embeds: [customsBuilder(
			gameData[interaction.message.id].waitlist,
			gameData[interaction.message.id].team1,
			gameData[interaction.message.id].team2,
			gameData[interaction.message.id].name,
			gameData[interaction.message.id].style)]
	})
}

export async function join2(interaction) {
	var data = {}
	if (!gameData.hasOwnProperty(interaction.message.id)) {
		data = loadStaleData(interaction)
	} else {
		data = gameData[interaction.message.id]
	}
	if (!data.team2.includes(interaction.user.id)) {
		data.team2.push(interaction.user.id)
		if (data.team1.includes(interaction.user.id)) {
			data.team1.splice(data.team1.indexOf(interaction.user.id), 1)
		} else if (data.waitlist.includes(interaction.user.id)) {
			data.waitlist.splice(data.waitlist.indexOf(interaction.user.id), 1)
		}
	}
	gameData[interaction.message.id] = data
	await interaction.update({ 
		embeds: [customsBuilder(
			gameData[interaction.message.id].waitlist,
			gameData[interaction.message.id].team1,
			gameData[interaction.message.id].team2,
			gameData[interaction.message.id].name,
			gameData[interaction.message.id].style)]
	})
}

export async function reset(interaction) {
	gameData[interaction.message.id] = resetData(interaction)
	await interaction.update({ 
		embeds: [customsBuilder(
			gameData[interaction.message.id].waitlist,
			gameData[interaction.message.id].team1,
			gameData[interaction.message.id].team2,
			gameData[interaction.message.id].name,
			gameData[interaction.message.id].style)]
	})
}

export async function leave(interaction) {
	var data = {}
	if (!gameData.hasOwnProperty(interaction.message.id)) {
		data = loadStaleData(interaction)
	} else {
		data = gameData[interaction.message.id]
	}
	if (data.waitlist.includes(interaction.user.id)) {
		data.waitlist.splice(data.waitlist.indexOf(interaction.user.id), 1)
	} else if (data.team1.includes(interaction.user.id)) {
		data.team1.splice(data.team1.indexOf(interaction.user.id), 1)
	} else if (data.team2.includes(interaction.user.id)) {
		data.team2.splice(data.team2.indexOf(interaction.user.id), 1)
	}
	gameData[interaction.message.id] = data
	await interaction.update({ 
		embeds: [customsBuilder(
			gameData[interaction.message.id].waitlist,
			gameData[interaction.message.id].team1,
			gameData[interaction.message.id].team2,
			gameData[interaction.message.id].name,
			gameData[interaction.message.id].style)]
	})
}

export async function remove(interaction) {
	if (gameData.hasOwnProperty(interaction.message.id)) {
		delete gameData[interaction.message.id]
	}
	await interaction.message.delete()
}

export async function presence(interaction, force=false) {
	if (Object.keys(gameData).length === 0 && !force) {
		interaction.client.user.setPresence({
			status: 'available',
			activities: [{
				name: 'cc',
				type: ActivityType.Custom,
				state: '🏆 Ready to create scrims'
			}]
		})
	} else {
		var allUsers = 0
		for (const [key, value] of Object.entries(gameData)) {
			if (value.style == 'Balanced Teams') {
				allUsers += value.waitlist.length
			}
			allUsers += value.team1.length
			allUsers += value.team2.length
		}
		interaction.client.user.setPresence({
			status: 'available',
			activities: [{
				name: 'cc',
				type: ActivityType.Custom,
				state: `🏆 Creating scrims: ${allUsers} playing`
			}]
		})
	}
}

export async function start(interaction) {
	var data = {}
	if (!gameData.hasOwnProperty(interaction.message.id)) {
		data = loadStaleData(interaction)
	} else {
		data = gameData[interaction.message.id]
	}
	while (data.team1.length > 0) {
		data.waitlist.push(data.team1.pop())
	}
	while (data.team2.length > 0) {
		data.waitlist.push(data.team2.pop())
	}
	data.team1 = [];
	data.team2 = [];
	while (data.waitlist.length > 0 && data.team2.length < 5) {
		data.team1.push(data.waitlist.splice(Math.floor(data.waitlist.length * Math.random()), 1)[0])
		if(data.waitlist.length > 0) {
			data.team2.push(data.waitlist.splice(Math.floor(data.waitlist.length * Math.random()), 1)[0])
		}
	}
	gameData[interaction.message.id] = data
	await interaction.update({ 
		embeds: [customsBuilder(
			gameData[interaction.message.id].waitlist,
			gameData[interaction.message.id].team1,
			gameData[interaction.message.id].team2,
			gameData[interaction.message.id].name,
			gameData[interaction.message.id].style)]
	})
}

export function rowsBuilder(style) {
	const join = new ButtonBuilder()
		.setCustomId('join')
		.setLabel('Join Waitlist')
		.setStyle(ButtonStyle.Success)

	const join1 = new ButtonBuilder()
		.setCustomId('join1')
		.setLabel('Join Team 1')
		.setStyle(ButtonStyle.Success)

	const join2 = new ButtonBuilder()
		.setCustomId('join2')
		.setLabel('Join Team 2')
		.setStyle(ButtonStyle.Success)

	const leave = new ButtonBuilder()
		.setCustomId('leave')
		.setLabel('Leave')
		.setStyle(ButtonStyle.Danger);

	const start = new ButtonBuilder()
		.setCustomId('start')
		.setLabel('Randomise Teams')
		.setStyle(ButtonStyle.Primary);

	const remove = new ButtonBuilder()
		.setCustomId('remove')
		.setLabel('Remove')
		.setStyle(ButtonStyle.Secondary)

	const reset = new ButtonBuilder()
		.setCustomId('reset')
		.setLabel('Reset')
		.setStyle(ButtonStyle.Secondary)

	if (style == 'Balanced Teams') {
		return new ActionRowBuilder()
			.addComponents(join, leave, reset, start)
	} else if (style == 'Custom Teams') {
		return new ActionRowBuilder()
			.addComponents(join1, join2, leave, reset)
	}
}

function waitlistBuilder(name, waitlist) {
	if (waitlist.length == 0) { var w = 'None' }
	return new EmbedBuilder()
		.setColor(0x000000)
		.setTitle(name)
		.setDescription('Waiting for 10 players...')
		.setFooter({ text: 'MateriaWolvesDen Bot'})
		.addFields(
			{ name: 'Waitlist', value: waitlist.length > 0 ? waitlist.map((id) => `<@${id}>`).join('\n') : 'None' }
		)
}

function picksBuilder(name, waitlist, astra, umbra) {
	return new EmbedBuilder()
		.setColor(0x4b7a77)
		.setTitle(name)
		.setDescription(`Waiting for <@${astra.length > umbra.length ? astra[0] : umbra[0]}> to pick.`)
		.setFooter({ text: 'MateriaWolvesDen Bot'})
		.addFields(
			{ name: 'Waiting', value: waitlist.map((id) => `<@${id}>`).join('\n') },
			{ name: 'Astra', value: '[Captain] ' + astra.map((id) => `<@${id}>`).join('\n') },
			{ name: 'Umbra', value: '[Captain] ' + umbra.map((id) => `<@${id}>`).join('\n') }
		)
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

export function customsBuilder(waitlist, team1, team2, name, style) {
	if (name == null) { name = 'Crystalline Conflict Scrim' }
	if (waitlist.length == 0) {
		var w = 'None'
	} else {
		var w2 = []
		for(const user of waitlist) {
			//w2.push(`<@${user}> | ${getRankFromUserId(user)}`)
			w2.push(`<@${user}>`)
		}
		var w = w2.join('\n')
	}
	if (team1.length == 0) {
		var t1 = 'None'
	} else {
		var t12 = []
		for(const user of team1) {
			//t12.push(`<@${user}> | ${getRankFromUserId(user)}`)
			t12.push(`<@${user}>`)
		}
		var t1 = t12.join('\n')
	}
	if (team2.length == 0) {
		var t2 = 'None'
	} else {
		var t22 = []
		for(const user of team2) {
			//t22.push(`<@${user}> | ${getRankFromUserId(user)}`)
			t22.push(`<@${user}>`)
		}
		var t2 = t22.join('\n')
	}
	return new EmbedBuilder()
		.setColor(style == 'Balanced Teams' ? 0x0099FF : 0x99FF00)
		.setTitle(name)
		.setDescription(`${style}`)
		.setTimestamp()
		.setFooter({ text: 'MateriaWolvesDen Bot' })
		.addFields(
			{ name: style == 'Balanced Teams' ? `Waiting ${waitlist.length}/10` : '\n', value: style == 'Balanced Teams' ? w : '\n' },
			{ name: 'Team 1', value: t1, inline: true },
			{ name: 'Team 2', value: t2, inline: true }
		);
}