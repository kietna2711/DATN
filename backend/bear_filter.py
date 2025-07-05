from PIL import Image, ImageDraw

def apply_bear_filter(file):
    img = Image.open(file).convert("RGBA")
    # Vẽ tai gấu đơn giản lên ảnh (demo)
    draw = ImageDraw.Draw(img)
    w, h = img.size
    # Tai trái
    draw.ellipse((w*0.15, h*0.05, w*0.35, h*0.25), fill=(160, 82, 45, 180))
    # Tai phải
    draw.ellipse((w*0.65, h*0.05, w*0.85, h*0.25), fill=(160, 82, 45, 180))
    return img