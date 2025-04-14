Hooks.once("ready", () => {
  console.log("🧭 Token Ring Arrow Module Ready");

  libWrapper.register("token-ring-arrow", "Token.prototype.drawEffects", function (wrapped, ...args) {
    const result = wrapped(...args);

    if (!this.effectsContainer) {
      console.warn(`⚠️ Token '${this.name}' has no effectsContainer yet.`);
      return result;
    }

    if (this.arrowSprite) return result;

    const texture = PIXI.Texture.from("modules/token-ring-arrow/assets/ring-arrow.webp");

    if (!texture.baseTexture.valid) {
      console.warn("❗ ring-arrow.webp could not be loaded or hasn't been cached.");
      return result;
    }

    const arrow = new PIXI.Sprite(texture);
    arrow.anchor.set(0.5);
    arrow.width = this.w * 0.5;
    arrow.height = this.h * 0.5;
    arrow.position.set(this.w / 2, 0);
    arrow.rotation = Math.toRadians(this.document.rotation);
    arrow.zIndex = 100;

    this.effectsContainer.addChild(arrow);
    this.arrowSprite = arrow;

    console.log(`✅ Arrow sprite added to token: ${this.name}`);
    return result;
  }, 'WRAPPER');

  Hooks.on("updateToken", (doc, change) => {
    const token = canvas.tokens.get(doc.id);
    if (!token || !token.arrowSprite) return;

    const rotation = change.rotation ?? doc.rotation;
    token.arrowSprite.rotation = Math.toRadians(rotation);
  });
});
