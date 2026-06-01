export type Lang = "es" | "en" | "fr" | "de";

export interface ServiceCard {
  title: string;
  desc: string;
  link: string;
}

export interface FooterColumn {
  title: string;
  links: string[];
}

export interface PropertyDetailT {
  loading: string;
  // Breadcrumb
  buy: string;
  rent: string;
  // Page title builder
  pageTitle: (typeLabel: string, rooms: number | null, location: string | null) => string;
  // Metric labels
  sqmBuilt: string;
  sqmUseful: string;
  roomSingular: string;
  roomPlural: string;
  bathSingular: string;
  bathPlural: string;
  floorPrefix: string;
  lastFloor: string;
  yearBuilt: string;
  photos: string;
  // Section titles
  sDescription: string;
  sFeatures: string;
  sEquipment: string;
  sEnergy: string;
  sFloorPlans: string;
  sMultimedia: string;
  // Media links
  watchVideo: string;
  virtualTour: string;
  // Contact card
  requestInfo: string;
  callAgent: string;
  responseGuarantee: string;
  ref: string;
  // Feature labels
  fExterior: string;
  fElevator: string;
  fAC: string;
  fTerrace: string;
  fBalcony: string;
  fWardrobes: string;
  fGarage: string;
  fStorage: string;
  fPool: string;
  fGarden: string;
  fAccessibleExt: string;
  fAccessibleInt: string;
  // Equipment detail labels
  lKitchen: string;
  lHeating: string;
  lCondition: string;
  kFullFurnished: string;
  kFullUnfurnished: string;
  kEmpty: string;
  hCentral: string;
  hIndividual: string;
  hNone: string;
  fuelGas: string;
  fuelElectric: string;
  fuelGasoil: string;
  fuelOther: string;
  condNew: string;
  condGood: string;
  condRenovation: string;
  // Property type labels
  ptApartment: string;
  ptHouse: string;
  ptStudio: string;
  ptPenthouse: string;
  ptDuplex: string;
  ptCommercial: string;
  ptOffice: string;
  ptLand: string;
  ptGarage: string;
  ptStorage: string;
}

export interface T {
  nav: {
    items: string[];
    login: string;
  };
  hero: {
    h1Before: string;
    h1After: string;
    tabs: string[];
    placeholders: string[];
    searchBtn: string;
  };
  services: {
    heading: string;
    subtitle: string;
    cards: ServiceCard[];
  };
  barrios: {
    heading: string;
    subtitle: string;
    from: string;
    luxury: string;
  };
  newcomers: {
    badge: string;
    h2: string;
    desc: string;
    btn: string;
  };
  agent: {
    h2: string;
    desc: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    phonePlaceholder: string;
    purposes: string[];
    purposeProperty: string; // template — replace {ref} with the property reference
    btn: string;
    sending: string;
    successTitle: string;
    successSub: string;
    successRef: string;
    errorMsg: string;
    privacyNotice: string;
    privacyLink: string;
    privacyNoticeSuffix: string;
  };
  footer: {
    brandDesc: string;
    columns: FooterColumn[];
    copyright: string;
    legal: string[];
  };
  propertyDetail: PropertyDetailT;
}

export const translations: Record<Lang, T> = {
  es: {
    nav: {
      items: ["Comprar", "Alquilar", "Propietario", "Vivir en Madrid", "Servicio de Concierge", "Contacto"],
      login: "Iniciar sesión",
    },
    hero: {
      h1Before: "Tu próximo hogar en",
      h1After: "empieza aquí.",
      tabs: ["Comprar", "Alquilar", "Vender"],
      placeholders: [
        "Busca por barrio, dirección o código postal…",
        "Busca pisos en alquiler en Madrid…",
        "Introduce la dirección de tu propiedad…",
      ],
      searchBtn: "Buscar",
    },
    services: {
      heading: "¿Qué necesitas?",
      subtitle: "Te acompañamos en cada paso, desde la búsqueda hasta la firma",
      cards: [
        { title: "Comprar", desc: "Accede a propiedades exclusivas antes de que salgan al mercado. Nuestros agentes negocian las mejores condiciones para ti.", link: "Ver propiedades" },
        { title: "Alquilar", desc: "Pisos verificados, contratos transparentes y acompañamiento completo. Encuentra tu hogar en Madrid sin estrés.", link: "Explorar alquileres" },
        { title: "Servicios al Propietario", desc: "Valoración gratuita, fotografía profesional, marketing digital y gestión integral. Te acompañamos en cada paso para que vendas o alquiles al mejor precio.", link: "Solicitar valoración" },
        { title: "Servicios al Inquilino/Comprador", desc: "Tu Personal Shopper Inmobiliario. Búsqueda a medida, asesoría experta y servicio de concierge para que encuentres exactamente lo que buscas.", link: "Descubre más" },
      ],
    },
    barrios: {
      heading: "Explora los barrios de Madrid",
      subtitle: "Descubre las zonas con más demanda y encanto de la capital",
      from: "Desde",
      luxury: "Lujo y exclusividad",
    },
    newcomers: {
      badge: "🌍 Vivir en Madrid",
      h2: "¿Acabas de llegar a Madrid?",
      desc: "Te ayudamos con la búsqueda de vivienda, los trámites de instalación y la adaptación a tu nuevo barrio. Sabemos lo que necesitas porque lo hemos vivido.",
      btn: "Agenda una consulta gratuita →",
    },
    agent: {
      h2: "Habla con un agente de Korner Club",
      desc: "Te conectamos con un experto local sin compromiso. Conoce el mercado, resuelve tus dudas y da el primer paso hacia tu nuevo hogar.",
      namePlaceholder: "Tu nombre",
      emailPlaceholder: "Email",
      phonePlaceholder: "Teléfono (opcional)",
      purposes: ["Quiero comprar", "Quiero alquilar", "Quiero vender", "Acabo de llegar a Madrid"],
      purposeProperty: "Quiero información acerca de la propiedad {ref}",
      btn: "Contactar agente",
      sending: "Enviando…",
      successTitle: "¡Mensaje enviado!",
      successSub: "Un agente se pondrá en contacto contigo pronto.",
      successRef: "Referencia:",
      errorMsg: "Algo ha fallado. Por favor, inténtalo de nuevo.",
      privacyNotice: "Al enviar este formulario aceptas nuestra ",
      privacyLink: "Política de Privacidad",
      privacyNoticeSuffix: ".",
    },
    propertyDetail: {
      loading: "Cargando propiedad…",
      buy: "Comprar", rent: "Alquiler",
      pageTitle: (type, rooms, loc) => `${type}${rooms ? ` de ${rooms} habitacion${rooms === 1 ? "" : "es"}` : ""}${loc ? ` en ${loc}` : ""}`,
      sqmBuilt: "Construidos", sqmUseful: "Útiles",
      roomSingular: "Hab.", roomPlural: "Habs.",
      bathSingular: "Baño", bathPlural: "Baños",
      floorPrefix: "Planta", lastFloor: "Última", yearBuilt: "Año", photos: "fotos",
      sDescription: "Descripción", sFeatures: "Características", sEquipment: "Equipamiento",
      sEnergy: "Eficiencia energética", sFloorPlans: "Planos", sMultimedia: "Multimedia",
      watchVideo: "▶ Ver vídeo", virtualTour: "🔭 Visita virtual",
      requestInfo: "Solicitar información", callAgent: "Llamar al agente",
      responseGuarantee: "Respuesta garantizada en menos de 24h", ref: "Ref:",
      fExterior: "Exterior", fElevator: "Ascensor", fAC: "Aire acondicionado",
      fTerrace: "Terraza", fBalcony: "Balcón", fWardrobes: "Armarios empotrados",
      fGarage: "Garaje incluido", fStorage: "Trastero", fPool: "Piscina", fGarden: "Jardín",
      fAccessibleExt: "Acceso exterior adaptado", fAccessibleInt: "Acceso interior adaptado",
      lKitchen: "Cocina", lHeating: "Calefacción", lCondition: "Estado",
      kFullFurnished: "Equipada y amueblada", kFullUnfurnished: "Equipada, sin amueblar", kEmpty: "Vacía, sin amueblar",
      hCentral: "Central", hIndividual: "Individual", hNone: "Sin calefacción",
      fuelGas: "gas", fuelElectric: "eléctrico", fuelGasoil: "gasóleo", fuelOther: "otro",
      condNew: "Obra nueva", condGood: "Buen estado", condRenovation: "A reformar",
      ptApartment: "Piso", ptHouse: "Casa", ptStudio: "Estudio", ptPenthouse: "Ático",
      ptDuplex: "Dúplex", ptCommercial: "Local comercial", ptOffice: "Oficina",
      ptLand: "Terreno", ptGarage: "Garaje", ptStorage: "Trastero",
    },
    footer: {
      brandDesc: "Inmobiliaria digital en Madrid. Especialistas en acompañar a recién llegados en su proceso de instalación y búsqueda de vivienda. Tu barrio, tu Korner.",
      columns: [
        { title: "Comprar", links: ["Pisos en venta", "Casas en venta", "Áticos", "Obra nueva", "Guía del comprador"] },
        { title: "Alquilar", links: ["Pisos en alquiler", "Estudios", "Alquiler temporal", "Guía del inquilino"] },
        { title: "Propietario", links: ["Por qué Korner Club", "Home staging", "Guía del vendedor"] },
        { title: "Empresa", links: ["Sobre nosotros", "Nuestro equipo", "Contacto"] },
      ],
      copyright: "© 2026 Korner Ventures, S.L. Todos los derechos reservados.",
      legal: ["Aviso legal", "Privacidad", "Cookies"],
    },
  },

  en: {
    nav: {
      items: ["Buy", "Rent", "Owner", "Living in Madrid", "Concierge Service", "Contact"],
      login: "Log in",
    },
    hero: {
      h1Before: "Your next home in",
      h1After: "starts here.",
      tabs: ["Buy", "Rent", "Sell"],
      placeholders: [
        "Search by neighbourhood, address or postcode…",
        "Search rental flats in Madrid…",
        "Enter your property address…",
      ],
      searchBtn: "Search",
    },
    services: {
      heading: "What do you need?",
      subtitle: "We guide you every step of the way, from search to signing",
      cards: [
        { title: "Buy", desc: "Access exclusive properties before they hit the market. Our agents negotiate the best conditions for you.", link: "View properties" },
        { title: "Rent", desc: "Verified flats, transparent contracts and full support. Find your home in Madrid stress-free.", link: "Explore rentals" },
        { title: "Owner Services", desc: "Free valuation, professional photography, digital marketing and full management. We guide you every step of the way to sell or rent at the best price.", link: "Request valuation" },
        { title: "Buyer & Tenant Services", desc: "Your Personal Property Shopper. Tailored search, expert advisory and concierge service so you find exactly what you're looking for.", link: "Discover more" },
      ],
    },
    barrios: {
      heading: "Explore Madrid's neighbourhoods",
      subtitle: "Discover the most sought-after and charming areas of the capital",
      from: "From",
      luxury: "Luxury and exclusivity",
    },
    newcomers: {
      badge: "🌍 Living in Madrid",
      h2: "Just arrived in Madrid?",
      desc: "We help you find housing, handle administrative procedures and settle into your new neighbourhood. We know what you need because we've been there.",
      btn: "Book a free consultation →",
    },
    agent: {
      h2: "Talk to a Korner Club agent",
      desc: "We connect you with a local expert, no commitment required. Learn about the market, get your questions answered and take the first step towards your new home.",
      namePlaceholder: "Your name",
      emailPlaceholder: "Email",
      phonePlaceholder: "Phone (optional)",
      purposes: ["I want to buy", "I want to rent", "I want to sell", "I just arrived in Madrid"],
      purposeProperty: "I would like information about property {ref}",
      btn: "Contact agent",
      sending: "Sending…",
      successTitle: "Message sent!",
      successSub: "An agent will get in touch with you soon.",
      successRef: "Reference:",
      errorMsg: "Something went wrong. Please try again.",
      privacyNotice: "By submitting this form you accept our ",
      privacyLink: "Privacy Policy",
      privacyNoticeSuffix: ".",
    },
    propertyDetail: {
      loading: "Loading property…",
      buy: "Buy", rent: "Rent",
      pageTitle: (type, rooms, loc) => `${rooms ? `${rooms}-bedroom ` : ""}${type}${loc ? ` in ${loc}` : ""}`,
      sqmBuilt: "Built area", sqmUseful: "Floor area",
      roomSingular: "Bed.", roomPlural: "Beds.",
      bathSingular: "Bath", bathPlural: "Baths",
      floorPrefix: "Floor", lastFloor: "Top", yearBuilt: "Year", photos: "photos",
      sDescription: "Description", sFeatures: "Features", sEquipment: "Equipment",
      sEnergy: "Energy efficiency", sFloorPlans: "Floor plans", sMultimedia: "Multimedia",
      watchVideo: "▶ Watch video", virtualTour: "🔭 Virtual tour",
      requestInfo: "Request information", callAgent: "Call the agent",
      responseGuarantee: "Guaranteed response within 24h", ref: "Ref:",
      fExterior: "Exterior", fElevator: "Lift", fAC: "Air conditioning",
      fTerrace: "Terrace", fBalcony: "Balcony", fWardrobes: "Built-in wardrobes",
      fGarage: "Garage included", fStorage: "Storage unit", fPool: "Swimming pool", fGarden: "Garden",
      fAccessibleExt: "Adapted exterior access", fAccessibleInt: "Adapted interior access",
      lKitchen: "Kitchen", lHeating: "Heating", lCondition: "Condition",
      kFullFurnished: "Fully equipped & furnished", kFullUnfurnished: "Fully equipped, unfurnished", kEmpty: "Empty, unfurnished",
      hCentral: "Central", hIndividual: "Individual", hNone: "No heating",
      fuelGas: "gas", fuelElectric: "electric", fuelGasoil: "oil", fuelOther: "other",
      condNew: "New build", condGood: "Good condition", condRenovation: "Needs renovation",
      ptApartment: "Flat", ptHouse: "House", ptStudio: "Studio", ptPenthouse: "Penthouse",
      ptDuplex: "Duplex", ptCommercial: "Commercial space", ptOffice: "Office",
      ptLand: "Land", ptGarage: "Garage", ptStorage: "Storage unit",
    },
    footer: {
      brandDesc: "Digital real estate agency in Madrid. Specialists in supporting newcomers with their relocation and home search. Your neighbourhood, your Korner.",
      columns: [
        { title: "Buy", links: ["Flats for sale", "Houses for sale", "Penthouses", "New builds", "Buyer's guide"] },
        { title: "Rent", links: ["Flats for rent", "Studios", "Short-term rental", "Tenant's guide"] },
        { title: "Owner", links: ["Why Korner Club", "Home staging", "Seller's guide"] },
        { title: "Company", links: ["About us", "Our team", "Contact"] },
      ],
      copyright: "© 2026 Korner Ventures, S.L. All rights reserved.",
      legal: ["Legal notice", "Privacy", "Cookies"],
    },
  },

  fr: {
    nav: {
      items: ["Acheter", "Louer", "Propriétaire", "Vivre à Madrid", "Service Conciergerie", "Contact"],
      login: "Se connecter",
    },
    hero: {
      h1Before: "Votre prochain logement à",
      h1After: "commence ici.",
      tabs: ["Acheter", "Louer", "Vendre"],
      placeholders: [
        "Rechercher par quartier, adresse ou code postal…",
        "Rechercher des appartements en location à Madrid…",
        "Entrez l'adresse de votre bien…",
      ],
      searchBtn: "Rechercher",
    },
    services: {
      heading: "De quoi avez-vous besoin ?",
      subtitle: "Nous vous accompagnons à chaque étape, de la recherche à la signature",
      cards: [
        { title: "Acheter", desc: "Accédez à des propriétés exclusives avant qu'elles arrivent sur le marché. Nos agents négocient les meilleures conditions pour vous.", link: "Voir les propriétés" },
        { title: "Louer", desc: "Appartements vérifiés, contrats transparents et accompagnement complet. Trouvez votre logement à Madrid sans stress.", link: "Explorer les locations" },
        { title: "Services Propriétaire", desc: "Estimation gratuite, photographie professionnelle, marketing digital et gestion complète. Nous vous accompagnons pour vendre ou louer au meilleur prix.", link: "Demander une estimation" },
        { title: "Services Locataire/Acheteur", desc: "Votre Personal Shopper Immobilier. Recherche sur mesure, conseil expert et service de conciergerie pour trouver exactement ce que vous cherchez.", link: "Découvrir plus" },
      ],
    },
    barrios: {
      heading: "Explorez les quartiers de Madrid",
      subtitle: "Découvrez les zones les plus prisées et charmantes de la capitale",
      from: "À partir de",
      luxury: "Luxe et exclusivité",
    },
    newcomers: {
      badge: "🌍 Vivre à Madrid",
      h2: "Vous venez d'arriver à Madrid ?",
      desc: "Nous vous aidons à trouver un logement, à gérer les démarches administratives et à vous adapter à votre nouveau quartier. Nous savons ce dont vous avez besoin car nous l'avons vécu.",
      btn: "Planifier une consultation gratuite →",
    },
    agent: {
      h2: "Parlez à un agent Korner Club",
      desc: "Nous vous mettons en contact avec un expert local sans engagement. Découvrez le marché, obtenez des réponses à vos questions et faites le premier pas vers votre nouveau logement.",
      namePlaceholder: "Votre nom",
      emailPlaceholder: "Email",
      phonePlaceholder: "Téléphone (facultatif)",
      purposes: ["Je veux acheter", "Je veux louer", "Je veux vendre", "Je viens d'arriver à Madrid"],
      purposeProperty: "Je souhaite des informations sur le bien {ref}",
      btn: "Contacter un agent",
      sending: "Envoi en cours…",
      successTitle: "Message envoyé !",
      successSub: "Un agent vous contactera prochainement.",
      successRef: "Référence :",
      errorMsg: "Une erreur s'est produite. Veuillez réessayer.",
      privacyNotice: "En soumettant ce formulaire, vous acceptez notre ",
      privacyLink: "Politique de confidentialité",
      privacyNoticeSuffix: ".",
    },
    propertyDetail: {
      loading: "Chargement…",
      buy: "Acheter", rent: "Louer",
      pageTitle: (type, rooms, loc) => `${type}${rooms ? ` de ${rooms} chambre${rooms === 1 ? "" : "s"}` : ""}${loc ? ` à ${loc}` : ""}`,
      sqmBuilt: "Surface habitable", sqmUseful: "Surface utile",
      roomSingular: "Ch.", roomPlural: "Chs.",
      bathSingular: "SDB", bathPlural: "SDBs",
      floorPrefix: "Étage", lastFloor: "Dernier", yearBuilt: "Année", photos: "photos",
      sDescription: "Description", sFeatures: "Caractéristiques", sEquipment: "Équipement",
      sEnergy: "Performance énergétique", sFloorPlans: "Plans", sMultimedia: "Multimédia",
      watchVideo: "▶ Voir la vidéo", virtualTour: "🔭 Visite virtuelle",
      requestInfo: "Demander des informations", callAgent: "Appeler l'agent",
      responseGuarantee: "Réponse garantie sous 24h", ref: "Réf. :",
      fExterior: "Extérieur", fElevator: "Ascenseur", fAC: "Climatisation",
      fTerrace: "Terrasse", fBalcony: "Balcon", fWardrobes: "Placards intégrés",
      fGarage: "Garage inclus", fStorage: "Cave", fPool: "Piscine", fGarden: "Jardin",
      fAccessibleExt: "Accès extérieur adapté", fAccessibleInt: "Accès intérieur adapté",
      lKitchen: "Cuisine", lHeating: "Chauffage", lCondition: "État",
      kFullFurnished: "Entièrement équipée et meublée", kFullUnfurnished: "Entièrement équipée, non meublée", kEmpty: "Vide, non meublée",
      hCentral: "Collectif", hIndividual: "Individuel", hNone: "Sans chauffage",
      fuelGas: "gaz", fuelElectric: "électrique", fuelGasoil: "fioul", fuelOther: "autre",
      condNew: "Construction neuve", condGood: "Bon état", condRenovation: "À rénover",
      ptApartment: "Appartement", ptHouse: "Maison", ptStudio: "Studio", ptPenthouse: "Penthouse",
      ptDuplex: "Duplex", ptCommercial: "Local commercial", ptOffice: "Bureau",
      ptLand: "Terrain", ptGarage: "Garage", ptStorage: "Cave/Garde-meuble",
    },
    footer: {
      brandDesc: "Agence immobilière digitale à Madrid. Spécialistes pour accompagner les nouveaux arrivants dans leur installation et leur recherche de logement. Votre quartier, votre Korner.",
      columns: [
        { title: "Acheter", links: ["Appartements à vendre", "Maisons à vendre", "Penthouses", "Constructions neuves", "Guide de l'acheteur"] },
        { title: "Louer", links: ["Appartements à louer", "Studios", "Location temporaire", "Guide du locataire"] },
        { title: "Propriétaire", links: ["Pourquoi Korner Club", "Home staging", "Guide du vendeur"] },
        { title: "Entreprise", links: ["À propos", "Notre équipe", "Contact"] },
      ],
      copyright: "© 2026 Korner Ventures, S.L. Tous droits réservés.",
      legal: ["Mentions légales", "Confidentialité", "Cookies"],
    },
  },

  de: {
    nav: {
      items: ["Kaufen", "Mieten", "Eigentümer", "Leben in Madrid", "Concierge-Service", "Kontakt"],
      login: "Anmelden",
    },
    hero: {
      h1Before: "Ihr nächstes Zuhause in",
      h1After: "beginnt hier.",
      tabs: ["Kaufen", "Mieten", "Verkaufen"],
      placeholders: [
        "Nach Stadtviertel, Adresse oder Postleitzahl suchen…",
        "Mietwohnungen in Madrid suchen…",
        "Geben Sie Ihre Immobilienadresse ein…",
      ],
      searchBtn: "Suchen",
    },
    services: {
      heading: "Was brauchen Sie?",
      subtitle: "Wir begleiten Sie bei jedem Schritt, von der Suche bis zur Unterzeichnung",
      cards: [
        { title: "Kaufen", desc: "Zugang zu exklusiven Immobilien, bevor sie auf den Markt kommen. Unsere Makler verhandeln die besten Konditionen für Sie.", link: "Immobilien ansehen" },
        { title: "Mieten", desc: "Geprüfte Wohnungen, transparente Verträge und vollständige Begleitung. Finden Sie Ihr Zuhause in Madrid ohne Stress.", link: "Mietobjekte erkunden" },
        { title: "Eigentümer-Services", desc: "Kostenlose Bewertung, professionelle Fotografie, digitales Marketing und vollständige Verwaltung. Wir begleiten Sie beim Verkauf oder der Vermietung zum besten Preis.", link: "Bewertung anfragen" },
        { title: "Käufer- & Mieter-Services", desc: "Ihr persönlicher Immobilien-Shopper. Maßgeschneiderte Suche, Expertenberatung und Concierge-Service – damit Sie genau das finden, was Sie suchen.", link: "Mehr entdecken" },
      ],
    },
    barrios: {
      heading: "Erkunde Madrids Stadtviertel",
      subtitle: "Entdecken Sie die begehrtesten und charmantesten Gegenden der Hauptstadt",
      from: "Ab",
      luxury: "Luxus und Exklusivität",
    },
    newcomers: {
      badge: "🌍 Leben in Madrid",
      h2: "Gerade in Madrid angekommen?",
      desc: "Wir helfen Ihnen bei der Wohnungssuche, den Behördengängen und der Eingewöhnung in Ihr neues Viertel. Wir wissen, was Sie brauchen, weil wir es selbst erlebt haben.",
      btn: "Kostenloses Erstgespräch buchen →",
    },
    agent: {
      h2: "Mit einem Korner Club-Agenten sprechen",
      desc: "Wir verbinden Sie mit einem lokalen Experten, ohne Verpflichtung. Erfahren Sie mehr über den Markt, klären Sie Ihre Fragen und machen Sie den ersten Schritt zu Ihrem neuen Zuhause.",
      namePlaceholder: "Ihr Name",
      emailPlaceholder: "E-Mail",
      phonePlaceholder: "Telefon (optional)",
      purposes: ["Ich möchte kaufen", "Ich möchte mieten", "Ich möchte verkaufen", "Ich bin gerade in Madrid angekommen"],
      purposeProperty: "Ich möchte Informationen zur Immobilie {ref}",
      btn: "Agenten kontaktieren",
      sending: "Wird gesendet…",
      successTitle: "Nachricht gesendet!",
      successSub: "Ein Agent wird sich in Kürze bei Ihnen melden.",
      successRef: "Referenz:",
      errorMsg: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
      privacyNotice: "Mit dem Absenden dieses Formulars stimmen Sie unserer ",
      privacyLink: "Datenschutzrichtlinie",
      privacyNoticeSuffix: " zu.",
    },
    propertyDetail: {
      loading: "Immobilie wird geladen…",
      buy: "Kaufen", rent: "Mieten",
      pageTitle: (type, rooms, loc) => `${type}${rooms ? ` mit ${rooms} Schlafzimmer${rooms === 1 ? "" : "n"}` : ""}${loc ? ` in ${loc}` : ""}`,
      sqmBuilt: "Wohnfläche", sqmUseful: "Nutzfläche",
      roomSingular: "Zi.", roomPlural: "Zi.",
      bathSingular: "Bad", bathPlural: "Bäder",
      floorPrefix: "Etage", lastFloor: "Oberste", yearBuilt: "Baujahr", photos: "Fotos",
      sDescription: "Beschreibung", sFeatures: "Ausstattung", sEquipment: "Einrichtung",
      sEnergy: "Energieeffizienz", sFloorPlans: "Grundrisse", sMultimedia: "Multimedia",
      watchVideo: "▶ Video ansehen", virtualTour: "🔭 Virtuelle Tour",
      requestInfo: "Informationen anfragen", callAgent: "Makler anrufen",
      responseGuarantee: "Antwort innerhalb von 24 Stunden garantiert", ref: "Ref.:",
      fExterior: "Außenlage", fElevator: "Aufzug", fAC: "Klimaanlage",
      fTerrace: "Terrasse", fBalcony: "Balkon", fWardrobes: "Einbauschränke",
      fGarage: "Garage inklusive", fStorage: "Lagerraum", fPool: "Schwimmbad", fGarden: "Garten",
      fAccessibleExt: "Barrierefreier Außenzugang", fAccessibleInt: "Barrierefreier Innenzugang",
      lKitchen: "Küche", lHeating: "Heizung", lCondition: "Zustand",
      kFullFurnished: "Voll ausgestattet und möbliert", kFullUnfurnished: "Voll ausgestattet, unmöbliert", kEmpty: "Leer, unmöbliert",
      hCentral: "Zentralheizung", hIndividual: "Einzelheizung", hNone: "Keine Heizung",
      fuelGas: "Gas", fuelElectric: "Strom", fuelGasoil: "Öl", fuelOther: "Sonstige",
      condNew: "Neubau", condGood: "Guter Zustand", condRenovation: "Renovierungsbedarf",
      ptApartment: "Wohnung", ptHouse: "Haus", ptStudio: "Studio", ptPenthouse: "Penthouse",
      ptDuplex: "Duplex", ptCommercial: "Gewerberaum", ptOffice: "Büro",
      ptLand: "Grundstück", ptGarage: "Garage", ptStorage: "Lagerraum",
    },
    footer: {
      brandDesc: "Digitale Immobilienagentur in Madrid. Spezialisten für die Begleitung von Neuankömmlingen bei ihrer Einrichtung und Wohnungssuche. Ihr Viertel, Ihr Korner.",
      columns: [
        { title: "Kaufen", links: ["Wohnungen zum Verkauf", "Häuser zum Verkauf", "Penthäuser", "Neubauten", "Käufer-Leitfaden"] },
        { title: "Mieten", links: ["Wohnungen zur Miete", "Studios", "Kurzzeitvermietung", "Mieter-Leitfaden"] },
        { title: "Eigentümer", links: ["Warum Korner Club", "Home Staging", "Verkäufer-Leitfaden"] },
        { title: "Unternehmen", links: ["Über uns", "Unser Team", "Kontakt"] },
      ],
      copyright: "© 2026 Korner Ventures, S.L. Alle Rechte vorbehalten.",
      legal: ["Impressum", "Datenschutz", "Cookies"],
    },
  },
};
