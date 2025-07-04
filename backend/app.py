from flask import Flask, request, jsonify
from recommend import recommend_products
from chatbot import chatbot_reply
from gift_message import create_gift_message
from image_ai import predict_image
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Cho phép frontend truy cập API

@app.route("/api/recommend", methods=["POST"])
def recommend():
    data = request.json
    product = data.get("product", "")
    suggestions = recommend_products(product)
    return jsonify(suggestions)

@app.route("/api/chatbot", methods=["POST"])
def chatbot():
    data = request.json
    message = data.get("message", "")
    reply = chatbot_reply(message)
    return jsonify({"reply": reply})

@app.route("/api/gift-message", methods=["POST"])
def gift_message():
    data = request.json
    name = data.get("name", "")
    occasion = data.get("occasion", "")
    message = create_gift_message(name, occasion)
    return jsonify({"message": message})

@app.route("/api/predict-image", methods=["POST"])
def predict_image_api():
    if "image" not in request.files:
        return jsonify({"result": "Không có file ảnh"}), 400
    file = request.files["image"]
    result = predict_image(file)
    return jsonify({"result": result})

if __name__ == "__main__":
    app.run(debug=True, port=3001)
