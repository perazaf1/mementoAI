export type UILang = 'fr' | 'en'

export const FEEDBACK_LANGUAGES = [
  { value: 'auto',      fr: 'Automatique (langue de la récitation)', en: 'Automatic (recitation language)' },
  { value: 'French',    fr: 'Français',    en: 'French'    },
  { value: 'English',   fr: 'Anglais',     en: 'English'   },
  { value: 'German',    fr: 'Allemand',    en: 'German'    },
  { value: 'Spanish',   fr: 'Espagnol',    en: 'Spanish'   },
  { value: 'Italian',   fr: 'Italien',     en: 'Italian'   },
  { value: 'Arabic',    fr: 'Arabe',       en: 'Arabic'    },
  { value: 'Chinese',   fr: 'Chinois',     en: 'Chinese'   },
  { value: 'Japanese',  fr: 'Japonais',    en: 'Japanese'  },
  { value: 'Finnish',   fr: 'Finnois',     en: 'Finnish'   },
  { value: 'Malagasy',  fr: 'Malgache',    en: 'Malagasy'  },
]

const t = {
  fr: {
    // Modes
    modeCoursLabel: 'Cours',
    modeCodeLabel: 'Code',

    // InputScreen — course
    courseTitle: 'Quel cours veux-tu réviser\u00a0?',
    courseSubtitle: 'Colle ton contenu ou importe un PDF, puis récite-le à voix haute.',
    coursePlaceholder: 'Colle ici tes notes, le résumé de cours, ou le contenu à mémoriser...',

    // InputScreen — code
    codeTitle: 'Quel code veux-tu expliquer\u00a0?',
    codeSubtitle: 'Colle ton code (50 lignes max), puis explique-le à voix haute en anglais.',
    codePlaceholder: 'Colle ici ton extrait de code...',
    codeLimitWarning: 'Seules les 50 premières lignes seront analysées.',
    codeNote: 'Mode code : le feedback est toujours en anglais.',
    aiDisclaimer: "Ce feedback est généré par une IA et peut contenir des erreurs. Fiez-vous toujours à votre cours ou à vos sources officielles.",

    // InputScreen — common
    importPdf: 'Importer un PDF',
    extracting: 'Extraction...',
    begin: 'Commencer',
    chars: 'car.',
    lines: 'lignes',
    feedbackLangLabel: 'Langue du feedback',

    // RecordingScreen
    listeningCourseTitle: 'Récite ton cours...',
    listeningCodeTitle: 'Explique ton code...',
    readyTitle: 'Prêt à écouter',
    listeningCourseSubtitle: 'Parle clairement, à ton rythme. Clique sur Terminer quand tu as fini.',
    listeningCodeSubtitle: "Explique ce que fait le code, en anglais. Clique sur Terminer quand tu as fini.",
    readySubtitle: 'La reconnaissance vocale démarre...',
    recordingStatus: 'Enregistrement en cours',
    waitingStatus: 'En attente',
    waitingVoice: 'En attente de ta voix...',
    cancel: 'Annuler',
    stopAndFeedback: 'Terminer et obtenir le feedback',

    // Browser unsupported
    browserUnsupportedTitle: 'Navigateur non supporté',
    browserUnsupportedSub: 'La reconnaissance vocale nécessite Chrome ou Edge.',
    goBack: 'Retour',

    // FeedbackScreen
    resultsTitle: 'Résultats',
    resultsCourseSubtitle: 'Analyse de ta récitation.',
    resultsCodeSubtitle: "Analyse de ton explication.",
    analyzing: 'Analyse en cours...',
    transcriptToggle: 'Ce que tu as dit',
    newCourse: 'Nouveau cours',
    newCode: 'Nouveau code',
    tryAgainCourse: 'Recommencer la récitation',
    tryAgainCode: "Recommencer l'explication",

    // Section labels
    secWellCovered: 'Bien couvert',
    secMissing: 'Points manquants',
    secImprecisions: 'Imprécisions',
    secAdvice: 'Conseil',

    // Course limits
    courseLimitWarn: 'Ton cours est très long. Pour un feedback optimal, limite-toi à 12 000 caractères (environ 8 pages A4).',
    courseLimitError: 'Cours trop long (max 15 000 caractères sur le plan gratuit). Supprime du contenu pour continuer.',

    // Errors
    errEmpty: "Rien n'a été détecté. Parle plus près du microphone et réessaie.",
    errApi: 'Une erreur est survenue. Vérifie ta connexion et réessaie.',
    errPdfType: 'Seuls les fichiers PDF sont acceptés.',
    errPdfExtract: "Impossible d'extraire le texte. Essaie de coller le contenu manuellement.",
    retry: 'Réessayer',
  },
  en: {
    // Modes
    modeCoursLabel: 'Course',
    modeCodeLabel: 'Code',

    // InputScreen — course
    courseTitle: 'What course do you want to review?',
    courseSubtitle: 'Paste your content or import a PDF, then recite it out loud.',
    coursePlaceholder: 'Paste your notes, course summary, or content to memorize here...',

    // InputScreen — code
    codeTitle: 'What code do you want to explain?',
    codeSubtitle: 'Paste your code (50 lines max), then explain it out loud in English.',
    codePlaceholder: 'Paste your code snippet here...',
    codeLimitWarning: 'Only the first 50 lines will be analyzed.',
    codeNote: 'Code mode: feedback is always in English.',
    aiDisclaimer: "This feedback is AI-generated and may contain errors. Always refer to your course materials or official sources.",

    // InputScreen — common
    importPdf: 'Import a PDF',
    extracting: 'Extracting...',
    begin: 'Start',
    chars: 'chars.',
    lines: 'lines',
    feedbackLangLabel: 'Feedback language',

    // RecordingScreen
    listeningCourseTitle: 'Recite your course...',
    listeningCodeTitle: 'Explain your code...',
    readyTitle: 'Ready to listen',
    listeningCourseSubtitle: 'Speak clearly, at your own pace. Click Finish when done.',
    listeningCodeSubtitle: 'Explain what the code does, in English. Click Finish when done.',
    readySubtitle: 'Speech recognition is starting up...',
    recordingStatus: 'Recording',
    waitingStatus: 'Waiting',
    waitingVoice: 'Waiting for your voice...',
    cancel: 'Cancel',
    stopAndFeedback: 'Finish and get feedback',

    // Browser unsupported
    browserUnsupportedTitle: 'Browser not supported',
    browserUnsupportedSub: 'Speech recognition requires Chrome or Edge.',
    goBack: 'Go back',

    // FeedbackScreen
    resultsTitle: 'Results',
    resultsCourseSubtitle: 'Analysis of your recitation.',
    resultsCodeSubtitle: 'Analysis of your explanation.',
    analyzing: 'Analyzing...',
    transcriptToggle: 'What you said',
    newCourse: 'New course',
    newCode: 'New code',
    tryAgainCourse: 'Recite again',
    tryAgainCode: 'Explain again',

    // Section labels
    secWellCovered: 'Well covered',
    secMissing: 'Missing points',
    secImprecisions: 'Imprecisions',
    secAdvice: 'Advice',

    // Course limits
    courseLimitWarn: 'Your course is very long. For optimal feedback, keep it under 12,000 characters (about 8 pages).',
    courseLimitError: 'Course too long (max 15,000 characters on the free plan). Remove some content to continue.',

    // Errors
    errEmpty: 'Nothing was detected. Speak closer to the microphone and try again.',
    errApi: 'An error occurred. Check your connection and try again.',
    errPdfType: 'Only PDF files are accepted.',
    errPdfExtract: 'Could not extract text. Try pasting the content manually.',
    retry: 'Retry',
  },
}

export type TranslationKey = keyof typeof t.fr

export function getT(lang: UILang) {
  return (key: TranslationKey): string => t[lang][key] ?? t.fr[key]
}
