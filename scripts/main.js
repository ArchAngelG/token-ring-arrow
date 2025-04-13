Hooks.once("ready", () => {
  console.log("🧭 Token Ring Arrow Module Ready");

  libWrapper.register("token-ring-arrow", "Token.prototype.drawEffects", function (wrapped, ...args) {
    const result = wrapped(...args);

    // Avoid duplicate sprites
    if (this.ringArrow) return result;

    const texture = PIXI.Texture.from("modules/token-ring-arrow/assets/ring-arrow.webp");
    const sprite = new PIXI.Sprite(texture);
    sprite.anchor.set(0.5);
    sprite.width = this.w * 1.5;
    sprite.height = this.h * 1.5;
    sprite.zIndex = 100;

    sprite.rotation = Math.toRadians(this.document.rotation);
    this.effectsContainer.addChild(sprite);
    this.ringArrow = sprite;

    return result;
  }, 'WRAPPER');

  // Keep ring in sync with token rotation
  Hooks.on("updateToken", (doc, change) => {
    const token = canvas.tokens.get(doc.id);
    if (!token || !token.ringArrow) return;

    const rotation = change.rotation ?? doc.rotation;
    token.ringArrow.rotation = Math.toRadians(rotation);
  });
});
