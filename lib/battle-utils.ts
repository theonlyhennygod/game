// First, let's create the types
interface BattleMove {
  name: string;
  description: string;
  dmg: number;
}

interface Player {
  name: string;
  persona: string;
  hp: number;
  [key: string]: any; // For additional move properties
}

interface BattleResponse {
  effectiveness_1: number;
  damage_1: number;
  narrative_1: string;
  effectiveness_2: number;
  damage_2: number;
  narrative_2: string;
  summary: string;
}

export async function generateBattleMessages(
  player1: Player,
  player2: Player,
  state: string,
  move1: BattleMove,
  move2: BattleMove
) {
  try {
    const response = await fetch('/api/battle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        player1,
        player2,
        state,
        move1,
        move2
      })
    });

    const data: BattleResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating battle messages:', error);
    throw error;
  }
} 