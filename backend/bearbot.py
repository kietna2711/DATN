import random

JOKES = [
    "Vì sao con gấu không bao giờ bị lạc? Vì nó luôn mang theo bản đồ... (bear map 😄)",
    "Con gấu đi học môn gì giỏi nhất? Môn... ôm (home) 😆",
    "Gấu thích ăn gì nhất? Ăn kem cùng bạn nhỏ đó!"
]

def bear_reply(message: str) -> str:
    message = message.lower()

    if "tên" in message:
        return "Tớ tên là MiMiGấu, rất vui được làm bạn với bé!"
    elif "ăn gì" in message:
        return "Tớ thích ăn mật ong và bánh ngọt 🐻🍯"
    elif "hôm nay" in message or "làm gì" in message:
        return "Hôm nay tớ nằm chơi, ôm bé ngủ cả ngày luôn!"
    elif "bao nhiêu tuổi" in message:
        return "Tớ vừa tròn 3 tuổi, còn bé hơn cả bé luôn đó!"
    elif "màu yêu thích" in message:
        return "Tớ thích màu hồng vì nó dễ thương như bé vậy đó!"
    elif "thú cưng" in message:
        return "Tớ thích chơi với chú vịt vàng đồ chơi 🦆"
    elif "hát" in message:
        return "Tớ đang học hát bài 'Con gà trống, mèo con và cún con' đó bé!"
    elif "trò chơi" in message:
        return "Tớ thích chơi ú òa và lắp ghép hình nữa!"
    elif "ngủ chưa" in message:
        return "Tớ chưa ngủ đâu, còn đang đợi bé rủ chơi nè!"
    elif "buồn" in message:
        return f"Nếu bé buồn, tớ kể chuyện cười nha: {random.choice(JOKES)}"
    elif "chơi gì" in message:
        return "Mình cùng chơi trò đoán tiếng kêu con vật nha! Mooo là con gì nè? 🐄"
    else:
        return "Bé ơi, mình cùng chơi trò đoán con vật nhé! Bé thích con gì nè?"

