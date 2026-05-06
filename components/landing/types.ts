export type Lang = 'fr' | 'en'

export const COPY = {
  fr: {
    // Nav
    login: 'Se connecter',
    startFree: 'Commencer gratuitement',
    startFreeMobile: 'Essayer',

    // Hero
    badge: 'Disponible gratuitement',
    h1a: 'Récite ton cours.',
    h1b: 'Retiens-le vraiment.',
    sub: 'Parle à voix haute. Memento analyse ta récitation et te donne un feedback structuré sur ce que tu maîtrises, ce qui manque, et comment progresser.',
    ctaStart: 'Commencer gratuitement',
    ctaHow: 'Comment ça marche',

    // Mock UI labels
    mockTitle: 'Résultats',
    mockSub: 'Analyse de ta récitation en Programmation Orientée Objet.',
    mockSec1: 'Bien couvert',
    mockSec2: 'Points manquants',
    mockSec3: 'Imprécisions',
    mockSec4: 'Conseil',

    // How it works
    methodLabel: 'Méthode',
    methodH: 'Simple par design.',
    methodHSub: 'Efficace par nature.',
    s1title: 'Colle ton cours',
    s1desc: 'Colle ton contenu ou importe un PDF. Limité à 15 000 caractères (environ 10 pages). Au-delà, le feedback perd en précision.',
    s2title: 'Récite à voix haute',
    s2desc: 'Clique sur "Commencer" et parle. La reconnaissance vocale transcrit ta récitation en temps réel. Durée recommandée : moins de 10 minutes.',
    s3title: 'Reçois ton feedback',
    s3desc: "L'IA compare ta récitation au cours de référence et te génère un rapport précis en 4 axes.",

    // Features
    featLabel: 'Fonctionnalités',
    featH: 'Conçu pour les étudiants',
    featHSub: 'qui veulent progresser.',
    f1tag: 'Tous niveaux',
    f1title: 'Mode Cours',
    f1desc: "Colle n'importe quel contenu textuel ou importe un PDF. Memento s'adapte à toutes les matières. Limité à 15 000 caractères par session.",
    f2tag: 'Algorithmie',
    f2title: 'Mode Code',
    f2desc: 'Explique un algorithme à voix haute. Memento évalue ta compréhension de la logique, de la complexité et des cas limites. Limité à 50 lignes de code.',
    f3tag: 'International',
    f3title: '11 langues de feedback',
    f3desc: 'Récite en français, en anglais, en espagnol... Memento détecte la langue et répond dans celle que tu choisis.',

    // Pricing
    pricingLabel: 'Tarifs',
    pricingH: 'Commence gratuitement.',
    pricingHSub: 'Passe au Pro quand tu es prêt.',
    freePlan: 'Gratuit',
    proPlan: 'Pro',
    popular: 'Populaire',
    perMonth: '/mois',
    freeItems: ['3 sessions par jour', 'Mode Cours', '15 000 caractères par session', 'Français et anglais', 'Feedback structuré en 4 axes'],
    proItems: ['20 sessions par jour', 'Mode Cours et Mode Code', '25 000 caractères par session', '11 langues de feedback', 'Historique complet', 'Support prioritaire'],
    freeCta: 'Commencer gratuitement',
    proCta: 'Commencer avec Pro',
    isepNote: 'Étudiant à l\'ISEP ? Accède au plan Pro à 5€/mois en t\'inscrivant avec ton adresse @eleve.isep.fr.',
    isepCta: 'En savoir plus',

    // Footer
    footerOpen: "Ouvrir l'application",
  },
  en: {
    // Nav
    login: 'Log in',
    startFree: 'Start for free',
    startFreeMobile: 'Try it',

    // Hero
    badge: 'Free to use',
    h1a: 'Recite your course.',
    h1b: 'Actually remember it.',
    sub: 'Speak out loud. Memento analyses your recitation and gives you structured feedback on what you know, what is missing, and how to improve.',
    ctaStart: 'Start for free',
    ctaHow: 'How it works',

    // Mock UI labels
    mockTitle: 'Results',
    mockSub: 'Analysis of your recitation in Object-Oriented Programming.',
    mockSec1: 'Well covered',
    mockSec2: 'Missing points',
    mockSec3: 'Imprecisions',
    mockSec4: 'Advice',

    // How it works
    methodLabel: 'Method',
    methodH: 'Simple by design.',
    methodHSub: 'Effective by nature.',
    s1title: 'Paste your course',
    s1desc: 'Paste your content or import a PDF. Limit: 15,000 characters (about 10 pages). Beyond that, feedback quality decreases.',
    s2title: 'Recite out loud',
    s2desc: 'Click "Start" and speak. Speech recognition transcribes your recitation in real time. Recommended duration: under 10 minutes.',
    s3title: 'Get your feedback',
    s3desc: 'The AI compares your recitation to the reference material and generates a precise report across 4 dimensions.',

    // Features
    featLabel: 'Features',
    featH: 'Built for students',
    featHSub: 'who want to improve.',
    f1tag: 'All levels',
    f1title: 'Course mode',
    f1desc: 'Paste any text or import a PDF. Memento works with any subject. Limit: 15,000 characters per session.',
    f2tag: 'Algorithms',
    f2title: 'Code mode',
    f2desc: 'Explain an algorithm out loud. Memento evaluates your understanding of the logic, complexity, and edge cases. Limit: 50 lines of code.',
    f3tag: 'International',
    f3title: '11 feedback languages',
    f3desc: 'Recite in French, English, Spanish... Memento detects the language and responds in whichever you choose.',

    // Pricing
    pricingLabel: 'Pricing',
    pricingH: 'Start for free.',
    pricingHSub: 'Upgrade when you are ready.',
    freePlan: 'Free',
    proPlan: 'Pro',
    popular: 'Popular',
    perMonth: '/month',
    freeItems: ['3 sessions per day', 'Course mode', '15,000 characters per session', 'French and English', 'Structured feedback in 4 axes'],
    proItems: ['20 sessions per day', 'Course and Code mode', '25,000 characters per session', '11 feedback languages', 'Full session history', 'Priority support'],
    freeCta: 'Start for free',
    proCta: 'Start with Pro',
    isepNote: 'Studying at ISEP? Get Pro access at 5€/month by signing up with your @eleve.isep.fr address.',
    isepCta: 'Learn more',

    // Footer
    footerOpen: 'Open the app',
  },
}

export type CopyType = typeof COPY.fr

export const MOCK_CONTENT = {
  fr: {
    sec1: 'La notion de polymorphisme et les constructeurs ont été clairement expliqués.',
    sec2items: ["L'encapsulation et les modificateurs d'accès", 'Les interfaces et classes abstraites'],
    sec3: "La définition de l'héritage manque de précision sur la notion de surcharge.",
    sec4: 'Concentre-toi sur les interfaces lors de ta prochaine révision.',
  },
  en: {
    sec1: 'The concept of polymorphism and constructors were clearly explained.',
    sec2items: ['Encapsulation and access modifiers', 'Interfaces and abstract classes'],
    sec3: 'The definition of inheritance lacks precision regarding method overloading.',
    sec4: 'Focus on interfaces in your next revision session.',
  },
}
