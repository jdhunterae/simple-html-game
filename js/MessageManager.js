// === MessageManager.js ===
class MessageManager {
  constructor(ctx, canvasWidth, canvasHeight) {
    this.ctx = ctx;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    // configuration options
    this.config = {
      font: '32px Arial',
      textColor: 'white',
      boxColor: 'rgba(0, 0, 0, 0.7)',
      padding: 20,
      lineHeight: 40,
      animationDuration: 300,
    };
  }

  wrapText(text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    this.ctx.font = this.config.font;

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

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  displayMessage(text, options = {}) {
    const config = { ...this.config, ...options };
    const maxWidth = this.canvasWidth - config.padding * 2;
    const lines = this.wrapText(text, maxWidth);

    const boxHeight = lines.length * config.lineHeight + config.padding * 2;
    const boxWidth =
      Math.max(...lines.map((line) => this.ctx.measureText(line).width)) +
      config.padding * 2;

    const boxX = (this.canvasWidth - boxWidth) / 2;
    const boxY = (this.canvasHeight - boxHeight) / 2;

    // draw box
    this.ctx.fillStyle = config.boxColor;
    this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

    // draw text
    this.ctx.fillStyle = config.textColor;
    this.ctx.font = config.font;
    this.ctx.textAlign = 'center';

    lines.forEach((line, index) => {
      const textX = this.canvasWidth / 2;
      const textY = boxY + config.padding + config.lineHeight * index + 30;
      this.ctx.fillText(line, textX, textY);
    });
  }

  displayError(text) {
    this.displayMessage(text, {
      boxColor: 'rgba(255, 0, 0, 0.7)',
      textColor: 'white',
    });
  }

  displaySuccess(text) {
    this.displayMessage(text, {
      boxColor: 'rgba(0, 128, 0, 0.7)',
      textColor: 'white',
    });
  }
}
