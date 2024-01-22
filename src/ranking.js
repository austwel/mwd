import * as fs from 'fs'
import * as canvas from '@napi-rs/canvas'
import { AttachmentBuilder } from 'discord.js'

export function getRankFromUserId(userId) {
    let data = JSON.parse(fs.readFileSync('./src/characters.json'))
    let name = getNameFromUserId(userId)
    if (name != 'not linked') {
        if (data.ranks.some(obj => obj.name === name)) {
            let char = data.ranks.find(obj => obj.name === name)
            return `${char.tier} ${char.division}`
        } else {
            return 'not ranked'
        } 
    } else {
        return 'not linked'
    }
}

export function getNameFromUserId(userId) {
    let data = JSON.parse(fs.readFileSync('./src/characters.json'))
    if (data.characters.some(obj => obj.discord === userId)) {
        return data.characters.find(obj => obj.discord === userId).name
    } else {
        return 'not linked'
    }
}

export function getRankFromCharacterName(characterName) {
    let data = JSON.parse(fs.readFileSync('./src/characters.json'))
    if (data.ranks.some(obj => obj.name === characterName)) {
        let char = data.ranks.find(obj => obj.name === characterName)
        return `${char.tier} ${char.division}`
    } else {
        return 'not ranked'
    }
}

export function getTop100() {
    return new Promise(resolve => {
    const name_lookup_regex = /(?<=<h3>)(.{1,50})(?=<\/h3>)/g
    const homeworld_lookup_regex = /(?<="Home World"><\/i>)(\S+)/g
    const image_lookup_regex = /(?<="face-wrapper">\s+<img src=")(\S+)(?=" width=)/g
    const tier_lookup_regex = /(?<=width="90" height="60" alt=")([^ ]{1,10})(?=")/g
    const points_lookup_regex = /(?<=class="points">\s+<div>\s+<p>)[0-9]+(?=<\/p>)/g
    const divisions_lookup_regex = /(?<=class="js--wolvesden-tooltip">\s+<p>)([^ ]{1,2})(?=<\/p>)/g
    const stars_lookup_regex = /(?<=class="data">)(<i>[★☆]<\/i>)*(?=<\/span>)/g
    fetch('https://na.finalfantasyxiv.com/lodestone/ranking/crystallineconflict/?dcgroup=Materia')
        .then(res => {
            res.text()
                .then(
                    data => {
                        let names = data.match(name_lookup_regex)
                        if (names == null) { names = []}
                        let homeworlds = data.match(homeworld_lookup_regex)
                        if (homeworlds == null) { homeworlds = []}
                        let images = data.match(image_lookup_regex)
                        if (images == null) { images = []}
                        let tiers = data.match(tier_lookup_regex)
                        if (tiers == null) { tiers = []}
                        let points = data.match(points_lookup_regex)
                        if (points == null) { points = []}
                        let divisions = data.match(divisions_lookup_regex)
                        if (divisions == null) { divisions = []}
                        let stars_extract = data.match(stars_lookup_regex)
                        let starss = []
                        stars_extract.forEach(stars => {
                            starss.push(stars.split('★').length - 1)
                        })
                        
                        let ret = []
                        for(let i=0;i<names.length;i++) {
                            if (tiers[i] == 'Crystal') {
                                ret.push({
                                    name: names[i].replaceAll('&#39;', "'"),
                                    homeworld: homeworlds[i],
                                    image: images[i],
                                    tier: tiers[i],
                                    points: parseInt(points[i]),
                                    division: 0,
                                    stars: 0
                                })
                            } else {
                                if (tiers[i] == undefined) {
                                    tiers[i] = 'Unranked'
                                }
                                ret.push({
                                    name: names[i].replaceAll('&#39;', "'"), 
                                    homeworld: homeworlds[i],
                                    image: images[i],
                                    tier: tiers[i],
                                    points: 0,
                                    division: parseInt(divisions[i-points.length]),
                                    stars: starss[i-points.length]
                                })
                            }
                        }
                        resolve(ret)
                    }
                )
        })
    })
}

export async function top100Image() {
    let list = await getTop100()

    const colour_map = {
        'Unranked': ["#58595c ", "#78787a", '#929292'],
        'Bronze': ["#958c6c", "#afa788", '#d7d0b4'],
        'Silver': ["#99b1b8", "#b2c7cd", "#e5f4f9"],
        'Gold': ["#d1b860",  "#e4d789", "#fbfbb9"],
        'Platinum': ["#57baa2", "#89e4d1", '#8bf2dd'],
        'Diamond': ["#00aabb", "#33cbdb", '#6df1ff'],
        'Crystal': ["#1e5cc0", "#4991ea", "#5ca8fc"],
    }

    const cvas = canvas.createCanvas(3040,1740)
    const context = cvas.getContext('2d')

    //Build Image
    canvas.GlobalFonts.registerFromPath('./src/fonts/edo.ttf', 'edo')
    canvas.GlobalFonts.registerFromPath('./src/fonts/D-DIN.otf', 'ddin')
    canvas.GlobalFonts.registerFromPath('./src/fonts/SpaceMono-Regular.ttf', 'spacemono')
    canvas.GlobalFonts.registerFromPath('./src/fonts/DMMono-Regular.ttf', 'dmmono')
    canvas.GlobalFonts.registerFromPath('./src/fonts/ChivoMono-VariableFont_wght.ttf', 'chivomono')

    context.font = '34px Ebrima';

    context.lineWidth = 0
    context.strokeStyle = '#424874'
    
    for (let i=0;i<20;i++) { //row lines
        context.beginPath()
        context.moveTo(0, i*87)
        context.lineTo(3040, i*87)
        context.closePath()
        context.stroke()
    }

    context.lineWidth = 0
    context.strokeStyle = '#424874'
    
    for (let i=0;i<5;i++) { //col lines
        context.beginPath()
        context.moveTo(i*608, 0)
        context.lineTo(i*608, 1740)
        context.closePath()
        context.stroke()
    }

    

    for (let i=0;i<100;i++) { 
        let startx = Math.floor(i/20)*608+1
        let starty = (i*87)%1740 + 1
        let h = 85;
        let w = 606;

        if (list.length <= i) {
            context.fillStyle = '#DCD6F7'
            context.fillRect(startx, starty, w, h)
            continue
        }

            

        let gradient = context.createLinearGradient(startx, 0, startx+w, 0)
        gradient.addColorStop(0, colour_map[list[i].tier][0])
        gradient.addColorStop(0.3, colour_map[list[i].tier][1])
        gradient.addColorStop(1, colour_map[list[i].tier][2])
        context.fillStyle = gradient
        context.fillRect(startx, starty, w, h)
        
        context.fillStyle = '#000000'

        //
        context.textAlign = 'center'
        let fontSize = 58
        do {
            context.font = `${fontSize -= 2}px Ebrima`
        } while (context.measureText(`${i+1}`).width > 75)
        //
        context.fillText(`${i+1}`, startx+35+((58-fontSize)/2), starty+62-((58-fontSize)/4))
        context.textAlign = 'left'

        //
        fontSize = 34
        do {
            context.font = `bold ${fontSize -= 2}px Ebrima`
        } while (context.measureText(list[i].name).width > 350)
        //
        context.fillText(list[i].name, startx + 175, starty + 40)

        context.font = 'italic 28px Ebrima';
        context.fillText(list[i].homeworld, startx + 175, starty + 70)

        if (list[i].tier == 'Crystal') {
            context.font = 'bold 32px chivomono';
            context.fillText(list[i].points.toString().padStart(4, ' '), startx + 515, starty + 55)
        } else if (list[i].tier != 'Unranked') {
            context.font = 'bold 50px chivomono';
            context.fillText(list[i].division.toString(), startx + 532, starty + 60)
        } else {
            context.font = '26px chivomono';
            context.fillText('unranked', startx + 430, starty + 70)
        }

        if (list[i].tier != 'Crystal') {
            context.font = 'bold 40px ddin';
            if (list[i].stars == 3) {
                context.fillText('*', startx+575, starty+40)
                context.fillText('*', startx+575, starty+65)
                context.fillText('*', startx+575, starty+90)
            } else if (list[i].stars == 2) {
                context.fillText('*', startx+575, starty+53)
                context.fillText('*', startx+575, starty+77)
            } else if (list[i].stars == 1) {
                context.fillText('*', startx+575, starty+65)
            }
        }
    }

    let promiseList = []
    for (const [idx, character] of list.entries()) {
        promiseList.push(new Promise(function(resolve, reject) {
            resolve(
                canvas.loadImage(character.image).then(image => {
                    context.drawImage(image, Math.floor(idx/20)*608+105, (idx*87)%1740 + 13, 60, 60)
                    context.lineWidth = 4
                    context.strokeStyle = '#17171E'
                    context.strokeRect(Math.floor(idx/20)*608+105 - 1, (idx*87)%1740 + 13 - 1, 62, 62)
                })
            )}
        ))
    }

    await Promise.all(promiseList)

    //

    const encoded = await cvas.encode('png')  
    return new AttachmentBuilder(encoded, { name: 'Top100Materia.png' })
}

export async function updateRanks() {
    await getTop100().then(list => {
        fs.readFile('./src/characters.json', (error, data) => {
            var characters = JSON.parse(data)
            list.forEach(player => {
                if (characters.ranks.some(obj => obj.name === player.name)) {
                    characters.ranks.splice(characters.ranks.findIndex(obj => obj.name === player.name), 1)
                }
                characters.ranks.push({
                    name: player.name,
                    tier: player.tier,
                    division: player.division
                })
            })
            fs.writeFile('./src/characters.json', JSON.stringify(characters), (error) => {
                if (error) {
                    console.error(error)
                }
            })
        })
    })
    
}