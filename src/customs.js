import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ActivityType, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import { getRankFromUserId } from "./ranking.js";

export var gameData = {}

function loadStaleData(interaction) {
	return {
		waitlist: interaction.message.embeds[0].data.fields[1].value == 'None' ? [] : interaction.message.embeds[0].data.fields[1].value.replaceAll(/[<@>]/g,'').replaceAll(/( \|.+)/g,'').split('\n'), 
		team1: interaction.message.embeds[0].data.fields[2].value == 'None' ? [] : interaction.message.embeds[0].data.fields[2].value.replaceAll(/[<@>]/g,'').replaceAll(/( \|.+)/g,'').split('\n'), 
		team2: interaction.message.embeds[0].data.fields[3].value == 'None' ? [] : interaction.message.embeds[0].data.fields[3].value.replaceAll(/[<@>]/g,'').replaceAll(/( \|.+)/g,'').split('\n'), 
		name: interaction.message.embeds[0].data.title,
		style: interaction.message.embeds[0].data.fields[0].name,
		desc: interaction.message.embeds[0].data.description
	}
}

function resetData(interaction) {
	return {
		waitlist: [],
		team1: [],
		team2: [],
		name: interaction.message.embeds[0].data.title,
		style: interaction.message.embeds[0].data.fields[0].name,
		desc: interaction.message.embeds[0].data.description
	}
}

export async function newTeams(interaction) {
	const modal = new ModalBuilder()
		.setCustomId('teamsModal')
		.setTitle('New Premade Teams Scrim')
	
	const name = new TextInputBuilder()
		.setCustomId('pfname')
		.setLabel('Scrim Name')
		.setStyle(TextInputStyle.Short)
		.setPlaceholder('Name the Scrim')
		.setValue('Premade Teams Scrim')
		.setRequired(true)

	const pfInfo = new TextInputBuilder()
		.setCustomId('pfinfo')
		.setLabel('PF Information')
		.setStyle(TextInputStyle.Paragraph)
		.setMaxLength(500)
		.setPlaceholder('Include who opens the PF and password.')
		.setRequired(false)

	const firstActionRow = new ActionRowBuilder().addComponents(name)
	const secondActionRow = new ActionRowBuilder().addComponents(pfInfo)

	modal.addComponents(firstActionRow, secondActionRow)

	await interaction.showModal(modal)
}

export async function buildNewTeams(interaction) {
	let message = interaction.reply({
		embeds: [customsBuilder([], [], [], interaction.fields.getTextInputValue('pfinfo'), interaction.fields.getTextInputValue('pfname'), 'Custom')],
		components: [rowsBuilder('Custom')],
		ephemeral: false,
		fetchReply: true
	});
	await message
	gameData[message.id] = {
		waitlist: [],
		team1: [],
		team2: [],
		style: 'Custom',
		name: interaction.fields.getTextInputValue('pfname'),
		desc: interaction.fields.getTextInputValue('pfinfo')
	}
}

export async function newRandom(interaction) {
	const modal = new ModalBuilder()
		.setCustomId('randomModal')
		.setTitle('New Randomised Scrim')
	
	const name = new TextInputBuilder()
		.setCustomId('pfname')
		.setLabel('Scrim Name')
		.setStyle(TextInputStyle.Short)
		.setPlaceholder('Name the Scrim')
		.setValue('Randomised Teams Scrim')
		.setRequired(true)

	const pfInfo = new TextInputBuilder()
		.setCustomId('pfinfo')
		.setLabel('PF Information')
		.setStyle(TextInputStyle.Paragraph)
		.setMaxLength(500)
		.setPlaceholder('Include who opens the PF and password.')
		.setRequired(false)

	const firstActionRow = new ActionRowBuilder().addComponents(name)
	const secondActionRow = new ActionRowBuilder().addComponents(pfInfo)

	modal.addComponents(firstActionRow, secondActionRow)

	await interaction.showModal(modal)
}

export async function buildNewRandom(interaction) {
	let message = interaction.reply({
		embeds: [customsBuilder([], [], [], interaction.fields.getTextInputValue('pfinfo'), interaction.fields.getTextInputValue('pfname'), 'Random')],
		components: [rowsBuilder('Random')],
		ephemeral: false,
		fetchReply: true
	});
	await message
	gameData[message.id] = {
		waitlist: [],
		team1: [],
		team2: [],
		style: 'Random',
		name: interaction.fields.getTextInputValue('pfname'),
		desc: interaction.fields.getTextInputValue('pfinfo')
	}
}

export async function join(interaction) {
	var data = {}
	if (!gameData.hasOwnProperty(interaction.message.id)) {
		data = loadStaleData(interaction)
	} else {
		data = gameData[interaction.message.id]
	}
	if (!data.waitlist.includes(interaction.user.id)) {
		data.waitlist.push(interaction.user.id)
		if (data.team1.includes(interaction.user.id)) {
			data.team1.splice(data.team1.indexOf(interaction.user.id), 1)
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
			gameData[interaction.message.id].desc,
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
			gameData[interaction.message.id].desc,
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
			gameData[interaction.message.id].desc,
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
			gameData[interaction.message.id].desc,
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
			gameData[interaction.message.id].desc,
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

export async function start(interaction) {
	var data = {}
	if (!gameData.hasOwnProperty(interaction.message.id)) {
		data = loadStaleData(interaction)
	} else {
		data = gameData[interaction.message.id]
	}

	var temp = []
	while (data.team1.length > 0) {
		temp.push(data.team1.pop())
	}
	while (data.team2.length > 0) {
		temp.push(data.team2.pop())
	}
	while (temp.length > 0 && data.team2.length < 5) {
		data.team1.push(temp.splice(Math.floor(temp.length * Math.random()), 1)[0])
		if(temp.length > 0) {
			data.team2.push(temp.splice(Math.floor(temp.length * Math.random()), 1)[0])
		}
	}
	gameData[interaction.message.id] = data
	await interaction.update({ 
		embeds: [customsBuilder(
			gameData[interaction.message.id].waitlist,
			gameData[interaction.message.id].team1,
			gameData[interaction.message.id].team2,
			gameData[interaction.message.id].desc,
			gameData[interaction.message.id].name,
			gameData[interaction.message.id].style)]
	})
}

export async function sub(interaction) {
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
			gameData[interaction.message.id].desc,
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

	const sub = new ButtonBuilder()
		.setCustomId('sub')
		.setLabel('New Teams')
		.setStyle(ButtonStyle.Primary);

	const start = new ButtonBuilder()
		.setCustomId('start')
		.setLabel('Randomise Teams')
		.setStyle(ButtonStyle.Primary);

	const remove = new ButtonBuilder()
		.setCustomId('remove')
		.setLabel('Delete')
		.setStyle(ButtonStyle.Secondary)

	const reset = new ButtonBuilder()
		.setCustomId('reset')
		.setLabel('Reset')
		.setStyle(ButtonStyle.Secondary)

	if (style == 'Random') {
		return new ActionRowBuilder()
			.addComponents(join, leave, remove, sub, start)
	} else if (style == 'Custom') {
		return new ActionRowBuilder()
			.addComponents(join1, join2, leave, remove)
	}
}

export function customsBuilder(waitlist, team1, team2, desc, name, style) {
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
		.setColor(style == 'Random' ? 0x0099FF : 0x99FF00)
		.setTitle(name)
		.setDescription(desc)
		.setTimestamp()
		.setFooter({ text: 'MateriaWolvesDen Bot' })
		.addFields(
			{ name: style, value: '\n', inline: false },
			{ name: style == 'Random' ? `Waiting ${waitlist.length}/10` : '\n', value: style == 'Random' ? w : '\n' },
			{ name: 'Team 1', value: t1, inline: true },
			{ name: 'Team 2', value: t2, inline: true }
		);
}