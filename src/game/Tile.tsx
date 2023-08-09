import {FC, useState} from 'react';
import {setTileClicked} from './state';

export const colours = [
    'aqua',
    'yellow',
    'rebeccapurple',
    'pink',
    'red',
    'beige'
]

export const randPosition = () => Math.floor(Math.random() * 380)

let counter = 0
const setCounter = () => {
    counter = counter + 1
    return counter
}

const Tile: FC<{ colour:string }> = ({colour}) => {
    const c = setCounter()

    const [isSelected, toggleIsSelected] = useState(false)

    return <div onClick={() => {
        toggleIsSelected((prevState) => {
            setTileClicked(!prevState ? {
                colour,
                id: `tile-${c}`
            } : null)
            return !prevState
        })

    }} key={c} data-id={`tile-${c}`} className="tile" style={{
        position: 'absolute',
        top: randPosition(),
        left: randPosition(),
        width: 20,
        height: 20,
        backgroundColor: colour,
        cursor: 'pointer',
        border: isSelected ? '1px solid white' : '0'
    }}></div>
}

export const createTile: (colour: typeof colours[number]) => JSX.Element = (colour: typeof colours[number]) => {
    return <Tile colour={colour} key={Math.random() * 1000000}/>
}
