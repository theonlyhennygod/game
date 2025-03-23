#!/usr/bin/env python
"""
Main script for generating battle simulations by using the gamify.py module.
This script serves as an entry point to demonstrate how to use the battle query generator.
"""

import os
import sys
import argparse
from dotenv import load_dotenv

# Import functions from gamify.py
try:
    from web_search import create_battle_query, query_chatgpt, save_to_file
except ImportError:
    print("Error: Could not import from web_search.py. Make sure the file is in the same directory.")
    sys.exit(1)

def parse_arguments():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description="Generate a battle simulation and character images")
    parser.add_argument("--topic", type=str, default="rappers in 2025",
                        help="Topic for the battle (default: 'rappers in 2025')")
    parser.add_argument("--output", type=str, default=None,
                        help="Output filename (default: [topic]_battle.json)")
    parser.add_argument("--model", type=str, default="gpt-4-turbo",
                        help="OpenAI model to use (default: gpt-4-turbo)")
    parser.add_argument("--skip-images", action="store_true",
                        help="Skip image generation step")
    return parser.parse_args()

def main():
    """Main function to run the battle generation process."""
    # Load environment variables
    load_dotenv()
    
    # Check for API key
    if not os.getenv('OPENAI_API_KEY'):
        print("Error: No OpenAI API key found. Set the OPENAI_API_KEY environment variable.")
        print("Create a .env file with: OPENAI_API_KEY=your_api_key_here")
        return 1
    
    # Check for X.AI API key if we're generating images
    if not os.getenv('XAI_API_KEY'):
        print("Warning: No X.AI API key found. Image generation will not work.")
        print("Add XAI_API_KEY=your_api_key_here to your .env file for image generation.")
    
    # Parse command line arguments
    args = parse_arguments()
    
    # Use command line topic or prompt user
    topic = args.topic
    if not topic:
        topic = input("Enter a topic for the battle: ").strip()
        if not topic:
            topic = "rappers in 2025"
    
    print(f"Generating battle for topic: {topic}")
    
    try:
        # Create battle query
        query = create_battle_query(topic)
        
        # Send query to ChatGPT
        print("Sending query to ChatGPT API...")
        response = query_chatgpt(query)
        
        # Determine output filename
        if args.output:
            filename = args.output
        else:
            filename = f"{topic.replace(' ', '_').lower()}_battle.json"
        
        # Save response to file
        save_to_file(response, filename)
        
        print(f"Battle generation complete! Data saved to {filename}")
        
        # Generate character images if not skipped
        if not args.skip_images and os.getenv('XAI_API_KEY'):
            print("\nGenerating character images...")
            try:
                # Create images directory if it doesn't exist
                os.makedirs("./images", exist_ok=True)
                
                # Generate images for characters
                character_images = generate_images_from_json(filename)
                
                print("\nCharacter images generated successfully!")
                for char_name, url in character_images.items():
                    print(f"{char_name}: {url}")
                    
            except Exception as e:
                print(f"Error during image generation: {e}")
                print("Battle data was saved successfully, but image generation failed.")
        elif args.skip_images:
            print("Image generation skipped as requested.")
        else:
            print("Image generation skipped due to missing X.AI API key.")
            
        return 0
        
    except Exception as e:
        print(f"Error during battle generation: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())