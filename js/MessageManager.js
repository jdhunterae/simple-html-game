// === MessageManager.js ===
class MessageManager {
  constructor(ctx, canvasWidth, canvasHeight) {
    this.ctx = ctx;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    this.font = '32px Arial';
    this.textColor = 'white';
    this.boxColor = 'rgba(0, 0, 0, 0.7)';
    this.padding = 20;
  }

  wrapText(text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    this.ctx.font = this.font;

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = this.ctx.measureText(testLine);
      if (metrics.width > maxWidth) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) lines.push(currentLine);

    return lines;
  }

  displayMessage(text) {
    const maxWidth = this.canvasWidth - this.padding * 2;
    const lines = this.wrapText(text, maxWidth);

    const lineHeight = 40;
    const boxHeight = lines.length * lineHeight + this.padding * 2;
    const boxWidth =
      Math.max(...lines.map((line) => this.ctx.measureText(line).width)) +
      this.padding * 2;

    const boxX = (this.canvasWidth - boxWidth) / 2;
    const boxY = (this.canvasHeight - boxHeight) / 2;

    // draw box
    this.ctx.fillStyle = this.boxColor;
    this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

    // draw text
    this.ctx.fillStyle = this.textColor;
    this.ctx.font = this.font;
    this.ctx.textAlign = 'center';

    lines.forEach((line, index) => {
      const textX = this.canvasWidth / 2;
      const textY = boxY + this.padding + lineHeight * index + 30;
      this.ctx.fillText(line, textX, textY);
    });
  }
}
