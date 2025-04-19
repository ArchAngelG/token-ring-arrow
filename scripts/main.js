Hooks.once("ready", () => {

  function drawArrowToToken(token, attempt = 0) {
    if (!token || token.arrowSprite) return;

    if (!token.children || token.w === 0 || token.h === 0) {
      if (attempt < 10) {
        return setTimeout(() => drawArrowToToken(token, attempt + 1), 100);
      }
      return;
    }

    const texture = PIXI.Texture.from("modules/token-ring-arrow/assets/ring-arrow.webp");

    if (!texture.baseTexture.valid) {
      texture.baseTexture.once("loaded", () => {
        drawArrowToToken(token, attempt + 1);
      });
      return;
    }

    const container = new PIXI.Container();
    container.name = "arrowContainer";
    container.position.set(token.w / 2, token.h / 2);

    const arrow = new PIXI.Sprite(texture);
    arrow.name = "arrowSprite";
    arrow.anchor.set(0.5);
    arrow.width = token.w * 0.3;
    arrow.height = token.h * 0.3;
    arrow.position.set(0, token.h / 2);
    arrow.alpha = 1;
    arrow.zIndex = 100;

    container.addChild(arrow);
    token.addChild(container);
    token.arrowSprite = container;

    container.rotation = Math.toRadians(token.document.rotation);
  }

  function drawArrowsForAllTokens() {
    for (const token of canvas.tokens.placeables) {
      drawArrowToToken(token);
    }
  }

  Hooks.on("canvasReady", () => {
    setTimeout(drawArrowsForAllTokens, 200);
  });

  Hooks.once("renderSceneControls", () => {
    setTimeout(drawArrowsForAllTokens, 500);
  });

  Hooks.on("createToken", async doc => {
    const token = canvas.tokens.get(doc.id);
    if (token) drawArrowToToken(token);
  });

  Hooks.on("updateToken", (doc, change) => {
    const token = canvas.tokens.get(doc.id);
    if (!token || !token.arrowSprite) return;

    const rotation = change.rotation ?? doc.rotation;
    token.arrowSprite.rotation = Math.toRadians(rotation);
  });

  // Optional: single startup log
  console.log("✅ Token Ring Arrow module initialized.");
});
