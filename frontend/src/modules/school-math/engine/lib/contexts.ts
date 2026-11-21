/**
 * Story settings G1-U02 owns (EXEMPLAR §8; the cross-unit ledger, L35).
 *
 * No person names: stories use things and animals. Every count goes through `thing()`
 * (singular for 1), and every verb has a form for one and for many, so "1 more duck
 * comes" and "4 more ducks come" are both right. Two story sentences and one question,
 * each ≤ 10 words; no key-word teaching (no "altogether", no "left" as a cue word in
 * the question).
 */

import { thing, nounFor } from './text'

export interface StorySetting {
  id: string
  /** The cross-unit ledger's name for it. */
  ledgerName: string
  noun: string
  /** The drawn shape the groups carry their number on. */
  shape: string
  place: string
  join: { one: string; many: string }
  leave: { one: string; many: string }
}

export const G1U02_SETTINGS: readonly StorySetting[] = [
  { id: 'ducks', ledgerName: 'ducks on a pond', noun: 'duck', shape: 'duck', place: 'on the pond', join: { one: 'comes', many: 'come' }, leave: { one: 'swims away', many: 'swim away' } },
  { id: 'birds', ledgerName: 'birds on a fence', noun: 'bird', shape: 'bird', place: 'on the fence', join: { one: 'lands', many: 'land' }, leave: { one: 'flies away', many: 'fly away' } },
  { id: 'apples', ledgerName: 'apples in a bowl', noun: 'apple', shape: 'apple', place: 'in the bowl', join: { one: 'is put in', many: 'are put in' }, leave: { one: 'is eaten', many: 'are eaten' } },
  { id: 'boats', ledgerName: 'boats at a dock', noun: 'boat', shape: 'boat', place: 'at the dock', join: { one: 'sails in', many: 'sail in' }, leave: { one: 'sails away', many: 'sail away' } },
  { id: 'shells', ledgerName: 'shells in a bucket', noun: 'shell', shape: 'shell', place: 'in the bucket', join: { one: 'is put in', many: 'are put in' }, leave: { one: 'falls out', many: 'fall out' } },
  { id: 'fish', ledgerName: 'fish in a tank', noun: 'fish', shape: 'fish', place: 'in the tank', join: { one: 'is put in', many: 'are put in' }, leave: { one: 'is taken out', many: 'are taken out' } },
  { id: 'stickers', ledgerName: 'stickers on a page', noun: 'sticker', shape: 'sticker', place: 'on the page', join: { one: 'is stuck on', many: 'are stuck on' }, leave: { one: 'is peeled off', many: 'are peeled off' } },
  { id: 'balloons', ledgerName: 'balloons at a party', noun: 'balloon', shape: 'balloon', place: 'at the party', join: { one: 'is blown up', many: 'are blown up' }, leave: { one: 'pops', many: 'pop' } },
]

export function getSetting(id: string): StorySetting {
  const s = G1U02_SETTINGS.find((x) => x.id === id)
  if (!s) throw new Error(`unknown story setting ${id}`)
  return s
}

const isAre = (n: number) => (n === 1 ? 'is' : 'are')

/** "There are 6 ducks on the pond." */
export function thereAre(s: StorySetting, n: number): string {
  return `There ${isAre(n)} ${thing(n, s.noun)} ${s.place}.`
}

/** "4 more ducks come." */
export function moreCome(s: StorySetting, n: number): string {
  return `${n} more ${nounFor(n, s.noun)} ${n === 1 ? s.join.one : s.join.many}.`
}

/** "2 ducks swim away." */
export function someLeave(s: StorySetting, n: number): string {
  return `${thing(n, s.noun)} ${n === 1 ? s.leave.one : s.leave.many}.`
}

/** "How many ducks are on the pond now?" */
export function howManyNow(s: StorySetting): string {
  return `How many ${nounFor(2, s.noun)} are ${s.place} now?`
}

export function joinStory(s: StorySetting, a: number, b: number): string {
  return `${thereAre(s, a)} ${moreCome(s, b)} ${howManyNow(s)}`
}

export function takeawayStory(s: StorySetting, w: number, p: number): string {
  return `${thereAre(s, w)} ${someLeave(s, p)} ${howManyNow(s)}`
}
