import json
import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_battle_query(topic="rappers in 2025"):
    """
    Creates a query for ChatGPT to generate a battle simulation based on a given topic
    
    Args:
        topic (str): The topic for the battle simulation (default: "rappers in 2025")
        
    Returns:
        str: The formatted query string
    """
    # Using triple quotes with f-string and doubled curly braces to escape them
    query = f"""The topic is: "{topic}" Use the web results as context. Identify 2 characters to simulate interactions. Each character has an HP total ranging from 1- 500. 4 moves with damage ranging from 1-150, and a character summary describing its strengths and weaknesses. Select a background that they would battle in. Format the response in a JSON in the following format: 
    {{
        "Character 1": {{
            "Name": "****",
            "HP": "****",
            "Character_Summary": "*Summarize the important points of the character with strengths and weaknesses",
            "Moves": {{
                "Move_1": {{
                    "Move_name": "****",
                    "Description": "****",
                    "Damage": "****"
                }},
                "Move_2": {{
                    "Move_name": "****",
                    "Description": "****",
                    "Damage": "****"
                }},
                "Move_3": {{
                    "Move_name": "****",
                    "Description": "****",
                    "Damage": "****"
                }},
                "Move_4": {{
                    "Move_name": "****",
                    "Description": "****",
                    "Damage": "****"
                }}
            }}
        }},
        "Character 2": {{
            "Name": "****",
            "HP": "****",
            "Character_Summary": "*Summarize the important points of the character with strengths and weaknesses",
            "Moves": {{
                "Move_1": {{
                    "Move_name": "****",
                    "Description": "****",
                    "Damage": "****"
                }},
                "Move_2": {{
                    "Move_name": "****",
                    "Description": "****",
                    "Damage": "****"
                }},
                "Move_3": {{
                    "Move_name": "****",
                    "Description": "****",
                    "Damage": "****"
                }},
                "Move_4": {{
                    "Move_name": "****",
                    "Description": "****",
                    "Damage": "****"
                }}
            }}
        }},
        "Background" : "****"
    }}"""
    
    return query

def query_chatgpt(prompt):
    """
    Sends a query to the ChatGPT API and returns the response
    """
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        raise ValueError("No OpenAI API key found. Set the OPENAI_API_KEY environment variable.")
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    data = {
        "model": "gpt-4-turbo",  # or another model like "gpt-3.5-turbo"
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "temperature": 0.7,
        "max_tokens": 2000
    }
    
    response = requests.post(
        "https://api.openai.com/v1/chat/completions",
        headers=headers,
        json=data
    )
    
    if response.status_code != 200:
        raise Exception(f"Error: {response.status_code}, {response.text}")
    
    return response.json()

def save_to_file(data, filename="battle.json"):
    """
    Saves the response to a JSON file
    """
    # Extract the message content
    content = data['choices'][0]['message']['content']
    
    # Try to find and parse the JSON part of the response
    try:
        # Look for JSON structure in the response
        json_start = content.find('{')
        json_end = content.rfind('}') + 1
        
        if json_start >= 0 and json_end > json_start:
            json_str = content[json_start:json_end]
            battle_data = json.loads(json_str)
            
            with open(filename, 'w') as f:
                json.dump(battle_data, f, indent=4)
            
            print(f"Battle data saved to {filename}")
        else:
            raise ValueError("No JSON found in the response")
            
    except json.JSONDecodeError:
        print("Could not parse JSON from response. Saving raw response.")
        with open(filename, 'w') as f:
            f.write(content)

def main():
    """
    Main function to run the battle simulation query
    """
    try:
        # Get the topic from user input (with a default if none provided)
        topic = input("Enter a topic for the battle (or press Enter for default 'rappers in 2025'): ").strip()
        if not topic:
            topic = "rappers in 2025"
        
        # Create the query with the specified topic
        query = create_battle_query(topic)
        
        # Send the query to ChatGPT
        print("Sending query to ChatGPT...")
        response = query_chatgpt(query)
        
        # Create a filename based on the topic
        filename = f"{topic.replace(' ', '_').lower()}_battle.json"
        
        # Save the response to a file
        save_to_file(response, filename)
        
        # Print confirmation
        print(f"{topic} battle data generated successfully!")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()