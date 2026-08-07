const Categories = {
  Glasses: {
    BALLOON: { name: "Pahar balloon / pahar de vin", icon: "fa-wine-glass" },
    MARTINI: { name: "Pahar de martini (cocktail)", icon: "fa-martini-glass" },
    ROCKS: { name: "Pahar rocks (old fashioned)", icon: "fa-whiskey-glass" },
    ROCKS_OR_WINE: { name: "Pahar rocks sau pahar de vin", icon: "fa-whiskey-glass" },
    HIGHBALL: { name: "Pahar highball", icon: "fa-glass-water" },
    ROCKS_OR_MUG: { name: "Pahar rocks sau cană de lemn", icon: "fa-mug-hot" },
    MUG: { name: "Cană de ceramică sau tablă", icon: "fa-mug-hot" }
  },
  
  // Hand-drawn barware SVGs (inner markup only) — real tool shapes, tinted via currentColor.
  // No open icon set carries a Hawthorne strainer / cobbler shaker, so these are custom.
  Tools: {
    BAR_SPOON: { name: "Lingură de bar", svg: '<ellipse cx="7.5" cy="17.5" rx="3" ry="2.2" transform="rotate(-35 7.5 17.5)"/><path d="M9.5 15.5 17 5"/><circle cx="18" cy="3.6" r="1.2"/>' },
    CITRUS_KNIFE: { name: "Cuțit pentru citrice", svg: '<path d="M3.5 17 14 6.5a2.1 2.1 0 0 1 3 3L6.5 20z"/><path d="M14 9.5 17 6.5"/>' },
    CHOPPING_BOARD: { name: "Tocător", svg: '<rect x="4.5" y="6" width="15" height="13" rx="2"/><circle cx="12" cy="9" r="1.1"/>' },
    SHAKER: { name: "Shaker", svg: '<path d="M10 3h4v2.2h-4z"/><path d="M9.2 5.2h5.6l-.3 2H9.5z"/><path d="M9.4 7.2 8.6 18.8a1.5 1.5 0 0 0 1.5 1.6h3.8a1.5 1.5 0 0 0 1.5-1.6L14.6 7.2z"/><path d="M9 12h6"/>' },
    STRAINER: { name: "Strecurătoare", svg: '<ellipse cx="10.5" cy="12.5" rx="6.5" ry="5.8"/><path d="M15 8.3 20 4"/><path d="M4.2 12.5h12.6"/><path d="M4.6 15.4c.9-1.1 1.8-1.1 2.7 0s1.8 1.1 2.7 0 1.8-1.1 2.7 0 1.8 1.1 2.7 0"/><circle cx="8.5" cy="9.6" r=".55" fill="currentColor" stroke="none"/><circle cx="10.8" cy="9.2" r=".55" fill="currentColor" stroke="none"/><circle cx="13" cy="9.7" r=".55" fill="currentColor" stroke="none"/>' },
    ESPRESSO_MACHINE: { name: "Espressor / cafea rece", icon: "fa-mug-hot" },
    MIXING_GLASS: { name: "Pahar amestec", svg: '<path d="M7.5 5.5h9l-1 13.5a1 1 0 0 1-1 .9H9.5a1 1 0 0 1-1-.9z"/><path d="M7.5 5.5 5.3 3.5"/><path d="M8.2 10h8.6"/>' },
    BLENDER: { name: "Blender", svg: '<path d="M8 3.5h8l-1 10.5H9z"/><path d="M8 6.2h8"/><path d="M9 14h6l-.4 3.6a1 1 0 0 1-1 .9h-3.2a1 1 0 0 1-1-.9z"/>' },
    MUDDLER: { name: "Muddler (pisălog)", svg: '<path d="M10 3h4v3h-4z"/><path d="M10.6 6h2.8l.5 9.5h-3.8z"/><path d="M9.7 15.5h4.6l.5 3.6a.9.9 0 0 1-.9 1H10.1a.9.9 0 0 1-.9-1z"/>' },
    GRATER: { name: "Răzătoare mică", svg: '<path d="M8.5 4h7"/><path d="M8.5 4 6.5 20h11L15.5 4"/><path d="M10 8.5l1-.7M13 8.5l1-.7M9.5 12.5l1-.7M12.5 12.5l1-.7M9 16.5l1-.7M12 16.5l1-.7"/>' }
  },
  
  // isIce lets the card renderer split these into their own section. Shapes drawn to match the ice type.
  Ice: {
    PLENTY: { name: "Gheață din belșug", isIce: true, svg: '<rect x="3.2" y="10" width="7" height="7" rx="1.5"/><rect x="10.8" y="11.8" width="6.4" height="6.4" rx="1.4"/><rect x="8" y="4.4" width="7" height="7" rx="1.5"/>' },
    STANDARD: { name: "Gheață", isIce: true, svg: '<rect x="4" y="8" width="8" height="8" rx="1.6"/><rect x="12" y="11" width="7" height="7" rx="1.6"/>' },
    LARGE_CUBE: { name: "1 cub mare de gheață", isIce: true, svg: '<path d="M12 3 4 7.5 12 12 20 7.5z"/><path d="M4 7.5 4 16.5 12 21 12 12z"/><path d="M20 7.5 20 16.5 12 21 12 12z"/>' },
    CRUSHED: { name: "Gheață pisată", isIce: true, svg: '<path d="M6 14l3-3 2.2 2.2-2 3.2z"/><path d="M12.5 15l3-2 2 3-3 2.2z"/><path d="M9 7.5l3-1 1.2 3-3 1.2z"/><path d="M14.5 8l2.2 1-1 2.2-2.2-1z"/>' },
    NONE: { name: "Fără gheață", isIce: true, svg: '<rect x="6" y="7" width="11" height="11" rx="1.8"/><path d="M4.5 4.5 19 19"/>' }
  }
};

function renderIngredientWithCategoryIcon(item) {
  // If the item is a category object (has name and icon/svg)
  if (item && item.name) {
    // Prefer custom barware SVG, else Font Awesome icon.
    if (item.svg) {
      return `<span class="icon-wrapper"><svg class="tool-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${item.svg}</svg></span> <span class="ingredient-text">${item.name}</span>`;
    } else if (item.icon) {
      return `<span class="icon-wrapper"><i class="fa-solid ${item.icon} recipe-icon"></i></span> <span class="ingredient-text">${item.name}</span>`;
    }
  }
  
  // Fallback for simple strings (like liquid ingredients)
  return `<span class="icon-wrapper"><i class="fa-solid fa-circle-dot recipe-icon"></i></span> <span class="ingredient-text">${item}</span>`;
}
