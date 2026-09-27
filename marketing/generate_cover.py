from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageFilter
import os

W, H = 1200, 627
FONT_DIR = "C:/Windows/Fonts"
ASSET_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(ASSET_DIR)
OUT_PATH = os.path.join(ASSET_DIR, "linkedin-cover-1200x627.png")
AVATAR_PATH = os.path.join(PROJECT_ROOT, "public", "Aditaya.png")

TEAL = (45, 212, 191)
TEAL_DARK = (20, 184, 166)
CYAN = (56, 189, 248)
ROSE = (244, 63, 94)
WHITE = (248, 250, 252)
MUTED = (148, 163, 184)
CARD_BG = (13, 18, 30)
CARD_BORDER = (51, 65, 85)
PAGE_TOP = (13, 18, 30)
PAGE_BOTTOM = (5, 7, 12)


def font(name, size):
    return ImageFont.truetype(os.path.join(FONT_DIR, name), size)


def rounded_mask(size, radius):
    mask = Image.new("L", size, 0)
    d = ImageDraw.Draw(mask)
    d.rounded_rectangle([0, 0, size[0] - 1, size[1] - 1], radius=radius, fill=255)
    return mask


def circle_mask(size):
    mask = Image.new("L", size, 0)
    d = ImageDraw.Draw(mask)
    d.ellipse([0, 0, size[0] - 1, size[1] - 1], fill=255)
    return mask


def vertical_gradient(size, top_color, bottom_color):
    grad = Image.linear_gradient("L").resize(size)
    return ImageOps.colorize(grad, black=bottom_color, white=top_color).convert("RGB")


def add_glow(base_rgba, center, radius, color, alpha, blur):
    glow = Image.new("RGBA", base_rgba.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(glow)
    x, y = center
    d.ellipse([x - radius, y - radius, x + radius, y + radius], fill=(*color, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(blur))
    base_rgba.alpha_composite(glow)


def text_size(draw, text, fnt):
    bbox = draw.textbbox((0, 0), text, font=fnt)
    return bbox[2] - bbox[0], bbox[3] - bbox[1]


def draw_centered_text(draw, cx, y, text, fnt, fill):
    w, h = text_size(draw, text, fnt)
    draw.text((cx - w / 2, y), text, font=fnt, fill=fill)
    return h


def pill(draw, xy, text, fnt, text_color, border_color=None, fill_color=None, pad_x=16, pad_y=8):
    w, h = text_size(draw, text, fnt)
    x, y = xy
    box = [x, y, x + w + pad_x * 2, y + h + pad_y * 2]
    radius = (box[3] - box[1]) / 2
    if fill_color:
        draw.rounded_rectangle(box, radius=radius, fill=fill_color)
    if border_color:
        draw.rounded_rectangle(box, radius=radius, outline=border_color, width=2)
    draw.text((x + pad_x, y + pad_y - 1), text, font=fnt, fill=text_color)
    return box


def main():
    base = vertical_gradient((W, H), PAGE_TOP, PAGE_BOTTOM).convert("RGBA")
    add_glow(base, (120, 80), 420, TEAL, 46, 160)
    add_glow(base, (1180, 560), 360, ROSE, 30, 170)
    add_glow(base, (900, 120), 300, CYAN, 22, 150)

    draw = ImageDraw.Draw(base)

    f_logo = font("segoeuib.ttf", 26)
    f_eyebrow = font("segoeuib.ttf", 17)
    f_name = font("segoeuib.ttf", 60)
    f_role = font("segoeuib.ttf", 32)
    f_desc = font("segoeui.ttf", 19)
    f_tag = font("segoeuib.ttf", 15)
    f_url = font("segoeui.ttf", 16)

    f_mock_name = font("segoeuib.ttf", 21)
    f_mock_role = font("segoeuib.ttf", 14)
    f_mock_badge = font("segoeuib.ttf", 11)
    f_mock_url = font("segoeui.ttf", 12)

    # --- Logo monogram (top-left) ---
    logo_size = 64
    logo_grad = vertical_gradient((logo_size, logo_size), TEAL, CYAN).convert("RGBA")
    logo_mask = rounded_mask((logo_size, logo_size), 18)
    base.paste(logo_grad, (64, 56), logo_mask)
    ld = ImageDraw.Draw(base)
    w, h = text_size(ld, "AK", f_logo)
    ld.text((64 + logo_size / 2 - w / 2, 56 + logo_size / 2 - h / 2 - 3), "AK", font=f_logo, fill=(6, 20, 24))

    # --- Left column text ---
    left_x = 64

    pill(
        draw,
        (left_x, 150),
        "PORTFOLIO 2026",
        f_eyebrow,
        TEAL,
        border_color=TEAL,
        fill_color=(14, 46, 45),
        pad_x=18,
        pad_y=9,
    )

    draw.text((left_x, 205), "Aditaya Kumar", font=f_name, fill=WHITE)
    draw.text((left_x, 271), "Mishra", font=f_name, fill=WHITE)

    draw.text((left_x, 350), "Full Stack Developer", font=f_role, fill=TEAL)

    draw.text((left_x, 402), "React · Vite · Node.js · MongoDB · AI Web Apps", font=f_desc, fill=MUTED)

    tag_y = 452
    tag_x = left_x
    for label in ["MERN Stack", "AI-Powered", "SEO-Ready"]:
        box = pill(
            draw,
            (tag_x, tag_y),
            label,
            f_tag,
            WHITE,
            border_color=(71, 85, 105),
            fill_color=(24, 31, 45),
            pad_x=14,
            pad_y=8,
        )
        tag_x = box[2] + 12

    draw.text((left_x, 536), "aditaya-portfolio.vercel.app", font=f_url, fill=MUTED)

    # --- Browser mockup card (right column) ---
    card_x, card_y, card_w, card_h = 660, 90, 476, 450
    card = Image.new("RGBA", (card_w, card_h), (0, 0, 0, 0))
    cd = ImageDraw.Draw(card)

    cd.rectangle([0, 0, card_w, card_h], fill=CARD_BG)

    chrome_h = 38
    cd.rectangle([0, 0, card_w, chrome_h], fill=(22, 27, 40))
    for i, dot_color in enumerate([(255, 95, 87), (254, 188, 46), (40, 200, 64)]):
        cd.ellipse([20 + i * 22, chrome_h / 2 - 6, 32 + i * 22, chrome_h / 2 + 6], fill=dot_color)

    url_text = "aditaya-portfolio.vercel.app"
    uw, uh = text_size(cd, url_text, f_mock_url)
    url_box = [card_w / 2 - uw / 2 - 16, 8, card_w / 2 + uw / 2 + 16, 8 + uh + 12]
    cd.rounded_rectangle(url_box, radius=(url_box[3] - url_box[1]) / 2, fill=(9, 12, 20))
    cd.text((card_w / 2 - uw / 2, 13), url_text, font=f_mock_url, fill=(148, 163, 184))

    content_top = chrome_h
    content_glow = Image.new("RGBA", (card_w, card_h - content_top), (0, 0, 0, 0))
    gd = ImageDraw.Draw(content_glow)
    gd.ellipse([card_w - 260, -140, card_w + 60, 160], fill=(*TEAL, 40))
    content_glow = content_glow.filter(ImageFilter.GaussianBlur(70))
    card.alpha_composite(content_glow, (0, content_top))

    avatar_dia = 132
    avatar_cx = card_w / 2
    avatar_top = content_top + 46
    if os.path.exists(AVATAR_PATH):
        avatar = Image.open(AVATAR_PATH).convert("RGB")
        side = min(avatar.size)
        left = (avatar.width - side) / 2
        top = (avatar.height - side) / 2
        avatar = avatar.crop((left, top, left + side, top + side)).resize((avatar_dia, avatar_dia), Image.LANCZOS)
        ring = Image.new("RGBA", (avatar_dia + 8, avatar_dia + 8), (0, 0, 0, 0))
        rd = ImageDraw.Draw(ring)
        rd.ellipse([0, 0, avatar_dia + 7, avatar_dia + 7], outline=(*TEAL, 200), width=3)
        card.paste(avatar, (int(avatar_cx - avatar_dia / 2), int(avatar_top)), circle_mask((avatar_dia, avatar_dia)))
        card.alpha_composite(ring, (int(avatar_cx - avatar_dia / 2 - 4), int(avatar_top - 4)))

    name_y = avatar_top + avatar_dia + 20
    name_y += draw_centered_text(cd, avatar_cx, name_y, "Aditaya Kumar Mishra", f_mock_name, WHITE) + 8
    name_y += draw_centered_text(cd, avatar_cx, name_y, "Full Stack Developer", f_mock_role, TEAL) + 14

    badge_text = "OPEN TO WORK"
    bw, bh = text_size(cd, badge_text, f_mock_badge)
    badge_box = [avatar_cx - bw / 2 - 14, name_y, avatar_cx + bw / 2 + 14, name_y + bh + 16]
    cd.rounded_rectangle(badge_box, radius=(badge_box[3] - badge_box[1]) / 2, outline=TEAL, width=2)
    cd.text((avatar_cx - bw / 2, name_y + 8), badge_text, font=f_mock_badge, fill=TEAL)

    card_mask = rounded_mask((card_w, card_h), 22)
    base.paste(card, (card_x, card_y), Image.composite(card_mask, Image.new("L", card_mask.size, 0), card_mask))
    border_layer = Image.new("RGBA", (card_w, card_h), (0, 0, 0, 0))
    bd = ImageDraw.Draw(border_layer)
    bd.rounded_rectangle([1, 1, card_w - 2, card_h - 2], radius=22, outline=(*CARD_BORDER, 255), width=2)
    base.alpha_composite(border_layer, (card_x, card_y))

    base.convert("RGB").save(OUT_PATH, "PNG")
    print("Saved:", OUT_PATH, base.size)


if __name__ == "__main__":
    main()
