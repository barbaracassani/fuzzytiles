import {
    setEndGame,
    setStartGame,
    useClickedTiles,
    useCreateTiles,
    useEndGame, usePoints,
    useStartTimeElapsed
} from './state';
import {useEffect} from 'react';

export const Container = () => {
    // naughty hack...
    const timeElapsed = useStartTimeElapsed()
    const points = usePoints()
    let tiles = useCreateTiles()
    const tilesKillList = useClickedTiles()
    tiles = tiles?.filter((t) => {
        return !tilesKillList.includes(t.props.colour)
    }) ?? []
    const endGame = useEndGame()
    useEffect(() => {
        if (timeElapsed && !tiles?.length) {
            setEndGame(points * 10 - timeElapsed)
        }
    }, [tiles.length])
    return <div id="container">
        {endGame ? <div>Final score taking time into account: {endGame}</div> : <div style={{
            width: 400,
            height: 400,
            backgroundColor: 'black',
            position: 'relative'
        }}> {tiles} </div> }
        <div id="controls">
            <button onClick={() => {
                setStartGame()
            }}>start</button>
            {!endGame && <> <div id="timeElapsed">Time elapsed: {timeElapsed}</div>
            <div id="points">Points: {points}</div> </>}
        </div>
    </div>
}
