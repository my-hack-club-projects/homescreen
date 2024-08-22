from flask import Blueprint, request
from . import db

drag = Blueprint('drag', __name__)

@drag.route('/drag/save', methods=['POST'])
def drag_save():
    try:
        db.save('drag', request.json)

        return {
            "success": True,
            "message": "Data saved successfully"
        }
    except Exception as e:
        print(f"Error saving data: {str(e)}")
        return {
            "success": False,
            "message": f"Error saving data: {str(e)}"
        }
    
@drag.route('/drag/load', methods=['GET'])
def drag_load():
    try:
        return {
            "success": True,
            "data": db.read('drag', default={}),
        }
    except Exception as e:
        print(f"Error loading data: {str(e)}")
        return {
            "success": False,
            "message": f"Error loading data: {str(e)}"
        }