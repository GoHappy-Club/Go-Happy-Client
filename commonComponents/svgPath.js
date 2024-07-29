export const rectangleSvgPath = ({ position, size, canvasSize }) => {
  const padding = 10;
  const borderRadius = 15;
  const x = (position.x?._value ?? position.x ?? 0) - padding;
  const y = (position.y?._value ?? position.y ?? 0) - padding;
  const width = (size.x?._value ?? size.x ?? 0) + padding * 2;
  const height = (size.y?._value ?? size.y ?? 0) + padding * 2;

  const safeWidth = Math.max(width, borderRadius * 2);
  const safeHeight = Math.max(height, borderRadius * 2);

  if (isNaN(x) || isNaN(y) || isNaN(safeWidth) || isNaN(safeHeight)) {
    return `M0,0H${canvasSize.x}V${canvasSize.y}H0V0Z`;
  }

  return `M0,0H${canvasSize.x}V${canvasSize.y}H0V0Z
              M${x + borderRadius},${y}
              h${safeWidth - 2 * borderRadius}
              a${borderRadius},${borderRadius} 0 0 1 ${borderRadius},${borderRadius}
              v${safeHeight - 2 * borderRadius}
              a${borderRadius},${borderRadius} 0 0 1 -${borderRadius},${borderRadius}
              h-${safeWidth - 2 * borderRadius}
              a${borderRadius},${borderRadius} 0 0 1 -${borderRadius},-${borderRadius}
              v-${safeHeight - 2 * borderRadius}
              a${borderRadius},${borderRadius} 0 0 1 ${borderRadius},-${borderRadius}
              Z`;
};
