/*******************************************************************************
 * SPEC
 *******************************************************************************
 * On a grid of 7w x 6h, players take turns dropping tokens into the grid.
 *
 * Only the bottom cell in each column is selectable
 *
 * The game ends when one player has four connecting cells, or ends in a draw
 * when the board is completely filled
 *    - optimization: end in draw before board is filled if there are no winning
 *      combos
 *
 * STEPS:
 * - generate grid ✅
 * - add logic to play turn (any cell) ✅
 * - add logic to determine playable cells (gravity + not-selected) ✅
 * - add logic to determine game status (win) ✅
 * - add logic to determin game status (draw) ✅
 *
 ******************************************************************************/

import React, { useReducer } from 'react'

//------------------------------------------------------------------------------
// TYPES
//------------------------------------------------------------------------------
type Player = 'X' | 'O'
type Cell = Player | null
type Matrix<T> = T[][]
type Grid = Matrix<Cell>
type Status = 'playing' | 'win' | 'draw'
interface State {
  grid: Grid
  player: Player
  error?: string
  status: Status
}
type Action = { type: 'turn'; coord: [number, number] } | { type: 'reset' }

const GRID_HEIGHT = 6
const GRID_WIDTH = 7

const generateGrid = (height = GRID_HEIGHT, width = GRID_WIDTH): Grid => {
  const createRow = () => Array.from({ length: width }, () => null)
  const rows = Array.from({ length: height }, createRow)
  return rows
}

const initializeState = (): State => ({
  grid: generateGrid(),
  player: 'X',
  error: undefined,
  status: 'playing',
})

const validateMove = (grid: Grid, x: number, y: number): boolean => {
  const value = grid[y][x]
  if (value) return false
  const isBottom = y === grid.length - 1
  const cellBelow = Boolean(grid[y + 1]?.[x])
  return isBottom || cellBelow
}

const determineIfWinningMove = (
  grid: Grid,
  x: number,
  y: number,
  player: Player
): boolean => {
  // loop the matrix size?
  const value = grid[y][x]
  let v: string = player
  let h: string = player
  let d1: string = player
  let d2: string = player

  // start at index
  // spread outward
  // add item to front and back
  for (let i = 1; i < 4; i++) {
    const belowIndex = y - i
    const aboveIndex = y + i
    const leftIndex = x - i
    const rightIndex = x + i

    const hasBelow = belowIndex >= 0
    const hasAbove = aboveIndex < grid.length
    const hasLeft = leftIndex >= 0
    const hasRight = rightIndex < grid.length

    // v line
    if (hasBelow) v = grid[belowIndex][x] + v
    if (hasAbove) v += grid[aboveIndex][x]

    // h line
    if (hasLeft) h = grid[y][leftIndex] + h
    if (hasRight) h += grid[y][rightIndex]

    // d1 line
    if (hasBelow && hasLeft) d1 = grid[belowIndex][leftIndex] + d1
    if (hasAbove && hasRight) d1 += grid[aboveIndex][rightIndex]

    // d2 line
    if (hasAbove && hasLeft) d2 = grid[aboveIndex][leftIndex] + d2
    if (hasBelow && hasRight) d2 += grid[belowIndex][rightIndex]
  }

  const splitAggregate = (line: string) => {
    const otherPlayer = player === 'X' ? 'O' : 'X'
    const match = new RegExp(`null|${otherPlayer}`)
    return line.split(match).filter((x) => x)
  }

  const isWin = [v, h, d1, d2].some((line) => {
    return splitAggregate(line).some((x) => x.length === 4)
  })

  return isWin
}

const reducer = (state: State, action: Action): State => {
  if (action.type === 'turn') {
    const { player } = state
    const [x, y] = action.coord
    const grid = JSON.parse(JSON.stringify(state.grid))

    if (!validateMove(grid, x, y)) {
      return {
        ...state,
        error: 'Invalid move 😱',
      }
    }

    grid[y][x] = player

    const isWin = determineIfWinningMove(grid, x, y, player)

    if (isWin) {
      return {
        ...state,
        grid,
        error: undefined,
        status: 'win',
      }
    }

    let isDraw = true
    for (const col of grid) {
      for (const row of col) {
        if (row === null) {
          isDraw = false
          break
        }
      }
    }

    if (isDraw) {
      return {
        ...state,
        grid,
        error: undefined,
        status: 'draw',
      }
    }

    return {
      ...state,
      grid,
      player: player === 'X' ? 'O' : 'X',
      error: undefined,
    }
  }

  if (action.type === 'reset') {
    return initializeState()
  }
  return state
}

const ConnectFour = () => {
  const [state, dispatch] = useReducer(reducer, initializeState())

  return (
    <>
      <div style={{ color: 'red' }}>{state.error}</div>
      <button onClick={() => dispatch({ type: 'reset' })}>restart</button>

      {state.status === 'playing' && <div>{state.player}'s turn</div>}
      {state.status === 'draw' && <div>Draw!</div>}
      {state.status === 'win' && <div>{state.player} wins</div>}

      <div
        style={{
          display: 'inline-grid',
          gridTemplateColumns: `repeat(${GRID_WIDTH}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_HEIGHT}, 1fr)`,
        }}
      >
        {state.grid.map((row, y) => {
          return row.map((value, x) => {
            const isPlaying = state.status === 'playing'
            const isPlayable = validateMove(state.grid, x, y)
            const accessibleValue = value !== null ? value : 'empty'
            return (
              <button
                data-testid={`Cell-${y}-${x}-${value}`}
                aria-label={`Cell at column ${y} and row ${x} is ${accessibleValue}`}
                key={[x, y].join(',')}
                disabled={!isPlaying || !isPlayable}
                style={{ height: 60, width: 60, color: 'black' }}
                onClick={() => dispatch({ type: 'turn', coord: [x, y] })}
              >
                {value}
              </button>
            )
          })
        })}
      </div>
    </>
  )
}

export default ConnectFour
