import {createSignal} from '@react-rxjs/utils'
import {bind} from '@react-rxjs/core'
import {
    interval,
    of,
    repeat,
    startWith,
    switchMap,
    map,
    from,
    tap,
    toArray,
    filter,
    pairwise,
    scan,
    merge,
    BehaviorSubject
} from 'rxjs';
import {colours, createTile, randPosition} from './Tile';

export const [startGame$, setStartGame] = createSignal()
export const [endGame$, setEndGame] = createSignal<number>()
const pointKeeper$ = new BehaviorSubject<number>(0);

const points$ = startGame$.pipe(
    switchMap(() => {
        return pointKeeper$.pipe(
            scan((previous) => previous + 10)
        );
    }),
    startWith(0)
)

const timeElapsed$ = interval(1000)

const startTimeElapsed$ = merge(startGame$, endGame$).pipe(
    switchMap((a) => {
        if (a) {
            return of(a)
        }
        return timeElapsed$
    }),
    startWith(0)
)

/*const startTimeElapsed$ = merge(startGame$, endGame$).pipe(
    switchMap((start, end) => {
        if (end) {
            return of(0)
        }
        return timeElapsed$
    }),
    startWith(0),
)*/

export const [tileClicked$, setTileClicked] = createSignal<{id: string, colour: typeof colours[number]} | null>()

const createTiles$ = from(colours).pipe(
    map((colour) => {
        return createTile(colour)
    }),
    repeat(2),
    toArray(),
)

const sequenceOfClickedTiles$ = tileClicked$.pipe(
    map((t) => {
        return t?.colour ?? null
    }),
    pairwise(),
    startWith([null, null]),
)

const tileKillList$ = startGame$.pipe(
    switchMap(() => {
        return sequenceOfClickedTiles$.pipe(
            map((a) => {
                if (a.filter(h => !!h).length === 2) {
                    if (a[0] === a[1]) {
                        pointKeeper$.next(10)
                        return a[0] as string
                    }
                }
                return ''
            }),
            scan((a, c) => [...a, c], [] as string[]),
            filter(a => !!a)
        )
    }),
    startWith([] as string[])
)

const startTileCreation$ = startGame$.pipe(
    switchMap(() => {
        return createTiles$
    }),
    startWith(null)
)

export const reposition$ = startTimeElapsed$.pipe(
    tap(() => {
        const tiles = document.querySelectorAll('.tile')
        if (tiles.length) {
            const random = Math.floor(Math.random() * tiles.length)
            const t = tiles[random] as HTMLElement
            t.style.top = `${randPosition()}px`
            t.style.left = `${randPosition()}px`
        }
    })
)

export const [useStartTimeElapsed] = bind(startTimeElapsed$)
export const [useCreateTiles] = bind(startTileCreation$)
export const [useClickedTiles] = bind(tileKillList$)
export const [useEndGame] = bind(startGame$.pipe(
    switchMap(() => {
       return endGame$.pipe(
           startWith(null)
       )
    }),
    startWith(null)
))
export const [usePoints] = bind(points$)

reposition$.subscribe()
