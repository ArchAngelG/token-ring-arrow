ui.notifications.info("🧠 Token Ring Arrow module is running.");
console.log("🧠 Token Ring Arrow script loaded.");
Hooks.once("ready", () => {
  console.log("🧪 Token Ring Arrow: Testing basic triangle draw");

  libWrapper.register("token-ring-arrow", "Token.prototype.drawEffects", function (wrapped, ...args) {
    const result = wrapped(...args);

    if (this.arrowSprite || !this.visible) return result;

    const tryDrawTriangle = (attempt = 0) => {
      if (!this.effectsContainer) {
        if (attempt < 10) {
          return setTimeout(() => tryDrawTriangle(attempt + 1), 100);
        }
        console.warn(`❗ Still no effectsContainer for ${this.name}`);
        return;
      }

      const arrow = new PIXI.Graphics();
      arrow.beginFill(0x00ff00, 0.9); // bright green
      arrow.lineStyle(2, 0x000000);
      arrow.drawPolygon([0, -20, 12, 10, -12, 10]);
      arrow.endFill();

      arrow.position.set(this.w / 2, 0);
      arrow.zIndex = 100;
      this.effectsContainer.addChild(arrow);
      this.arrowSprite = arrow;

      console.log(`✅ Green triangle added to: ${this.name}`);
    };

    tryDrawTriangle();
    return result;
  }, 'WRAPPER');
});
