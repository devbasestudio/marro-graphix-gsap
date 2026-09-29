from pathlib import Path
import shutil

from PIL import Image
from reportlab.lib.colors import HexColor, white
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "Ye-Naing-Thant-CV.pdf"
PUBLIC_OUTPUT = ROOT / "public" / "resume" / "ye-naing-thant-cv.pdf"
TMP = ROOT / "tmp" / "pdfs" / "resume-assets"
ART = ROOT / "public" / "artworks"
PROFILE = ROOT / "public" / "profile.jpg"

PAGE_W, PAGE_H = A4
INK = HexColor("#0A0A0D")
BLUE = HexColor("#0066FF")
PAPER = HexColor("#F3F0E8")
WHITE = HexColor("#FFFFFF")
MUTED = HexColor("#6E6C70")
LIGHT = HexColor("#D7D2C8")


BODY = ParagraphStyle(
    "body", fontName="Helvetica", fontSize=8.5, leading=12,
    textColor=MUTED, alignment=TA_LEFT,
)
BODY_DARK = ParagraphStyle(
    "body-dark", fontName="Helvetica", fontSize=8.2, leading=11.4,
    textColor=INK,
)
BODY_LIGHT = ParagraphStyle(
    "body-light", fontName="Helvetica", fontSize=8.3, leading=11.8,
    textColor=HexColor("#C9C9CE"),
)
BULLET = ParagraphStyle(
    "bullet", fontName="Helvetica", fontSize=7.8, leading=10.3,
    textColor=MUTED, leftIndent=11, firstLineIndent=-11, spaceAfter=3,
)


def paragraph(c, text, x, y_top, width, style=BODY):
    item = Paragraph(text, style)
    _, height = item.wrap(width, PAGE_H)
    item.drawOn(c, x, y_top - height)
    return y_top - height


def section_label(c, text, x, y, light=False):
    c.setFillColor(BLUE)
    c.setFont("Helvetica-Bold", 7)
    c.drawString(x, y, text.upper())
    c.setStrokeColor(WHITE if light else INK)
    c.setLineWidth(0.7)
    c.line(x + 76, y + 2.2, x + 115, y + 2.2)


def page_mark(c, number, light=False):
    c.setFillColor(HexColor("#8A898D") if not light else HexColor("#77777D"))
    c.setFont("Helvetica-Bold", 6.2)
    c.drawString(28, 18, "YE NAING THANT / CV + PORTFOLIO")
    c.drawRightString(PAGE_W - 28, 18, f"0{number} / 06")


def cropped_asset(path, width, height, anchor_y=0.5):
    TMP.mkdir(parents=True, exist_ok=True)
    key = f"{Path(path).stem}-{int(width)}x{int(height)}-{int(anchor_y * 100)}.jpg"
    output = TMP / key
    if output.exists():
        return output
    with Image.open(path) as source:
        source = source.convert("RGB")
        target_ratio = width / height
        source_ratio = source.width / source.height
        if source_ratio > target_ratio:
            crop_width = int(source.height * target_ratio)
            left = (source.width - crop_width) // 2
            source = source.crop((left, 0, left + crop_width, source.height))
        else:
            crop_height = int(source.width / target_ratio)
            top = int((source.height - crop_height) * anchor_y)
            top = max(0, min(top, source.height - crop_height))
            source = source.crop((0, top, source.width, top + crop_height))
        pixel_w = max(800, int(width * 3))
        pixel_h = max(800, int(height * 3))
        source.resize((pixel_w, pixel_h), Image.Resampling.LANCZOS).save(output, quality=91)
    return output


def draw_cover(c, path, x, y, w, h, anchor_y=0.5, radius=0):
    image = cropped_asset(path, w, h, anchor_y)
    if radius:
        c.saveState()
        clip = c.beginPath()
        clip.roundRect(x, y, w, h, radius)
        c.clipPath(clip, stroke=0, fill=0)
    c.drawImage(ImageReader(image), x, y, w, h, preserveAspectRatio=False, mask="auto")
    if radius:
        c.restoreState()


def image_card(c, path, title, category, x, y, w, h, anchor_y=0.5, dark_caption=True):
    draw_cover(c, path, x, y, w, h, anchor_y, radius=5)
    c.saveState()
    c.setFillAlpha(0.84)
    c.setFillColor(INK if dark_caption else WHITE)
    c.roundRect(x + 7, y + 7, w - 14, 31, 3, stroke=0, fill=1)
    c.restoreState()
    c.setFillColor(WHITE if dark_caption else INK)
    c.setFont("Helvetica-Bold", 6.8)
    c.drawString(x + 14, y + 25, title.upper())
    c.setFillColor(HexColor("#B8B8BD") if dark_caption else MUTED)
    c.setFont("Helvetica", 5.6)
    c.drawString(x + 14, y + 15, category.upper())


def page_one(c):
    c.setFillColor(INK)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    c.setFillColor(BLUE)
    c.rect(0, PAGE_H - 14, PAGE_W, 14, stroke=0, fill=1)

    draw_cover(c, PROFILE, 315, 0, PAGE_W - 315, PAGE_H - 14, anchor_y=0.18)

    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 6.7)
    c.drawString(31, PAGE_H - 48, "CURRICULUM VITAE + PORTFOLIO / 2026")
    c.setFillColor(BLUE)
    c.circle(295, PAGE_H - 46, 3.2, stroke=0, fill=1)

    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 41)
    c.drawString(29, PAGE_H - 122, "YE NAING")
    c.setFillColor(BLUE)
    c.drawString(29, PAGE_H - 165, "THANT")

    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 8.2)
    c.drawString(31, PAGE_H - 196, "GRAPHIC DESIGNER")
    c.setFillColor(HexColor("#A8A8AD"))
    c.setFont("Helvetica", 6.8)
    c.drawString(31, PAGE_H - 212, "SOCIAL MEDIA / PRODUCT DESIGN / ADVERTISING")

    y = PAGE_H - 266
    section_label(c, "Profile", 31, y, light=True)
    y -= 21
    about = (
        "Creative and detail-oriented graphic designer with freelance experience since 2024 "
        "and one year of professional experience at Clean Pro. Creates targeted social media "
        "designs for Clean Pro, BusyBees, and Nilfisk, while also delivering freelance campaign "
        "visuals, product advertising, brand identities, and promotional materials."
    )
    paragraph(c, about, 31, y, 235, BODY_LIGHT)

    c.setStrokeColor(HexColor("#36363C"))
    c.setLineWidth(0.7)
    c.line(31, 378, 277, 378)
    c.line(31, 292, 277, 292)

    stats = [("50+", "PROJECTS"), ("30+", "CLIENTS"), ("2+", "YEARS FREELANCE")]
    sx = 31
    for value, name in stats:
        c.setFillColor(BLUE)
        c.setFont("Helvetica-Bold", 19)
        c.drawString(sx, 342, value)
        c.setFillColor(HexColor("#A8A8AD"))
        c.setFont("Helvetica-Bold", 5.5)
        c.drawString(sx, 329, name)
        sx += 82

    section_label(c, "Contact", 31, 265, light=True)
    contacts = [
        ("PHONE", "+95 9 679 406 773"),
        ("EMAIL", "supermarro89@gmail.com"),
        ("ADDRESS", "Gandarmar Street, Pale, Mingaladon, Yangon"),
    ]
    y = 239
    for heading, value in contacts:
        c.setFillColor(HexColor("#77777E"))
        c.setFont("Helvetica-Bold", 5.8)
        c.drawString(31, y, heading)
        c.setFillColor(WHITE)
        c.setFont("Helvetica", 7.8)
        c.drawString(31, y - 13, value)
        y -= 46

    c.saveState()
    c.setFillAlpha(0.86)
    c.setFillColor(BLUE)
    c.roundRect(337, 34, 224, 80, 5, stroke=0, fill=1)
    c.restoreState()
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 7)
    c.drawString(351, 91, "AVAILABLE FOR OPPORTUNITIES")
    c.setFont("Helvetica-Bold", 15)
    c.drawString(351, 67, "READY TO CREATE.")
    c.drawString(351, 48, "READY TO CONTRIBUTE.")
    c.setFont("Helvetica", 6.5)
    c.drawString(351, 37, "Yangon, Myanmar / 2026")
    page_mark(c, 1, light=True)
    c.showPage()


def page_two(c):
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    c.setFillColor(BLUE)
    c.rect(0, PAGE_H - 12, PAGE_W, 12, stroke=0, fill=1)

    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 6.5)
    c.drawString(28, PAGE_H - 38, "YE NAING THANT")
    c.setFillColor(MUTED)
    c.drawRightString(PAGE_W - 28, PAGE_H - 38, "GRAPHIC DESIGNER")
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 31)
    c.drawString(28, PAGE_H - 92, "DESIGN CAREER /")
    c.setFillColor(BLUE)
    c.drawString(28, PAGE_H - 126, "CAPABILITIES")

    left_x, left_w = 28, 167
    right_x, right_w = 220, PAGE_W - 248
    c.setStrokeColor(LIGHT)
    c.setLineWidth(0.7)
    c.line(207, 45, 207, PAGE_H - 154)

    y = PAGE_H - 174
    section_label(c, "Education", left_x, y)
    y -= 25
    for year, title, detail in [
        ("2024 - 2025", "Matriculation Examination", "No. 4 High School<br/>Mingaladon, Yangon"),
        ("2025 - 2026", "Dagon University", "B.Sc. Chemistry, First Year<br/>Distance Education"),
    ]:
        c.setFillColor(BLUE)
        c.setFont("Helvetica-Bold", 6.5)
        c.drawString(left_x, y, year)
        c.setFillColor(INK)
        c.setFont("Helvetica-Bold", 9.2)
        c.drawString(left_x, y - 16, title)
        y = paragraph(c, detail, left_x, y - 27, left_w, BODY_DARK) - 20

    section_label(c, "Certifications", left_x, y)
    y -= 25
    for item in ["Mastering Adobe Photoshop Online Course", "Adobe Photoshop Certificate of Completion"]:
        c.setFillColor(BLUE)
        c.circle(left_x + 2, y + 2, 1.7, stroke=0, fill=1)
        y = paragraph(c, item, left_x + 11, y + 7, left_w - 11, BODY_DARK) - 10

    section_label(c, "Core skills", left_x, y)
    y -= 25
    skills = [
        "Adobe Photoshop", "Social Media Design", "Photo Manipulation", "Brand Identity",
        "Poster Design", "Product Mockups", "Typography", "Visual Composition", "Time Management",
    ]
    for index, skill in enumerate(skills, start=1):
        c.setFillColor(HexColor("#9A9894"))
        c.setFont("Helvetica-Bold", 5.7)
        c.drawString(left_x, y, f"{index:02d}")
        c.setFillColor(INK)
        c.setFont("Helvetica", 7.5)
        c.drawString(left_x + 23, y, skill)
        y -= 18

    y = PAGE_H - 174
    section_label(c, "Experience", right_x, y)
    y -= 28
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(right_x, y, "Graphic Designer")
    c.setFillColor(BLUE)
    c.setFont("Helvetica-Bold", 6.8)
    c.drawRightString(PAGE_W - 28, y + 2, "2025 - 2026")
    y -= 18
    c.setFillColor(MUTED)
    c.setFont("Helvetica-Oblique", 8.3)
    c.drawString(right_x, y, "CLEAN PRO")
    y -= 20

    clean_pro_experience = [
        "Created targeted social media designs for three brands: Clean Pro, BusyBees, and Nilfisk.",
        "Designed cleaning-service campaigns for Clean Pro, pest-control campaigns for BusyBees, and product-focused visuals for Nilfisk.",
        "Produced an average of six social media designs per day based on target audiences and marketing objectives.",
        "Created business cards, name cards, and other company materials for day-to-day business needs.",
        "Collaborated with digital marketing and maintained consistent brand quality across platforms.",
    ]
    for item in clean_pro_experience:
        y = paragraph(c, f"<font color='#0066FF'><b>+</b></font>&nbsp;&nbsp;{item}", right_x, y, right_w, BULLET)

    y -= 17
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 13)
    c.drawString(right_x, y, "Freelance Graphic Designer")
    c.setFillColor(BLUE)
    c.setFont("Helvetica-Bold", 6.8)
    c.drawRightString(PAGE_W - 28, y + 2, "2024 - PRESENT")
    y -= 17
    c.setFillColor(MUTED)
    c.setFont("Helvetica-Oblique", 8.3)
    c.drawString(right_x, y, "MARRO GRAPHIX")
    y -= 19

    freelance_experience = [
        "Produced social media campaigns, product ads, brand identities, and promotional visuals for brands and local businesses.",
        "Managed creative briefs, client feedback, revisions, and final delivery independently.",
        "Prepared high-resolution, publish-ready artwork for digital and print use.",
    ]
    for item in freelance_experience:
        y = paragraph(c, f"<font color='#0066FF'><b>+</b></font>&nbsp;&nbsp;{item}", right_x, y, right_w, BULLET)

    y -= 20
    c.setFillColor(BLUE)
    c.roundRect(right_x, y - 78, right_w, 78, 5, stroke=0, fill=1)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 6.5)
    c.drawString(right_x + 15, y - 19, "KEY STRENGTHS")
    strengths = ["CONCEPT DEVELOPMENT", "VISUAL STORYTELLING", "BRAND CONSISTENCY", "DEADLINE DELIVERY"]
    for index, strength in enumerate(strengths):
        col = index % 2
        row = index // 2
        sx = right_x + 15 + col * 153
        sy = y - 43 - row * 23
        c.setFillColor(HexColor("#AFCBFF"))
        c.setFont("Helvetica-Bold", 5.5)
        c.drawString(sx, sy + 10, f"0{index + 1}")
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 8)
        c.drawString(sx, sy, strength)

    page_mark(c, 2)
    c.showPage()


def contained_image_card(c, path, title, category, x, y, w, h):
    c.setFillColor(WHITE)
    c.roundRect(x, y, w, h, 5, stroke=0, fill=1)
    image_y = y + 42
    image_h = h - 42
    with Image.open(path) as source:
        source_w, source_h = source.size
    scale = min((w - 12) / source_w, (image_h - 12) / source_h)
    draw_w = source_w * scale
    draw_h = source_h * scale
    c.drawImage(
        ImageReader(path),
        x + (w - draw_w) / 2,
        image_y + (image_h - draw_h) / 2,
        draw_w,
        draw_h,
        preserveAspectRatio=True,
        mask="auto",
    )
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 6.5)
    c.drawString(x + 10, y + 25, title.upper())
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 5.4)
    c.drawString(x + 10, y + 14, category.upper())


def brand_portfolio_page(c, number, brand, service, description, items, dark=False):
    box_text = WHITE if dark else INK
    box_muted = HexColor("#AFCBFF") if dark else HexColor("#003A91")
    c.setFillColor(INK if dark else PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    c.setFillColor(BLUE)
    c.rect(0, PAGE_H - 12, PAGE_W, 12, stroke=0, fill=1)
    section_label(c, f"Professional work / 0{number - 2}", 28, PAGE_H - 43, light=dark)
    c.setFillColor(WHITE if dark else INK)
    c.setFont("Helvetica-Bold", 31)
    c.drawString(28, PAGE_H - 92, brand.upper())
    c.setFillColor(BLUE)
    c.setFont("Helvetica-Bold", 13)
    c.drawString(29, PAGE_H - 119, service.upper())
    c.setFillColor(HexColor("#A8A8AE") if dark else MUTED)
    c.setFont("Helvetica", 7.2)
    c.drawRightString(PAGE_W - 28, PAGE_H - 114, "SOCIAL MEDIA / TARGET-LED DESIGN / 2025-2026")

    positions = [28, 211, 394]
    for x, (filename, title) in zip(positions, items):
        contained_image_card(c, ART / "professional" / filename, title, service, x, 332, 173, 345)

    c.setFillColor(BLUE)
    c.roundRect(28, 80, PAGE_W - 56, 218, 5, stroke=0, fill=1)
    label_style = ParagraphStyle(
        f"brand-label-{number}", fontName="Helvetica-Bold", fontSize=6.5, leading=8,
        textColor=box_text,
    )
    headline_style = ParagraphStyle(
        f"brand-headline-{number}", fontName="Helvetica-Bold", fontSize=18, leading=22,
        textColor=box_text,
    )
    paragraph(c, "ROLE + APPROACH", 44, 275, 210, label_style)
    paragraph(c, "DESIGNED FOR THE<br/>RIGHT AUDIENCE.", 44, 244, 225, headline_style)
    summary_style = ParagraphStyle(
        f"brand-summary-{number}", fontName="Helvetica", fontSize=8.3, leading=12,
        textColor=box_text,
    )
    paragraph(c, description, 318, 261, 225, summary_style)
    footer_label_style = ParagraphStyle(
        f"brand-footer-label-{number}", fontName="Helvetica-Bold", fontSize=6, leading=8,
        textColor=box_muted,
    )
    footer_style = ParagraphStyle(
        f"brand-footer-{number}", fontName="Helvetica-Bold", fontSize=10, leading=12,
        textColor=box_text,
    )
    paragraph(c, "CLEAN PRO · GRAPHIC DESIGNER", 318, 158, 225, footer_label_style)
    paragraph(c, "GRAPHIC DESIGNER / 1 YEAR", 318, 137, 225, footer_style)
    page_mark(c, number, light=dark)
    c.showPage()


def page_three(c):
    brand_portfolio_page(
        c,
        3,
        "BusyBees",
        "Pest control design",
        "Created targeted pest-control campaigns that explain termite risks, show service applications, and guide customers toward action through clear hierarchy and brand-consistent visuals.",
        [
            ("busybees/termite-dining.jpg", "Termite Control for Dining Spaces"),
            ("busybees/wood-pest-control.jpg", "Wood Pest Protection"),
            ("busybees/termite-warning.jpg", "Termite Damage Awareness"),
        ],
        dark=True,
    )


def page_four(c):
    brand_portfolio_page(
        c,
        4,
        "Clean Pro",
        "Cleaning service design",
        "Produced service-led social media creatives for specialist cleaning, construction clean-up, transportation, and commercial environments while keeping key benefits and contact details easy to scan.",
        [
            ("clean-pro/high-rise-cleaning.jpg", "High-Rise Cleaning Safety"),
            ("clean-pro/construction-cleaning.jpg", "Construction Cleaning Service"),
            ("clean-pro/bus-cleaning.jpg", "Professional Bus Cleaning"),
        ],
    )


def page_five(c):
    brand_portfolio_page(
        c,
        5,
        "Nilfisk",
        "Product design",
        "Developed product-focused graphics that present equipment clearly, highlight model benefits and applications, and maintain a strong Nilfisk visual presence across social media formats.",
        [
            ("nilfisk/high-pressure-washer.jpg", "High Pressure Washer"),
            ("nilfisk/manual-sweeper.jpg", "SW250 Manual Sweeper"),
            ("nilfisk/hp131.jpg", "HP131 Industrial Washer"),
        ],
        dark=True,
    )


def page_six(c):
    c.setFillColor(PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    c.setFillColor(BLUE)
    c.rect(0, PAGE_H - 12, PAGE_W, 12, stroke=0, fill=1)
    section_label(c, "Student practice work", 28, PAGE_H - 43)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 29)
    c.drawString(28, PAGE_H - 88, "ASSIGNMENTS /")
    c.setFillColor(BLUE)
    c.drawString(28, PAGE_H - 120, "VISUAL EXPLORATION")
    note_style = ParagraphStyle(
        "student-note", fontName="Helvetica", fontSize=7.4, leading=10.5,
        textColor=MUTED,
    )
    paragraph(
        c,
        "These concepts were created during my student years as assignments and self-directed practice to develop composition, typography, photo manipulation, and advertising design skills.",
        28,
        PAGE_H - 149,
        539,
        note_style,
    )

    cards = [
        ("terra-orange.jpg", "Terra Adventure", "Student practice"),
        ("dji-osmo.jpg", "DJI Osmo Pocket 3", "Student assignment"),
        ("pocari-new.jpg", "Pocari Sweat", "Student practice"),
        ("sprite.jpg", "Fresh Sprite", "Student assignment"),
        ("pico-vr.jpg", "PICO VR", "Student practice"),
        ("aston-martin.jpg", "Aston Martin Heritage", "Student assignment"),
    ]
    positions = [(28, 398), (211, 398), (394, 398), (28, 125), (211, 125), (394, 125)]
    for (filename, title, category), (x, y) in zip(cards, positions):
        image_card(c, ART / filename, title, category, x, y, 173, 245, 0.45)

    page_mark(c, 6)
    c.showPage()


def build():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    TMP.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT), pagesize=A4, pageCompression=1)
    c.setTitle("Ye Naing Thant - Graphic Designer CV and Portfolio")
    c.setAuthor("Ye Naing Thant")
    c.setSubject("Graphic Designer CV and Selected Portfolio")
    for renderer in (page_one, page_two, page_three, page_four, page_five, page_six):
        renderer(c)
    c.save()
    PUBLIC_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(OUTPUT, PUBLIC_OUTPUT)
    print(OUTPUT)


if __name__ == "__main__":
    build()
