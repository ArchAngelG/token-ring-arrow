Hooks.once("libWrapper.Ready", () => {
  const TokenClass = CONFIG.Token.objectClass;

  libWrapper.register("token-ring-arrow", `${TokenClass.name}.prototype.draw`, async function(wrapped, ...args) {
    const result = await wrapped.call(this, ...args);

    // Remove previous arrow if exists
    if (this.arrowSprite) {
      this.removeChild(this.arrowSprite);
      this.arrowSprite.destroy({ children: true });
      this.arrowSprite = null;
    }

    const texturePath = "modules/token-ring-arrow/assets/ring-arrow.webp";
    const texture = PIXI.Texture.from(texturePath);

    if (!texture.baseTexture.valid) {
      console.log(`⏳ Waiting for arrow texture for ${this.name}`);
      texture.baseTexture.once("loaded", () => this.draw());
      return result;
    }

    // Build the arrow sprite
    const arrow = new PIXI.Sprite(texture);
    arrow.anchor.set(0.5);
    arrow.width = this.w * 0.3;
    arrow.height = this.h * 0.3;
    arrow.position.set(0, this.h / 2); // 6 o'clock
    arrow.zIndex = 100;

    // Wrap in a container to handle rotation
    const container = new PIXI.Container();
    container.position.set(this.w / 2, this.h / 2);
    container.addChild(arrow);
    container.rotation = Math.toRadians(this.document.rotation);

    this.arrowSprite = container;
    this.addChild(container);

    console.log(`✅ Arrow sprite attached to ${this.name}`);

    return result;
  }, "WRAPPER");
});

Hooks.on("updateToken", (doc, change) => {
  const token = canvas.tokens.get(doc.id);
  if (!token?.arrowSprite) return;

  const rotation = change.rotation ?? doc.rotation;
  token.arrowSprite.rotation = Math.toRadians(rotation);
});
