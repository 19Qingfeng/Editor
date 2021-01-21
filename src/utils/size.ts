// 获得实际尺寸 在当前画布上的位移
const getActualDisplaySize = (size: number, scale: number): number => {
  return size / scale;
};

// 获得显示的JSON尺寸
const getFormatJsonSize = (size: number, scale: number): number => {
  // return size * scale;
  return size * scale;
};

// 距离body左上角偏移量
const getOffsetSize = function(Node: any, offset?: any): any {
  if (!offset) {
    offset = {
      x: 0,
      y: 0
    };
  }
  if (Node === document.body) return offset;
  offset.x = offset.x + Node.offsetLeft;
  offset.y = offset.y + Node.offsetTop;
  return getOffsetSize(Node.offsetParent, offset);
};

export { getFormatJsonSize, getActualDisplaySize, getOffsetSize };
