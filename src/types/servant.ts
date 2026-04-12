export type NpCardType = 'buster' | 'quick' | 'arts'
export type NpTargetType = 'aoe' | 'single' | 'support'
export type AttributeType = 'sky' | 'earth' | 'human' | 'star' | 'beast'
export type GenderType = 'male' | 'female' | 'unknown'
export type ClassType =
  | 'saber' | 'archer' | 'lancer' | 'rider' | 'caster' | 'assassin'
  | 'berserker' | 'ruler' | 'avenger' | 'moonCancer' | 'alterEgo'
  | 'foreigner' | 'pretender' | 'shielder' | string

export interface SlimServant {
  id: number
  collectionNo: number
  name: string
  className: ClassType
  rarity: number
  attribute: AttributeType
  gender: GenderType
  alignment: string
  face: string
  npCard: NpCardType
  npTarget: NpTargetType
  aliases: string[]
}

export type GuessResult = 'correct' | 'wrong' | 'partial'

export interface GuessAttribute {
  value: string | number | boolean
  result: GuessResult
}

export interface GuessRow {
  servant: SlimServant
  results: {
    name: GuessAttribute
    className: GuessAttribute
    rarity: GuessAttribute
    attribute: GuessAttribute
    gender: GuessAttribute
    alignment: GuessAttribute
    npCard: GuessAttribute
    npTarget: GuessAttribute
  }
}
