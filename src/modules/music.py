from flask import Blueprint, request
from . import db
import audio_metadata
import os

music = Blueprint('music', __name__)

ALLOWED_EXTENSIONS = {'mp3', 'wav'}

@music.route('/music/import', methods=['POST'])
def music_import():
    # Clear static/music directory
    if not os.path.exists('static/music'):
        os.makedirs('static/music')
    for file in os.listdir('static/music'):
        os.remove(f'static/music/{file}')

    db.save('music', [])
    tracklist = []
    
    try:
        for file in request.files.getlist('file'):
            if file.filename.split('.')[-1] in ALLOWED_EXTENSIONS:
                print(f'Importing file: {file.filename}')
                name = file.filename.split('/')[-1] if '/' in file.filename else file.filename
                file.save(f'static/music/{name}')

                try:
                    with open(f'static/music/{name}', 'rb') as f:
                        metadata = audio_metadata.load(f)
                except Exception as e:
                    print(f"Error loading metadata for {file.filename}: {str(e)}")
                    continue

                tracklist.append({
                    "name": metadata['tags']['title'][0] if 'title' in metadata['tags'] else file.filename.split('.')[0],
                    "artist": metadata['tags']['artist'][0] if 'artist' in metadata['tags'] else 'Unknown',
                    "path": f"/static/music/{name}"
                })
            else:
                print(f'File {file.filename} is not allowed')

        db.save('music', tracklist)
        
        return {
            "success": True,
            "message": "Music imported successfully"
        }
    except Exception as e:
        print(f"Error importing music: {str(e)}")
        return {
            "success": False,
            "message": f"Error importing music: {str(e)}"
        }

@music.route('/music/tracks', methods=['GET'])
def music_tracks():
    try:
        return {
            "success": True,
            "tracks": db.read('music', default=[])
        }
    except Exception as e:
        print(f"Error getting music tracks: {str(e)}")
        return {
            "success": False,
            "message": f"Error getting music tracks: {str(e)}"
        }