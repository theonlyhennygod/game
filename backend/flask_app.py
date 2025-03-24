from flask import Flask, jsonify, request
from flask_cors import CORS
import time
from web_search_maestro import main

app = Flask(__name__)
CORS(app)  # Enables Cross-Origin requests (important for React frontend)

@app.route('/api/generate_image')
def get_data():
    topic = request.args.get('topic', '')

    main(topic)
    
    return jsonify({'message': 'Image have been generated'})

if __name__ == '__main__':
    app.run(debug=True)
