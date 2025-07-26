from flask import Flask, request, jsonify, send_file
from bearbot import bear_reply
from recommend import recommend_products
from chatbot import chatbot_reply
from image_ai import predict_image
from flask_cors import CORS
from gtts import gTTS
from io import BytesIO

app = Flask(__name__)
CORS(app)  # Cho phép frontend truy cập API

@app.route("/api/recommend", methods=["POST"])
def recommend():
    data = request.json
    product = data.get("product", "")
    suggestions = recommend_products(product)
    return jsonify(suggestions)

@app.route("/api/chatbot", methods=["POST"])
def chatbot_api():
    data = request.get_json()
    message = data.get("message", "")
    result = chatbot_reply(message)
    print("User hỏi:", message)
    print("Bot trả lời:", result)
    return jsonify(result)


@app.route("/api/predict-image", methods=["POST"])
def predict_image_api():
    if "image" not in request.files:
        return jsonify({"result": "Không có file ảnh"}), 400
    file = request.files["image"]
    result = predict_image(file)
    return jsonify({"result": result})

@app.route("/api/bear-voice", methods=["POST"])
def bear_voice():
    data = request.json
    message = data.get("message", "")
    reply = bear_reply(message)
    tts = gTTS(reply, lang="vi", tld="com.vn")
    mp3_fp = BytesIO()
    tts.write_to_fp(mp3_fp)
    mp3_fp.seek(0)
    return send_file(mp3_fp, mimetype="audio/mpeg")

if __name__ == "__main__":
    app.run(debug=True, port=3001)
