from ai21 import AI21Client
import json
import os
from dotenv import load_dotenv
import re

# Load environment variables
load_dotenv()


client = AI21Client(api_key=os.getenv('AI21_API_KEY'))


def create_battle_query(topic="rappers in 2025"):
    """
    Creates a query for ChatGPT to generate a battle simulation based on a given topic

    Args:
        topic (str): The topic for the battle simulation (default: "rappers in 2025")

    Returns:
        str: The formatted query string
    """
    # Using triple quotes without f-string to avoid escaping curly braces
    query = f"""You are a game master, and your job is to first gather all the information on the topic from the web and then use that information to identify 2 "potential players" to simulate interactions. Each "potential player" has an HP total ranging from 1- 999. 4 moves with damage ranging from 1-500, and a character summary describing its strengths and weaknesses. Select a background that they would battle in. Make sure to give a JSON response with the topic and its context.

Topic: {topic} """

    return query


def query_maestro(prompt):
    """
    Sends a query to the ChatGPT API and returns the response
    """
    run_result = client.beta.maestro.runs.create_and_poll(
        input=prompt,
        requirements=[
            {
                "name": "Characters",
                "description": "Make sure to add the potential players and their brief description in the example response.",
            },
            {
                "name": "Hallucination",
                "description": "Strictly get the data about the topic itself from top sites from the web search. And make sure to use the information as is without any modification",
            },
            {
                "name": "JSON requirement",
                "description": """The response should only have the JSON in the format below and make sure all key-value pair exists as mentioned below:

 {
	"Character_1": {
		"Name": "",
		"Character_Summary": ",
		"Moves": {
			"Move_1":{
				"Move_name": "",
				"Description": "",
				"Damage": ""
			},
			"Move_2":{
				"Move_name": "",
				"Description": "",
				"Damage": ""
			},
			"Move_3":{
				"Move_name": "",
				"Description": "",
				"Damage": ""
			},
			"Move_4":{
				"Move_name": "",
				"Description": "",
				"Damage": ""
			}
		}
	},
	"Character_2": {
		"Name": "",
		"Character_Summary": "*Summarize the important points of the character with strengths and weaknesses",
		"Moves": {
			"Move_1":{
				"Move_name": "",
				"Description": "",
				"Damage": ""
			},
			"Move_2":{
				"Move_name": "",
				"Description": "",
				"Damage": ""
			},
			"Move_3":{
				"Move_name": "",
				"Description": "",
				"Damage": ""
			},
			"Move_4":{
				"Move_name": "",
				"Description": "",
				"Damage": ""
			}
		}
	},
	"Background": ""
}""",
            },
        ],
    )
    print(type(run_result.result))
    match = re.search(r"```json\s*(\{.*?\})\s*```",
                      run_result.result, re.DOTALL)
    if match:
        json_str = match.group(1)
        try:
            data = json.loads(json_str)
        except json.JSONDecodeError as e:
            print("Error decoding JSON:", e)
    else:
        print("JSON block not found.")

    return data


def save_to_file(data, filename="rapper_battle.json"):
    """
    Saves the response to a JSON file
    """

    # Try to find and parse the JSON part of the response
    try:

        with open(filename, 'w') as f:
            json.dump(data, f, indent=4)

        print(f"Battle data saved to {filename}")

    except json.JSONDecodeError:
        print("Could not parse JSON from response. Saving raw response.")


def main(topic="rappers in 2025"):
    """
    Main function to run the battle simulation query
    """
    try:
        # Get the topic from user input (with a default if none provided)
        # Create the query with the specified topic
        query = create_battle_query(topic)

        # Send the query to ChatGPT
        print("Sending query to Maestro...")
        response = query_maestro(query)

        # Create a filename based on the topic
        filename = "battle.json"

        # Save the response to a file
        save_to_file(response, filename)

        # Print confirmation
        print(f"{topic} battle data generated successfully!")

    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    main()
