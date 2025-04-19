Hooks.once("ready", () => {
  ui.notifications.info("✅ Token Ring Arrow module is running!");

  for (const token of canvas.tokens.placeables) {
    // Retry drawing for up to 10 attempts
    let attempt = 0;

    const drawTriangle = () => {
      if (!token.effectsContainer) {
        if (attempt++ < 10) return setTimeout(drawTriangle, 100);
        console.warn(`❗ No effectsContainer for ${token.name}`);
        return;
      }

      const arrow = new PIXI.Graphics();
      arrow.beginFill(0x00ff00, 0.9); // bright green
      arrow.lineStyle(2, 0x000000);
      arrow.drawPolygon([0, -20, 12, 10, -12, 10]);
      arrow.endFill();

      arrow.anchor?.set?.(0.5); // try to center, just in case
      arrow.position.set(token.w / 2, 0);
      arrow.zIndex = 100;

      token.effectsContainer.addChild(arrow);
      console.log(`✅ Triangle added to: ${token.name}`);
    };

    drawTriangle();
  }
});
