import type { Player } from './types'

export interface ResolveResult {
  counts: Record<string, number>
  /** Index of the next player who still needs a manual dial pick, or players.length if all are settled. */
  nextIndex: number
}

function sumBefore(players: Player[], counts: Record<string, number>, index: number): number {
  let sum = 0
  for (let i = 0; i < index; i++) {
    sum += counts[players[i].id] ?? 0
  }
  return sum
}

/**
 * A player's count is "forced" (no dial needed) when they are the last
 * player — whatever's left must be theirs — or when nothing is left to
 * distribute. This walks forward from `startIndex`, auto-assigning every
 * forced player, and stops at the first player who still needs a real pick.
 */
export function resolveForcedPlayers(
  players: Player[],
  maxTotal: number,
  counts: Record<string, number>,
  startIndex: number,
): ResolveResult {
  const next = { ...counts }
  let index = startIndex

  while (index < players.length) {
    const remaining = maxTotal - sumBefore(players, next, index)
    const isLast = index === players.length - 1

    if (isLast) {
      next[players[index].id] = remaining
      index += 1
      continue
    }
    if (remaining === 0) {
      next[players[index].id] = 0
      index += 1
      continue
    }
    break
  }

  return { counts: next, nextIndex: index }
}

/** The highest player index whose count required an actual dial pick, or -1 if none did. */
export function lastManualIndex(
  players: Player[],
  maxTotal: number,
  counts: Record<string, number>,
): number {
  let manual = -1
  for (let index = 0; index < players.length; index++) {
    const remaining = maxTotal - sumBefore(players, counts, index)
    const isLast = index === players.length - 1
    const forced = isLast || remaining === 0
    if (!forced) manual = index
  }
  return manual
}

export function remainingAt(players: Player[], maxTotal: number, counts: Record<string, number>, index: number) {
  return maxTotal - sumBefore(players, counts, index)
}
