import React, { useReducer, ReactNode } from 'react'

type Player = 'X' | 'O'
type Cell = Player | null
type Status = 'playing' | 'win' | 'draw' | 'init'
type Grid = Cell[][]

interface State {
  size: number
  grid: Grid
  player: Player
  status: Status
}

type Action =
  | { type: 'turn'; value: Player; coord: [number, number] }
  | { type: 'reset' }
  | { type: 'resize'; size: number }

// Generate a tic tac toe grid
const createGrid = (size: number) => {
  const rows = Array.from({ length: size })
  return rows.map(() => Array.from({ length: size }, (x) => null))
}

// start up the entire state
const initializeState = (gridSize = 3): State => {
  let appliedGridSize = gridSize

  // enforce a minimum of 3
  if (gridSize < 3) appliedGridSize = 3

  return {
    size: appliedGridSize,
    grid: createGrid(appliedGridSize),
    player: 'X',
    status: 'init',
  }
}

const doCellsMatch = (cells: Cell[]) => {
  let value = null
  for (const cell of cells) {
    if (!cell) return false
    if (!value) value = cell
    if (cell !== value) return false
  }

  return true
}

const determineGameStatus = (grid: Grid): Status => {
  const firstRow = grid[0]
  const verticalLines: Cell[][] = []
  const horizontalLines: Cell[][] = []
  const diagonalLines: Cell[][] = []

  firstRow.forEach((col, x) => {
    const line: Cell[] = []
    grid.forEach((row, y) => {
      const value = grid[y][x]

      line.push(value)
    })

    verticalLines.push(line)
  })

  grid.forEach((row) => horizontalLines.push(row))

  type Direction = 'forward' | 'backward'
  const determineDiagonal = (
    start: number,
    direction: Direction = 'forward'
  ) => {
    let x = start
    const line: Cell[] = []

    grid.forEach((_, y) => {
      const value = grid[y][x]
      line.push(value)

      if (direction === 'forward') x++
      if (direction === 'backward') x--
    })

    diagonalLines.push(line)
  }

  determineDiagonal(0, 'forward')
  determineDiagonal(grid.length - 1, 'backward')

  let cells: Cell[] = []
  for (const row of grid) {
    cells = cells.concat(row)
  }

  const lines = [...verticalLines, ...horizontalLines, ...diagonalLines]

  for (const line of lines) {
    if (doCellsMatch(line)) return 'win'
  }

  const isDraw = cells.every((cell) => cell !== null)
  if (isDraw) return 'draw'

  return 'playing'
}

interface CellProps {
  disabled?: boolean
  children: ReactNode
  onClick: () => void
}

const CellButton = ({ disabled = false, onClick, children }: CellProps) => {
  let styles = {
    height: 40,
    width: 40,
    backgroundColor: '#efefef',
    color: 'black',
  }

  return (
    <button disabled={disabled} onClick={onClick} style={styles}>
      {children}
    </button>
  )
}

const TicTacToe = () => {
  const [state, dispatch] = useReducer(
    (state: State, action: Action): State => {
      switch (action.type) {
        case 'resize': {
          if (state.status === 'playing') return state
          return initializeState(action.size)
        }
        case 'turn': {
          const grid = JSON.parse(JSON.stringify(state.grid))
          const { value, coord } = action
          const [x, y] = coord

          grid[y][x] = value

          const status = determineGameStatus(grid)

          if (status === 'win') {
            return {
              ...state,
              grid,
              status,
              player: state.player,
            }
          }

          return {
            ...state,
            grid,
            player: state.player === 'X' ? 'O' : 'X',
            status,
          }
        }
        case 'reset':
          return initializeState()
        default:
          throw new Error('invalid reducer action')
      }
    },
    initializeState()
  )

  return (
    <div style={{ padding: 20 }}>
      <div style={{ paddingTop: 20, paddingBottom: 20 }}>
        <button onClick={() => dispatch({ type: 'reset' })}>reset</button>

        <label style={{ display: 'block' }}>
          size:
          <br />
          <input
            value={state.size}
            type="number"
            onChange={(ev) =>
              dispatch({ type: 'resize', size: Number(ev.target.value) })
            }
          />
        </label>

        <span>
          {state.status === 'playing' ? `${state.player}'s turn` : null}
          {state.status === 'win' ? `${state.player} wins!` : null}
          {state.status === 'draw' ? `Draw` : null}
        </span>
      </div>

      <div
        style={{
          display: 'inline-grid',
          gridTemplateColumns: `repeat(${state.size}, 1fr)`,
          gridTemplateRows: `repeat(${state.size}, 1fr)`,
        }}
      >
        {state.grid.map((row, y) => {
          return row.map((value, x) => (
            <CellButton
              key={[x, y].join('_')}
              disabled={value !== null || state.status === 'win'}
              onClick={() =>
                dispatch({ type: 'turn', coord: [x, y], value: state.player })
              }
            >
              {value}
            </CellButton>
          ))
        })}
      </div>
    </div>
  )
}

export default TicTacToe
