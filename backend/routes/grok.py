import os

from openai import OpenAI

XAI_API_KEY = os.getenv("XAI_API_KEY")
client = OpenAI(base_url="https://api.x.ai/v1", api_key=XAI_API_KEY)

response = client.images.generate(
  model="grok-2-image",
  prompt="A cat in a tree"
)

print(response.data[0].url)

# multiple images

# response = client.images.generate(
#   model="grok-2-image",
#   prompt="A cat in a tree"
#   n=4
# )
# for image in response.data:
#   print(image.url)