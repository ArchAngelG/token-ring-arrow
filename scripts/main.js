Hooks.once("ready", () => {
  console.log("🧭 Token Ring Arrow Module Ready");

  libWrapper.register("token-ring-arrow", "Token.prototype.drawEffects", function (wrapped, ...args) {
    const result = wrapped(...args);

    if (this.arrowSprite) return result;

    // Load the triangle arrow sprite
    const texture = PIXI.Texture.from("modules/token-ring-arrow/assets/triangle-arrow.webp");
    const arrow = new PIXI.Sprite(texture);

    arrow.anchor.set(0.5);
    arrow.width = this.w * 0.5;  // Adjust size as needed
    arrow.height = this.h * 0.5;
    arrow.zIndex = 100;

    // Position the arrow at the top edge of the token
    arrow.position.set(this.w / 2, 0);

    // Rotate to match token's facing
    arrow.rotation = Math.toRadians(this.document.rotation);

    this.effectsContainer.addChild(arrow);
    this.arrowSprite = arrow;

    return result;
  }, 'WRAPPER');

  Hooks.on("updateToken", (doc, change) => {
    const token = canvas.tokens.get(doc.id);
    if (!token || !token.arrowSprite) return;

    const rotation = change.rotation ?? doc.rotation;
    token.arrowSprite.rotation = Math.toRadians(rotation);
  });
});
