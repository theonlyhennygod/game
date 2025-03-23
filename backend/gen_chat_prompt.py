from ai21 import AI21Client
from ai21.models.chat import ChatMessage
import json
import random
import sys

def parse_json(json_str):
    # Remove the Markdown code block markers
    lines = json_str.splitlines()
    
    # Remove the first line if it starts with ```
    if lines and lines[0].startswith("```"):
        lines = lines[1:]
    
    # Remove the last line if it starts with ```
    if lines and lines[-1].startswith("```"):
        lines = lines[:-1]
    
    # Join the remaining lines into a clean JSON string
    clean_json_str = "\n".join(lines)
    
    # Parse the clean JSON string
    try:
        data = json.loads(clean_json_str)
        return data
        # print("Parsed JSON successfully!")
        # print("Effectiveness of move 1:", data["effectiveness_1"])
        # print("Damage of move 1:", data["damage_1"])
        # print("Narrative for move 1:", data["narrative_1"])
        # print("Summary:", data["summary"])
    except:
        return None
    
def generate_battle_messages(player1, player2, state, move_key1, move_key2):
    # Build Player1's context and move details
    p1_context = f"Name: {player1['name']}\nPersona: {player1['persona']}\nHP: {player1['hp']}"
    move1 = player1[move_key1]
    move1_info = f"Name: {move1['name']}\nDescription: {move1['description']}\nDamage: {move1['dmg']}"
    
    # Build Player2's context and move details
    p2_context = f"Name: {player2['name']}\nPersona: {player2['persona']}\nHP: {player2['hp']}"
    move2 = player2[move_key2]
    move2_info = f"Name: {move2['name']}\nDescription: {move2['description']}\nDamage: {move2['dmg']}"
    
    # Define the system prompt (overall instructions)
    system_prompt = (
        "You are an immersive battle simulator, similar to Pokémon battles but adapted for a variety "
        "of imaginative scenarios and characters.\n\n"
        "There are two combatants: Player1 and Player2. Each has chosen one unique move for this round. "
        "Your task is to vividly narrate the battle, clearly explaining how each player's chosen move impacts their opponent.\n\n"
        "Each move has an effectiveness score ranging from 0 to 200 (inclusive):\n\n"
        "An effectiveness of 0 indicates a complete miss or failure, causing no damage.\n\n"
        "An effectiveness of 200 represents maximum damage and optimal impact.\n\n"
        "Provide detailed context and storytelling that incorporates each player's background, chosen moves, "
        "and the resulting effectiveness. Consider effects from the previous round when determining effectiveness. Clearly illustrate the dynamics and drama of the exchange."
    )
    
    # Define the user prompt (combatants' details and move choices)
    user_prompt = (
        f"Context for Player1:\n{p1_context}\n"
        f"Move chosen by Player1:\n{move1_info}\n\n"
        f"Context for Player2:\n{p2_context}\n"
        f"Move chosen by Player2:\n{move2_info}\n\n"
        f"Effects from the previous round:\n{state}\n\n"
        "Narrate the consequences of each player's move and describe how each player is affected. "
        "If either player's health falls below 0, declare the other player the victor and conclude with a compelling "
        '''and dramatic story about their triumph. Your response must follow the format
        {{
           "effectiveness_1": effectiveness of move chosen by Player1,
           "damage_1": damage done by Player1's move to Player2,
           "narrative_1": your narration of Player1's move,
           "effectiveness_2": effectiveness of move chosen by Player2,
           "damage_2": damage done by Player2's move to Player1,
           "narrative_2": your narration of Player2's move,
           "summary": summary of the effects from this round that may affect effectiveness in the next round. Do not include HP of players.
        }}
        '''
    )
    
    # Return the messages as a list of dictionaries
    return [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]

def upd_players_and_state(p1, p2, out_json):
    p1['hp'] = p1['hp'] - out_json['damage_2']
    p2['hp'] = p2['hp'] - out_json['damage_1']
    alive = True
    if p1['hp'] <= 0 or p2['hp'] <= 0:
        alive = False
    return p1, p2, out_json['summary'], alive

KEY = 'v7uBaXL8sXKB4SmHsrxIOa14sYsWPcT9'

client = AI21Client(api_key=KEY)  # or pass it in directly

# Example usage:
p1 = {'name': 'Elon Musk',
      'persona': 'Elon Musk is an innovative and unpredictable entrepreneur whose ideas spark both inspiration and controversy. '
                 'Known for his audacity and charisma, Musk specializes in electric energy, futuristic technology, and social media storms. '
                 'He excels in surprising his opponents with unconventional tactics and rapid innovation.',
      'hp': 160,
      'move_1': {'name': 'Falcon Punch', 'description': 'Launches a rocket-powered punch, dealing electric damage.', 'dmg': 45},
      'move_2': {'name': 'Tweet Storm', 'description': 'Confuses the opponent with controversial tweets, temporarily reducing accuracy.', 'dmg': 30},
      'move_3': {'name': 'Neural Net', 'description': 'Deploys AI to predict opponent’s moves, slightly boosting his own evasion.', 'dmg': 25},
      'move_4': {'name': 'Hyperloop Dash', 'description': 'Quickly strikes with immense speed, dealing significant damage.', 'dmg': 40},
      }

p2 = {'name': 'Harry Potter',
      'persona': 'Harry Potter, the brave wizard famed for his resilience and mastery of magic, wields powerful spells and enchantments. '
                 'Known for his bravery and quick thinking, Harry thrives under pressure and can summon extraordinary powers to defeat his foes.',
      'hp': 150,
      'move_1': {'name': 'Expelliarmus', 'description': 'Disarms and stuns the opponent briefly, limiting their next attack.', 'dmg': 35},
      'move_2': {'name': 'Patronus Charm', 'description': 'Summons a protective Patronus to absorb incoming damage.', 'dmg': 30},
      'move_3': {'name': 'Stupefy', 'description': 'Temporarily stuns the opponent, causing moderate magical damage.', 'dmg': 40},
      'move_4': {'name': 'Sectumsempra', 'description': 'Inflicts deep wounds, causing heavy magical damage.', 'dmg': 45},
      }

state = 'None'
moves = ['move_1', 'move_2', 'move_3', 'move_4']
round_number = 1
both_alive = True

while both_alive:
    
    move_1 = random.choice(moves)
    move_2 = random.choice(moves)
    
    got_json = False
    
    try_count = 0
    while not got_json:
        messages = generate_battle_messages(p1, p2, state, move_1, move_2)
        response = client.chat.completions.create(
            model='jamba-large',
            messages=[ChatMessage(role='system', content=messages[0]['content']),
                      ChatMessage(role='user', content=messages[1]['content'])],
            temperature=0.7
            )
        out = response.choices[0].message.content
        narrative_json = parse_json(out.strip())
        if narrative_json is not None:
            got_json = True
        else:
            try_count += 1
            if try_count >= 50:
                sys.exit('GOT SUTCK :(')
    
    print(f'\n\n============= Round {round_number} =============\n\n')
    
    p1, p2, state, both_alive = upd_players_and_state(p1, p2, narrative_json)
    
    print(out)
    round_number += 1

print('\n\n============= RESULT =============\n\n')
if p1['hp'] > 0 and p1['hp'] <= 0:
    print(f"{p1['name']} won!")
elif p1['hp'] <= 0 and p1['hp'] > 0:
    print(f"{p2['name']} won!")
else:
    print('It is a TIE')