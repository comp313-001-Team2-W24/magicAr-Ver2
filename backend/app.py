from flask import Flask, request,send_file
from flask_cors import CORS
import os
import infer

app = Flask(__name__)
CORS(app)

# Directory where uploaded images will be stored
UPLOAD_FOLDER = 'datasets/uploads'
RESULT_FOLDER = 'datasets/results'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
if not os.path.exists(RESULT_FOLDER):
    os.makedirs(RESULT_FOLDER)

@app.route('/synthesis-image', methods=['POST'])
def upload():
    data = request.get_json()  # Get JSON data from the request

    if not data or 'person_image' not in data or 'cloth_image' not in data:
        return 'Missing image data in JSON', 400

    img_name = data['person_image']
    c_name = data['cloth_image']
  
    infer.main(img_name, c_name)  
    file_name = f"{img_name.replace('.jpg', '')}-{c_name.replace('.jpg', '')}.jpg"
    result_image_path = os.path.join(RESULT_FOLDER, file_name) 
    return send_file(result_image_path, mimetype='image/jpeg')

if __name__ == '__main__':
    app.run(debug=True)
