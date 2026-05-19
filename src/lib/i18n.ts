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
    btn: string;
    sending: string;
    successTitle: string;
    successSub: string;
    successRef: string;
    errorMsg: string;
  };
  footer: {
    brandDesc: string;
    columns: FooterColumn[];
    copyright: string;
    legal: string[];
  };
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
        { title: "Propietario (Vender/Alquilar)", desc: "Valoración gratuita, fotografía profesional y marketing digital. Vendemos tu propiedad al mejor precio del mercado.", link: "Solicitar valoración" },
        { title: "Servicio de Concierge", desc: "Asistencia personalizada de alto nivel, diseñada para gestionar tareas logísticas, operativas y de estilo de vida.", link: "Descubre más" },
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
      btn: "Contactar agente",
      sending: "Enviando…",
      successTitle: "¡Mensaje enviado!",
      successSub: "Un agente se pondrá en contacto contigo pronto.",
      successRef: "Referencia:",
      errorMsg: "Algo ha fallado. Por favor, inténtalo de nuevo.",
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
        { title: "Owner (Sell/Rent)", desc: "Free valuation, professional photography and digital marketing. We sell your property at the best market price.", link: "Request valuation" },
        { title: "Concierge Service", desc: "High-level personalised assistance, designed to manage logistical, operational and lifestyle tasks.", link: "Discover more" },
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
      btn: "Contact agent",
      sending: "Sending…",
      successTitle: "Message sent!",
      successSub: "An agent will get in touch with you soon.",
      successRef: "Reference:",
      errorMsg: "Something went wrong. Please try again.",
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
        { title: "Propriétaire (Vendre/Louer)", desc: "Estimation gratuite, photographie professionnelle et marketing digital. Nous vendons votre bien au meilleur prix du marché.", link: "Demander une estimation" },
        { title: "Service Conciergerie", desc: "Assistance personnalisée haut de gamme, conçue pour gérer vos tâches logistiques, opérationnelles et de style de vie.", link: "Découvrir plus" },
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
      btn: "Contacter un agent",
      sending: "Envoi en cours…",
      successTitle: "Message envoyé !",
      successSub: "Un agent vous contactera prochainement.",
      successRef: "Référence :",
      errorMsg: "Une erreur s'est produite. Veuillez réessayer.",
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
        { title: "Eigentümer (Verkaufen/Vermieten)", desc: "Kostenlose Bewertung, professionelle Fotografie und digitales Marketing. Wir verkaufen Ihre Immobilie zum besten Marktpreis.", link: "Bewertung anfragen" },
        { title: "Concierge-Service", desc: "Persönlicher Hochklasse-Service, der logistische, operative und lebensstilbezogene Aufgaben übernimmt.", link: "Mehr entdecken" },
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
      btn: "Agenten kontaktieren",
      sending: "Wird gesendet…",
      successTitle: "Nachricht gesendet!",
      successSub: "Ein Agent wird sich in Kürze bei Ihnen melden.",
      successRef: "Referenz:",
      errorMsg: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
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
