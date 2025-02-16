const colorPalettes = [
  [{ rgb: [50, 0, 80] }, { rgb: [200, 60, 50] }, { rgb: [255, 180, 130] }], // Dark Sunset
  [{ rgb: [10, 80, 10] }, { rgb: [140, 60, 20] }, { rgb: [255, 240, 130] }], // Dark Nature
  [{ rgb: [50, 60, 100] }, { rgb: [120, 180, 200] }, { rgb: [240, 255, 255] }], // Dark Ocean
  [{ rgb: [150, 10, 30] }, { rgb: [220, 80, 20] }, { rgb: [255, 240, 230] }], // Warm Tones Darker
  [{ rgb: [0, 0, 0] }, { rgb: [70, 70, 70] }, { rgb: [240, 240, 240] }], // Dark Monochrome
  [{ rgb: [160, 20, 90] }, { rgb: [220, 40, 140] }, { rgb: [255, 180, 220] }], // Dark Pink Shades
  [{ rgb: [0, 90, 90] }, { rgb: [10, 150, 140] }, { rgb: [120, 240, 240] }], // Dark Teal Blend
  [{ rgb: [120, 60, 10] }, { rgb: [180, 150, 100] }, { rgb: [255, 220, 200] }], // Earthy Tones Darker
  [{ rgb: [80, 0, 150] }, { rgb: [120, 30, 200] }, { rgb: [200, 120, 220] }], // Purple Harmony Darker
  [{ rgb: [100, 0, 0] }, { rgb: [150, 20, 30] }, { rgb: [255, 130, 90] }], // Deep Reds Darker
  [{ rgb: [10, 70, 10] }, { rgb: [20, 100, 20] }, { rgb: [40, 220, 120] }], // Dark Fresh Greens
  [{ rgb: [180, 80, 60] }, { rgb: [230, 110, 80] }, { rgb: [255, 190, 160] }], // Dark Soft Coral
  [{ rgb: [10, 40, 40] }, { rgb: [50, 60, 80] }, { rgb: [140, 150, 170] }], // Muted Greys Darker
  [{ rgb: [0, 100, 150] }, { rgb: [50, 150, 200] }, { rgb: [180, 220, 240] }], // Sky Blue Darker
  [{ rgb: [80, 0, 0] }, { rgb: [120, 30, 30] }, { rgb: [190, 90, 90] }], // Dark Reds Darker
  [{ rgb: [200, 50, 0] }, { rgb: [220, 70, 40] }, { rgb: [255, 170, 90] }], // Bright Oranges Darker
  [{ rgb: [120, 80, 10] }, { rgb: [150, 100, 30] }, { rgb: [230, 190, 90] }], // Golden Hues Darker
  [{ rgb: [0, 50, 50] }, { rgb: [30, 60, 70] }, { rgb: [120, 190, 190] }], // Deep Teal Darker
  [{ rgb: [50, 60, 20] }, { rgb: [80, 100, 30] }, { rgb: [140, 220, 70] }], // Olive Green Darker
  [{ rgb: [150, 100, 20] }, { rgb: [200, 140, 40] }, { rgb: [255, 255, 60] }], // Bright Yellow Darker
  [{ rgb: [180, 100, 50] }, { rgb: [220, 120, 70] }, { rgb: [255, 210, 180] }], // Soft Pastel Darker
  [{ rgb: [20, 10, 100] }, { rgb: [60, 50, 150] }, { rgb: [130, 110, 240] }], // Indigo Shades Darker
  [{ rgb: [20, 150, 150] }, { rgb: [40, 180, 170] }, { rgb: [120, 240, 250] }], // Aqua Blues Darker
  [{ rgb: [100, 100, 0] }, { rgb: [130, 180, 50] }, { rgb: [180, 200, 130] }], // Mossy Green Darker
  [{ rgb: [120, 60, 20] }, { rgb: [180, 120, 80] }, { rgb: [240, 220, 160] }], // Warm Neutrals Darker
  [{ rgb: [180, 80, 50] }, { rgb: [220, 100, 60] }, { rgb: [255, 200, 180] }], // Light Salmon Darker
  [{ rgb: [180, 60, 80] }, { rgb: [220, 120, 130] }, { rgb: [255, 220, 220] }], // Soft Pinks Darker
  [{ rgb: [50, 70, 120] }, { rgb: [60, 100, 160] }, { rgb: [130, 150, 255] }], // Cool Blues Darker
  [{ rgb: [40, 60, 30] }, { rgb: [50, 80, 40] }, { rgb: [140, 190, 80] }], // Earth Greens Darker
  [{ rgb: [140, 50, 90] }, { rgb: [180, 70, 120] }, { rgb: [255, 80, 160] }], // Vibrant Magenta Darker
  [{ rgb: [70, 80, 100] }, { rgb: [90, 100, 120] }, { rgb: [190, 210, 230] }], // Soft Blues Darker
  [{ rgb: [100, 60, 10] }, { rgb: [130, 70, 30] }, { rgb: [180, 110, 60] }], // Rustic Browns Darker
  [{ rgb: [60, 40, 100] }, { rgb: [80, 60, 120] }, { rgb: [160, 140, 240] }], // Deep Purples Darker
  [{ rgb: [200, 80, 20] }, { rgb: [230, 100, 40] }, { rgb: [255, 190, 110] }], // Autumn Hues Darker
  [{ rgb: [0, 0, 60] }, { rgb: [20, 10, 100] }, { rgb: [100, 110, 230] }], // Deep Navy Darker
  [{ rgb: [200, 50, 0] }, { rgb: [180, 30, 20] }, { rgb: [255, 140, 80] }], // Fiery Reds Darker
  [{ rgb: [10, 50, 10] }, { rgb: [20, 80, 30] }, { rgb: [40, 160, 60] }], // Forest Greens Darker
  [{ rgb: [140, 130, 90] }, { rgb: [180, 170, 120] }, { rgb: [250, 250, 210] }], // Soft Yellows Darker
  [{ rgb: [220, 60, 20] }, { rgb: [250, 90, 50] }, { rgb: [255, 200, 130] }], // Coral Blush Darker
  [{ rgb: [100, 0, 120] }, { rgb: [120, 20, 140] }, { rgb: [200, 110, 230] }], // Rich Purple Darker
  [{ rgb: [200, 40, 40] }, { rgb: [220, 70, 70] }, { rgb: [255, 150, 150] }], // Bold Reds Darker
];

export default colorPalettes;
