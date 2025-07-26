import tensorflow as tf
import numpy as np
from PIL import Image
import requests
from keras.applications.mobilenet_v2 import preprocess_input, MobileNetV2
from keras.preprocessing import image
from sklearn.metrics.pairwise import cosine_similarity
from io import BytesIO

# Load model MobileNetV2 để trích đặc trưng ảnh
feature_model = MobileNetV2(weights="imagenet", include_top=False, pooling="avg")

def extract_features(img) -> np.ndarray:
    img = img.resize((224, 224)).convert("RGB")
    x = image.img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)
    features = feature_model.predict(x)
    return features[0]

def predict_similar_products(file, top_n=5, threshold=0.6) -> dict:
    try:
        query_img = Image.open(file.stream)
        query_vector = extract_features(query_img)

        # Gọi API lấy danh sách sản phẩm
        resp = requests.get("http://localhost:3000/products")
        products = resp.json() if resp.status_code == 200 else []

        similarities = []
        for product in products:
            image_urls = product.get("images", [])
            if not image_urls:
                continue

            try:
                img_resp = requests.get(f"http://localhost:3000/images/{image_urls[0]}")
                product_img = Image.open(BytesIO(img_resp.content))
                product_vector = extract_features(product_img)

                similarity = cosine_similarity([query_vector], [product_vector])[0][0]
                similarities.append((similarity, product))
                print(f"Similarity với {product.get('name')}: {similarity}")
            except Exception as e:
                print(f"Lỗi xử lý ảnh sản phẩm: {e}")

        # Sắp xếp theo độ tương đồng giảm dần
        similarities.sort(reverse=True, key=lambda x: x[0])
        # Lọc các sản phẩm có similarity trên threshold
        filtered = [prod for sim, prod in similarities if sim >= threshold]
        # Nếu không có sản phẩm đủ giống, lấy top_n sản phẩm gần nhất
        if not filtered:
            filtered = [prod for sim, prod in similarities[:top_n]]

        result_products = [
            {
                "name": prod.get("name"),
                "description": prod.get("description"),
                "price": prod.get("price"),
                "image_url": prod.get("images", [None])[0]
            }
            for prod in filtered
        ]

        return {
            "result": "matched" if result_products else "no_match",
            "products": result_products,
            "questions": [
                "Sản phẩm này có những màu nào?",
                "Sản phẩm này giá bao nhiêu?",
                "Sản phẩm này còn hàng không?"
            ]
        }

    except Exception as e:
        print("Lỗi xử lý ảnh:", e)
        return {"error": f"Lỗi xử lý ảnh: {str(e)}"}

def predict_image(file, top_n=5, threshold=0.3):
    return predict_similar_products(file, top_n, threshold)
