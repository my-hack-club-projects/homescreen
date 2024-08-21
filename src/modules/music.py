from flask import Blueprint, request
import os

music = Blueprint('music', __name__)

ALLOWED_EXTENSIONS = {'mp3', 'wav'}

# TODO: Save track list to database
tracklist = []

@music.route('/music/import', methods=['POST'])
def music_import():
    directory = request.json['directory']

    print(f'Importing music from {directory}')

    # Get files from the local directory (server runs on localhost, otherwise this would be a security risk)
    files = os.listdir(directory)
    allowed_files = [file for file in files if file.split('.')[-1] in ALLOWED_EXTENSIONS]

    print(f'Allowed files: {allowed_files}')

    # Add the allowed files to the tracklist (use EXIF data to get the name and artist)
    # For the paths, copy each file into static/music
    # TODO: Use symlink instead of copying the files? Don't know how much cross-platform support this has
    for file in allowed_files:
        tracklist.append({
            "name": file.split('.')[0],
            "artist": "Unknown",
            "path": f"/static/music/{file}"
        })

        if not os.path.exists('static/music'):
            os.makedirs('static/music')

        with open(f'static/music/{file}', 'wb') as f:
            with open(f'{directory}/{file}', 'rb') as f2:
                f.write(f2.read())

    return {
        "success": True,
        "message": "Music imported successfully"
    }


@music.route('/music/tracks', methods=['GET'])
def music_tracks():
    return {
        "success": True,
        "tracks": tracklist
    }