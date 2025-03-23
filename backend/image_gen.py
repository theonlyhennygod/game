from io import BytesIO
from PIL import Image
from rembg import remove
import requests
import os
import json
from openai import OpenAI

XAI_API_KEY = os.getenv("XAI_API_KEY")
client = OpenAI(base_url="https://api.x.ai/v1", api_key=XAI_API_KEY)


def generate_character_image(character_data):
    name = character_data.get("Name", "Unknown Character")
    description = character_data.get("Character_Summary", "")

    prompt = f"""Create a pixel art sprite of:
name: {name}
description: {description}

Style: Low resolution, 4-6 colors, background is white (character is not), bold outlines, no lines on the character itself, simplified design.
Instructions: If a public figure, it should look like them."""

    print(prompt)
    response = client.images.generate(
        model="grok-2-image",
        prompt=prompt,
        n=1
    )

    return response.data[0].url


def generate_images_from_json(json_file_path):
    with open(json_file_path, 'r') as f:
        data = json.load(f)

    image_urls = {}
    for char_key, char_data in data.items():
        if char_key != "Background":
            try:
                image_url = generate_character_image(char_data)
                image_urls[char_key] = image_url
            except Exception as e:
                print(f"Error generating image for {char_key}: {str(e)}")

    return image_urls


# Function to download image from URL

def download_image(url, save_path):
    try:
        # Send a GET request to the URL
        response = requests.get(url)
        response.raise_for_status()  # Check if the request was successful

        # Open the image from the response content
        image = Image.open(BytesIO(response.content))
        # Save the image locally
        image.save(save_path)
        print(f"Image successfully downloaded and saved as {save_path}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error downloading image: {e}")
        return False
    except Exception as e:
        print(f"Error processing image: {e}")
        return False


# # URL of the image to download
# image_url = "https://imgen.x.ai/xai-imgen/xai-tmp-imgen-41a0d9ea-8dcb-4454-9a54-58a6d342cad6.jpeg"
# input_path = "input.jpg"
# output_path = "output.png"


if __name__ == "__main__":
    json_file = "backend/rapper_example.json"
    character_images = generate_images_from_json(json_file)

    for char_name, url in character_images.items():
        save_path = f"./images/{char_name}.png"
        output_path = f"./images/{char_name}_no_bg.png"
        if download_image(url, save_path):
            # Process the downloaded image to remove background
            try:
              input_image = Image.open(save_path)
              output_image = remove(input_image)
              output_image.save(output_path)
              print(f"Background removed and image saved as {output_path}")
            except Exception as e:
              print(f"Error removing background: {e}")
        else:
            print("Failed to download image, cannot proceed with background removal")

    for char_name, url in character_images.items():
        print(f"{char_name}: {url}")
