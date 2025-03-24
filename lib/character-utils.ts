interface CharacterData {
  Name: string;
  Character_Summary: string;
}

export async function generateCharacterImage(characterData: CharacterData) {
  try {
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(characterData)
    });

    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error('Error generating character image:', error);
    throw error;
  }
} 