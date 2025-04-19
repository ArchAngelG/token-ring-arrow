Hooks.once("ready", () => {
  ui.notifications.info("🧭 Token Ring Arrow Active");

  for (const token of canvas.tokens.placeables) {
    if (token.arrowSprite) continue;

    const texture = PIXI.Texture.from("modules/token-ring-arrow/assets/ring-arrow.webp");
    const sprite = new PIXI.Sprite(texture);
    sprite.anchor.set(0.5);
    sprite.width = token.w * 0.15;
    sprite.height = token.h * 0.15;
    sprite.zIndex = 100;

    token.addChild(sprite);
    token.arrowSprite = sprite;

    const rotation = token.document.rotation;
    updateArrowPositionAndDirection(token, rotation);
  }
});

Hooks.on("updateToken", (doc, change) => {
  const token = canvas.tokens.get(doc.id);
  if (!token || !token.arrowSprite) return;

  const rotation = change.rotation ?? doc.rotation;
  updateArrowPositionAndDirection(token, rotation);
});

function updateArrowPositionAndDirection(token, rotationDegrees) {
  const arrow = token.arrowSprite;
  const radius = token.w / 2 + 10;
  const angle = Math.toRadians(rotationDegrees - 90);

  const x = (token.w / 2) + radius * Math.cos(angle);
  const y = (token.h / 2) + radius * Math.sin(angle);
  arrow.position.set(x, y);

  arrow.rotation = angle + Math.PI / 2;
}
