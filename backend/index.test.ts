import { expect, test } from 'bun:test'
import { checkColsForWinner, checkForDraw, checkRowsForWinner, checkDiagonalsForWinner } from '.'
import { Board } from './types'

test('checkForDraw', () => {
    const board1 = [
        ['X', 'O', 'X'],
        ['X', 'O', 'O'],
        ['O', 'X', 'X'],
    ] as Board
    expect(checkForDraw(board1)).toBe(true)

    const board2 = [
        ['X', 'O', 'X'],
        ['X', 'O', 'O'],
        ['O', 'X', null],
    ] as Board
    expect(checkForDraw(board2)).toBe(false)

    const board3 = [
        ['X', 'O', 'X'],
        ['X', 'O', 'O'],
        ['O', null, null],
    ] as Board
    expect(checkForDraw(board3)).toBe(false)
})

test('checkColsForWinner', () => {
    const board1 = [
        ['X', 'O', 'X'],
        ['X', 'O', 'O'],
        ['X', 'X', 'O'],
    ] as Board
    expect(checkColsForWinner(board1)).toBe('X')

    const board2 = [
        ['X', 'O', 'X'],
        ['O', 'O', 'O'],
        ['X', 'X', 'O'],
    ] as Board
    expect(checkColsForWinner(board2)).toBe(false)

    const board3 = [
        ['X', 'O', 'X'],
        ['O', 'O', 'O'],
        ['X', 'X', null],
    ] as Board
    expect(checkColsForWinner(board3)).toBe(false)

    const board4 = [
        ['O', 'O', 'O'],
        ['X', 'O', 'O'],
        ['X', 'X', 'O'],
    ] as Board
    expect(checkColsForWinner(board4)).toBe("O")
})

test('checkDiagonalsForWinner', () => {

    const board1 = [
        ['X', 'O', 'X'],
        ['O', 'X', 'O'],
        ['O', 'X', 'X'],
    ] as Board 
    expect(checkDiagonalsForWinner(board1)).toBe('X')
    
    const board2 = [
        ['X', 'O', 'X'],
        ['O', 'X', 'O'],
        ['O', 'X', null],
    ] as Board
    expect(checkDiagonalsForWinner(board2)).toBe(false)

    const board3 = [
        ['X', 'O', 'X'],
        ['O', 'X', 'O'],
        ['O', null, null],
    ] as Board
    expect(checkDiagonalsForWinner(board3)).toBe(false)

    const board4 = [
        ['O', 'O', 'X'],
        ['O', 'X', 'O'],
        ['X', 'X', null],
    ] as Board
    expect(checkDiagonalsForWinner(board4)).toBe("X")
})

test('checkRowsForWinner', () => {
    const board1 = [
        ['X', 'X', 'X'],
        ['O', 'O', null],
        [null, null, null],
    ] as Board
    expect(checkRowsForWinner(board1)).toBe('X')

    const board2 = [
        ['O', 'O', 'O'],
        ['X', 'X', null],
        [null, null, null],
    ] as Board
    expect(checkRowsForWinner(board2)).toBe('O')

    const board3 = [
        ['X', 'O', 'X'],
        ['O', 'X', 'O'],
        ['O', 'X', 'X'],
    ] as Board
    expect(checkRowsForWinner(board3)).toBe(false)
})
