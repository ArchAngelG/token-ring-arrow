Hooks.once("ready", () => {
  console.log("🧭 Token Ring Arrow Module Ready");

  libWrapper.register("token-ring-arrow", "Token.prototype.drawEffects", function (wrapped, ...args) {
    const result = wrapped(...args);

    if (this.arrowSprite || !this.visible) return result;

    const tryAddArrow = (attempt = 0) => {
      if (!this.effectsContainer) {
        if (attempt < 10) {
          setTimeout(() => tryAddArrow(attempt + 1), 100);
        } else {
          console.warn(`❗ effectsContainer still not available for ${this.name} after 10 attempts`);
        }
        return;
      }

      const texture = PIXI.Texture.from("modules/token-ring-arrow/assets/ring-arrow.webp");
      if (!texture.baseTexture.valid) {
        console.warn("❗ Image 'ring-arrow.webp' is not valid or failed to load.");
        return;
      }

      const arrow = new PIXI.Sprite(texture);
      arrow.anchor.set(0.5);
      arrow.width = this.w * 0.5;
      arrow.height = this.h * 0.5;
      arrow.position.set(this.w / 2, 0);
      arrow.rotation = Math.toRadians(this.document.rotation);
      arrow.zIndex = 100;
      arrow.alpha = 1;

      this.effectsContainer.addChild(arrow);
      this.arrowSprite = arrow;

      console.log(`✅ Arrow sprite added to: ${this.name}`);
    };

    tryAddArrow();

    return result;
  }, 'WRAPPER');

  Hooks.on("updateToken", (doc, change) => {
    const token = canvas.tokens.get(doc.id);
    if (!token || !token.arrowSprite) return;

    const rotation = change.rotation ?? doc.rotation;
    token.arrowSprite.rotation = Math.toRadians(rotation);
  });
});
