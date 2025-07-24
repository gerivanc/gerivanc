from PIL import Image, ImageDraw
import os

# Configurations
WIDTH = 300  # Total width of the image
HEIGHT = 100  # Total height of the image
TILE_SIZE = 10  # Size of each tile
FRAMES = 30  # Number of frames for the animation
DELAY = 100  # Delay between frames in milliseconds

# Create output directory if it doesn't exist
os.makedirs("dist", exist_ok=True)

# Function to draw a spiral pattern
def create_spiral_frame(frame_num):
    img = Image.new("RGB", (WIDTH, HEIGHT), color="#1A1A1A")
    draw = ImageDraw.Draw(img)
    
    center_x, center_y = WIDTH // 2, HEIGHT // 2
    radius = min(WIDTH, HEIGHT) // 4
    angle_step = (2 * 3.14159) / (FRAMES * 2)
    
    for i in range(FRAMES):
        angle = (frame_num + i) * angle_step
        x = center_x + int(radius * (1 + 0.1 * i) * (3.14159 - angle) * 0.1 * (angle / 3.14159))
        y = center_y + int(radius * (1 + 0.1 * i) * (angle / 3.14159))
        if 0 <= x < WIDTH and 0 <= y < HEIGHT:
            draw.rectangle(
                [x - TILE_SIZE // 2, y - TILE_SIZE // 2, x + TILE_SIZE // 2, y + TILE_SIZE // 2],
                fill="#00FF88" if i % 2 == 0 else "#00B7EB"
            )
    
    return img

# Generate frames and save as GIF
frames = [create_spiral_frame(i) for i in range(FRAMES)]
frames[0].save(
    "dist/custom-contribution-grid-snake.gif",
    save_all=True,
    append_images=frames[1:],
    duration=DELAY,
    loop=0
)
