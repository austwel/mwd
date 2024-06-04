import { getTimers } from "./db/mysql.js"

export function updateCC(client, channel) {
    try {
        const cc_schedule = ['Palaistra → VH', 'Volcanic → CC', 'Clockwork → PL', 'Palaistra → C9', 'Cloud Nine → RS', 'Red Sands → PL']
        let current_timestamp = Date.now()
        let now = Math.floor((current_timestamp % 32400000)/5400000) //Which map
        let into_map = Math.round(Math.floor((current_timestamp % 5400000)/60000)/5)*5 //Minutes into map

        console.log(`${new Date(current_timestamp).getHours()}:${new Date(current_timestamp).getMinutes()} Updating ${channel} - ${cc_schedule[now]} (${90-into_map}m)`)
        client.channels.fetch(channel).then(chn => chn.setName(`${cc_schedule[now]} (${90-into_map}m)`))
    } catch (error) {
        console.error(error)
    }
}

export function updateFL(client, channel) {
    try {
        const fl_schedule = ['Shatter → Onsal', 'Onsal → Seal Rock', 'Seal Rock → Shatter']
        let current_timestamp = Date.now()
        let day = Math.floor(((current_timestamp - 54000000) % 259200000)/86400000) //Which map
        let into_day = Math.floor(((current_timestamp - 54000000) % 86400000)/3600000) //Hours into map
    
        console.log(`${new Date(current_timestamp).getHours()}:${new Date(current_timestamp).getMinutes()} Updating ${channel} - ${fl_schedule[day]}`)
        client.channels.fetch(channel).then(chn => chn.setName(`${fl_schedule[day]}`))
    } catch (error) {
        console.error(error)
    }
}

export async function startTimers(client) {
    let timers = await getTimers()
    timers.forEach(timer => {
        if (timer.type == 'cc') {
            updateCC(client, timer.channel_id)
            setInterval(updateCC, 600000, client, timer.channel_id)
        } else if (timer.type == 'fl') {
            updateFL(client, timer.channel_id)
            setInterval(updateFL, 6000000, client, timer.channel_id)
        }
    });
}