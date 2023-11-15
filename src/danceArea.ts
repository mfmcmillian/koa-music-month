import {triggerEmote} from "~system/RestrictedActions"


let danceTimer = 2
const length = 11

const routines: string[] = [
    'robot',
    'tik',
    'tektonik',
    'hammer',
    'handsair',
    'disco',
]

export function danceSystem(dt: number) {
    if (danceTimer > 0) {
        danceTimer -= dt
    } else {
        danceTimer = length
        triggerRandomEmote()
    }
}

export function triggerRandomEmote() {
    let rand = Math.floor(Math.random() * (routines.length))
    triggerEmote({predefinedEmote: routines[rand]})
}
