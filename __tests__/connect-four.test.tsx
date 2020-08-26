import React from 'react'
import ConnectFour from '../pages/connect-four'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

test('should initialize the game', () => {
  render(<ConnectFour />)

  expect(screen.getByText("X's turn")).toBeInTheDocument()

  const allCells = screen.getAllByTestId('Cell-', { exact: false })
  expect(allCells).toHaveLength(6 * 7)

  for (const cell of allCells) {
    // all values should be `null`
    expect(cell.dataset.testid).toMatch(/Cell-\d-\d-null/)
  }
})

test('should swap players & update the grid when playing a turn', () => {
  render(<ConnectFour />)
  expect(screen.getByText("X's turn")).toBeInTheDocument()
  fireEvent.click(screen.getByTestId('Cell-5-1-null'))
  expect(screen.getByTestId('Cell-5-1-X')).toBeInTheDocument()
  expect(screen.getByText("O's turn")).toBeInTheDocument()
})

test.todo('should only allow cells at the bottom of each column to be playable')

test.todo('should win the game if 4 vertical tiles are the same')

test.todo('should win the game if 4 horizontal tiles are the same')

test.todo(
  'should win the game if 4 diagonal tiles (bottom left to top right) are the same'
)

test.todo(
  'should win the game if 4 diagonal tiles (top left to bottom right) are the same'
)

test.todo(
  'should end in a draw if all tiles are filled and 4 are not connected'
)
