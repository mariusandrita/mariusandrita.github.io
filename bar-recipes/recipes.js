const recipes = [
  {
    name: "Aperol Spritz",
    tagline: "Amar, efervescent, italian",
    iba: true,
    image: "images/aperol-spritz.png",
    theme: "#ff6a00", // Orange
    glass: Categories.Glasses.BALLOON,
    tools: [Categories.Tools.BAR_SPOON, Categories.Tools.CITRUS_KNIFE],
    ingredients: {
      ml: [
        "90 ml prosecco",
        "60 ml Aperol",
        "30 ml apă minerală (soda)",
        Categories.Ice.PLENTY,
        "1 felie de portocală (garnitură)"
      ],
      parts: [
        "3 părți prosecco",
        "2 părți Aperol",
        "1 parte apă minerală (soda)",
        Categories.Ice.PLENTY,
        "1 felie de portocală (garnitură)"
      ]
    },
    method: [
      "Umple paharul cu gheață până sus.",
      "Toarnă prosecco-ul.",
      "Adaugă Aperol.",
      "Completează cu apă minerală.",
      "Amestecă ușor cu lingura de bar, dinspre bază spre suprafață.",
      "Garnisește cu felia de portocală."
    ]
  },
  {
    name: "Hugo",
    tagline: "Floral, ușor, răcoritor",
    image: "images/hugo.png",
    theme: "#87d656", // Elderflower green
    glass: Categories.Glasses.BALLOON,
    tools: [Categories.Tools.BAR_SPOON, Categories.Tools.MUDDLER],
    ingredients: {
      ml: [
        "120 ml prosecco",
        "30 ml sirop de soc",
        "30 ml apă minerală (soda)",
        "Câteva frunze proaspete de mentă",
        Categories.Ice.PLENTY,
        "1 felie de lime (garnitură)"
      ],
      parts: [
        "4 părți prosecco",
        "1 parte sirop de soc",
        "1 parte apă minerală (soda)",
        "Câteva frunze proaspete de mentă",
        Categories.Ice.PLENTY,
        "1 felie de lime (garnitură)"
      ]
    },
    method: [
      "Pune frunzele de mentă în pahar și lovește-le ușor pentru a elibera aromele.",
      "Umple paharul cu gheață.",
      "Adaugă siropul de soc.",
      "Toarnă prosecco-ul și apa minerală.",
      "Amestecă ușor dinspre bază spre suprafață.",
      "Garnisește cu felia de lime și o rămurică de mentă."
    ]
  },
  {
    name: "Bumbo",
    tagline: "Băutura Piraților",
    image: "images/bumbo.png",
    theme: "#a85d20", // Amber rum
    glass: Categories.Glasses.ROCKS_OR_MUG,
    tools: [Categories.Tools.BAR_SPOON, Categories.Tools.GRATER],
    ingredients: {
      ml: [
        "60 ml Rom (ideal Mount Gay sau alt rom ambrat)",
        "30 ml Apă (la temperatura camerei)",
        "10 ml sirop de zahăr brun (sau 2 lingurițe zahăr brun)",
        "1 praf Nucșoară rasă",
        "1 praf Scorțișoară (opțional, autentic)",
        Categories.Ice.NONE
      ],
      parts: [
        "2 părți Rom (ideal Mount Gay sau alt rom ambrat)",
        "1 parte Apă (la temperatura camerei)",
        "1/3 parte sirop de zahăr brun (sau 2 lingurițe zahăr brun)",
        "1 praf Nucșoară rasă",
        "1 praf Scorțișoară (opțional, autentic)",
        Categories.Ice.NONE
      ]
    },
    method: [
      "Pune zahărul și apa în pahar și amestecă până se dizolvă.",
      "Adaugă romul.",
      "Amestecă ușor.",
      "Rade nucșoara deasupra. Se bea fără gheață."
    ]
  },
  {
    name: "Grog",
    tagline: "Băutura Marinei Britanice",
    image: "images/grog.png",
    theme: "#7a491e", // Dark rum brown
    glass: Categories.Glasses.MUG,
    tools: [Categories.Tools.BAR_SPOON],
    ingredients: {
      ml: [
        "45 ml Rom tare (Pusser's, Smith & Cross sau O.F.T.D.)",
        "120 ml Apă (rece sau la temperatura camerei)",
        "15 ml Zeamă de lime (lămâie verde) proaspătă",
        "20 ml sirop de zahăr brun (sau melasă / 4 lingurițe zahăr brun)",
        Categories.Ice.NONE
      ],
      parts: [
        "3 părți Rom tare (Pusser's, Smith & Cross sau O.F.T.D.)",
        "8 părți Apă (rece sau la temperatura camerei)",
        "1 parte Zeamă de lime (lămâie verde) proaspătă",
        "1.5 părți sirop de zahăr brun (sau melasă)",
        Categories.Ice.NONE
      ]
    },
    method: [
      "Pune toate ingredientele într-o cană.",
      "Amestecă energic până când se topește complet zahărul.",
      "Tradițional, se bea tot fără gheață."
    ]
  },
  {
    name: "Classic Margarita",
    tagline: "Rețeta originală cu Don Julio",
    iba: true,
    image: "images/margarita.png",
    theme: "#a8e036", // Lime green
    glass: Categories.Glasses.MARTINI,
    tools: [Categories.Tools.SHAKER, Categories.Tools.STRAINER, Categories.Tools.CITRUS_KNIFE],
    ingredients: {
      ml: [
        "35 ml Tequila Don Julio (Blanco sau Añejo)",
        "20 ml Triple Sec",
        "15 ml Zeamă proaspătă de lime",
        Categories.Ice.STANDARD
      ],
      parts: [
        "7 părți Tequila Don Julio",
        "4 părți Triple Sec",
        "3 părți Zeamă proaspătă de lime",
        Categories.Ice.STANDARD
      ]
    },
    method: [
      "Unge jumătate din buza paharului cu o felie de lime și trece-o prin sare.",
      "Adaugă toate ingredientele lichide în shaker alături de gheață.",
      "Agită energic timp de 15 secunde.",
      "Strecoară în paharul pregătit (chilled).",
      "Garnisește cu o felie de lime."
    ]
  },
  {
    name: "Blue Margarita",
    tagline: "Vibrantă, exotică, albastră",
    image: "images/blue-margarita.png",
    theme: "#00a8e8", // Bright Ocean Blue
    glass: Categories.Glasses.MARTINI,
    tools: [Categories.Tools.SHAKER, Categories.Tools.STRAINER, Categories.Tools.CITRUS_KNIFE],
    ingredients: {
      ml: [
        "35 ml Tequila Don Julio",
        "20 ml Blue Curaçao",
        "15 ml Zeamă proaspătă de lime",
        Categories.Ice.STANDARD
      ],
      parts: [
        "7 părți Tequila Don Julio",
        "4 părți Blue Curaçao",
        "3 părți Zeamă proaspătă de lime",
        Categories.Ice.STANDARD
      ]
    },
    method: [
      "Unge jumătate din buza paharului cu o felie de lime și trece-o prin sare.",
      "Adaugă tequila, Blue Curaçao și zeama de lime în shaker alături de gheață.",
      "Agită energic timp de 15 secunde.",
      "Strecoară în paharul pregătit (chilled).",
      "Garnisește cu o felie de lime."
    ]
  },
  {
    name: "Piña Colada",
    tagline: "Tropical, dulce, cremos",
    iba: true,
    image: "images/pina-colada.png",
    theme: "#fced95", // Pineapple yellow
    glass: Categories.Glasses.HIGHBALL,
    tools: [Categories.Tools.SHAKER, Categories.Tools.STRAINER, Categories.Tools.BLENDER],
    ingredients: {
      ml: [
        "50 ml Captain Morgan White",
        "30 ml Cremă de Cocos naturală",
        "50 ml Suc proaspăt de Ananas",
        Categories.Ice.CRUSHED
      ],
      parts: [
        "5 părți Captain Morgan White",
        "3 părți Cremă de Cocos naturală",
        "5 părți Suc proaspăt de Ananas",
        Categories.Ice.CRUSHED
      ]
    },
    method: [
      "Adaugă romul, crema de cocos și sucul de ananas în shaker alături de gheață.",
      "Agită energic până se omogenizează și devine foarte cremos.",
      "Toarnă cu tot cu gheața din shaker într-un pahar mare (sau blenduiește totul cu gheață pentru frozen).",
      "Garnisește cu o felie de ananas proaspăt."
    ]
  },
  {
    name: "Mojito",
    tagline: "Răcoritor, mentolat, energizant",
    iba: true,
    image: "images/mojito.png",
    theme: "#00b551", // Mint green
    glass: Categories.Glasses.HIGHBALL,
    tools: [Categories.Tools.MUDDLER, Categories.Tools.BAR_SPOON, Categories.Tools.CITRUS_KNIFE],
    ingredients: {
      ml: [
        "45 ml Captain Morgan White",
        "20 ml Zeamă proaspătă de lime",
        "2 lingurițe Zahăr alb de trestie",
        "6 frunze proaspete de mentă",
        "Apă minerală (Soda water) pentru top-up",
        Categories.Ice.CRUSHED
      ],
      parts: [
        "4.5 părți Captain Morgan White",
        "2 părți Zeamă proaspătă de lime",
        "2 lingurițe Zahăr alb de trestie",
        "6 frunze proaspete de mentă",
        "Top-up cu Apă minerală (Soda water)",
        Categories.Ice.CRUSHED
      ]
    },
    method: [
      "Pune menta, zahărul și zeama de lime în pahar.",
      "Zdrobește foarte ușor cu muddler-ul pentru a elibera uleiurile din mentă (nu o rupe!).",
      "Umple paharul cu gheață pisată.",
      "Adaugă romul Captain Morgan White și amestecă bine cu lingura de bar.",
      "Completează cu puțină apă minerală.",
      "Garnisește cu o rămurică de mentă și o felie de lime."
    ]
  },
  {
    name: "Raspberry Mojito",
    tagline: "Fructat, răcoritor, vibrant (Autentic)",
    image: "images/raspberry-mojito.png",
    theme: "#e30b5d", // Raspberry red
    glass: Categories.Glasses.HIGHBALL,
    tools: [Categories.Tools.MUDDLER, Categories.Tools.BAR_SPOON, Categories.Tools.CITRUS_KNIFE],
    ingredients: {
      ml: [
        "45 ml Captain Morgan White",
        "20 ml Zeamă proaspătă de lime",
        "2 lingurițe Zahăr alb de trestie",
        "6 frunze proaspete de mentă",
        "4-5 bucăți Zmeură proaspătă",
        "Apă minerală (Soda water)",
        Categories.Ice.CRUSHED
      ],
      parts: [
        "4.5 părți Captain Morgan White",
        "2 părți Zeamă proaspătă de lime",
        "2 lingurițe Zahăr alb de trestie",
        "6 frunze proaspete de mentă",
        "4-5 bucăți Zmeură proaspătă",
        "Top-up cu Apă minerală",
        Categories.Ice.CRUSHED
      ]
    },
    method: [
      "Pune menta, zmeura, zahărul și zeama de lime în pahar.",
      "Zdrobește ușor cu muddler-ul pentru a elibera sucul de zmeură și uleiurile din mentă.",
      "Umple paharul cu gheață pisată.",
      "Adaugă romul Captain Morgan White și amestecă bine de jos în sus.",
      "Completează cu puțină apă minerală.",
      "Garnisește cu zmeură proaspătă și mentă."
    ]
  },
  {
    name: "Negroni Sbagliato",
    tagline: "Amar, efervescent, „greșit\" (clasic modern)",
    image: "images/negroni-sbagliato.png",
    theme: "#c8102e", // Campari red
    glass: Categories.Glasses.ROCKS,
    tools: [Categories.Tools.BAR_SPOON, Categories.Tools.CITRUS_KNIFE],
    ingredients: {
      ml: [
        "30 ml Campari",
        "30 ml Vermut roșu dulce (Martini / Cinzano Rosso)",
        "60 ml Prosecco (bine răcit)",
        Categories.Ice.LARGE_CUBE,
        "1 felie de portocală (garnitură)"
      ],
      parts: [
        "1 parte Campari",
        "1 parte Vermut roșu dulce (Martini / Cinzano Rosso)",
        "2 părți Prosecco (bine răcit)",
        Categories.Ice.LARGE_CUBE,
        "1 felie de portocală (garnitură)"
      ]
    },
    method: [
      "Pune un cub mare de gheață în pahar.",
      "Toarnă Campari peste gheață.",
      "Adaugă vermutul roșu dulce.",
      "Completează cu prosecco rece, turnat ușor, ca să păstrezi bulele.",
      "Amestecă o dată, delicat, cu lingura de bar.",
      "Garnisește cu o felie de portocală."
    ]
  }
];
