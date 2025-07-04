from db import products_collection, categories_collection

def chatbot_reply(message: str) -> str:
    message_lower = message.lower()
    products = list(products_collection.find())
    categories = list(categories_collection.find())

    # Tìm sản phẩm trùng tên gần chính xác
    for p in products:
        name = p.get("name", "").lower()
        if name in message_lower or message_lower in name:
            return f'Bạn đang hỏi về sản phẩm "{p["name"]}". Mô tả: {p.get("description", "Không có mô tả")}. Giá: {p.get("price", "Không rõ")} VND.'

    # Tìm danh mục trùng với câu hỏi
    matched_categories = [
        c for c in categories
        if c.get("name") and c["name"].lower() in message_lower
    ]

    if matched_categories:
        cat_names = [c["name"] for c in matched_categories]
        products_in_cat = [
            p for p in products if p.get("category", "").lower() in [c.lower() for c in cat_names]
        ]
        if products_in_cat:
            names = [f'"{p["name"]}"' for p in products_in_cat[:5]]
            return f'Các sản phẩm thuộc danh mục {", ".join(cat_names)}: {", ".join(names)}.'
        else:
            return f'Hiện tại chưa có sản phẩm nào trong danh mục {", ".join(cat_names)}.'

    # Nếu không, tìm sản phẩm có từ khóa liên quan trong tên hoặc mô tả
    keywords = message_lower.split()
    matched_products = [
        p for p in products
        if any(
            kw in p.get("name", "").lower() or kw in p.get("description", "").lower()
            for kw in keywords
        )
    ]

    if matched_products:
        names = [f'"{p["name"]}"' for p in matched_products[:5]]
        return f'Các sản phẩm liên quan đến câu hỏi của bạn: {", ".join(names)}.'

    # Nếu không tìm thấy gì, gợi ý vài sản phẩm nổi bật
    if products:
        names = [f'"{p["name"]}"' for p in products[:3]]
        return f'Shop hiện có các sản phẩm: {", ".join(names)}. Bạn muốn hỏi về sản phẩm nào ạ?'

    return "Hiện tại shop chưa có sản phẩm nào."
