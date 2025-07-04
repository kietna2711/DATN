import random

def create_gift_message(name: str, occasion: str) -> str:
    templates = {
        "sinh nhật": [
            f"Chúc {name} một sinh nhật thật hạnh phúc và đáng nhớ! 🎂🎁",
            f"{name} ơi, mong bạn sẽ có một ngày sinh nhật ngọt ngào như gấu bông này 💝"
        ],
        "tình yêu": [
            f"{name}, tình yêu của anh dành cho em như chú gấu bông này – mềm mại và ấm áp 🧸❤️",
            f"Tặng em chú gấu bông này để thay anh ôm em mỗi ngày 😘"
        ]
    }
    return random.choice(templates.get(occasion.lower(), [f"Gửi đến {name} một lời chúc tuyệt vời!"]))
