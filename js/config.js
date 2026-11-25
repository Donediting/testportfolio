/* ==========================================================
   CONFIGURATION DU PORTFOLIO — le SEUL fichier à modifier
   pour changer le contenu du site.
   ========================================================== */

window.SITE = {
  contact: {
    whatsappNumero: "2290197439684",          // sans le +, sans espaces
    whatsappAffiche: "+229 01 97 43 96 84",
    email: "gandahodieudonne646@gmail.com",
    comeupService: "#",                        // TODO : lien de votre service ComeUp
    comeupProfil: "#",                         // TODO : lien de votre profil ComeUp
    instagram: "#",                            // TODO
    linkedin: "#",                             // TODO
    formulaireAvis: "#"                        // TODO : lien Google Form pour les avis
  },

  // Vidéo de l'accueil (lecture automatique, sans le son)
  showreel: { fichier: "assets/showreel.mp4", affiche: "assets/poster.jpg" },

  /* PORTFOLIO
     format : "large" (16:9) ou "vertical" (9:16)
     visibles : nombre de vidéos affichées avant « Voir plus »
     Le bouton « Voir plus » n'apparaît que s'il y a plus de vidéos que « visibles ».
     Pour ajouter une vidéo : copier une ligne, changer l'id YouTube et le titre. */
  portfolio: [
    {
      titre: "VSL & YouTube", format: "large", visibles: 3,
      videos: [
        { id: "MaWPSqrK31Y", titre: "Ne fais plus de montage sans ces plugins en 2026", client: "Marc Editing", badge: "VSL" },
        { id: "NfGu9xx5s8s", titre: "12 minutes pour devenir un monteur PRO", client: "Marc Editing", badge: "YouTube" },
        { id: "kqdnyYThccM", titre: "Comment trouver des clients en montage vidéo en 2025", client: "Marc Editing", badge: "YouTube" }
      ]
    },
    {
      titre: "Ads & Reels", format: "vertical", visibles: 4,
      videos: [
        { id: "2QqnlxCg2oM", titre: "WAKOON SHORT 1", badge: "Reel" },
        { id: "9GyhgjNaeW8", titre: "PINTREST", badge: "Reel" },
        { id: "MzsBpz7Eznw", titre: "DEVIN JATHO STYLE", badge: "Reel" },
        { id: "TOpWXw5CaXA", titre: "STACKED CAPTION", badge: "Reel" }
      ]
    },
    {
      titre: "Podcast", format: "large", visibles: 3,
      videos: [
        { id: "MaWPSqrK31Y", titre: "Ne fais plus de montage sans ces plugins en 2026", client: "Marc Editing", badge: "Podcast" },
        { id: "NfGu9xx5s8s", titre: "12 minutes pour devenir un monteur PRO", client: "Marc Editing", badge: "Podcast" },
        { id: "kqdnyYThccM", titre: "Comment trouver des clients en montage vidéo en 2025", client: "Marc Editing", badge: "Podcast" }
      ]
    }
  ],

  /* MOTION DESIGN : ids YouTube de vos extraits. Vide = emplacements d'attente. */
  motion: [],

  /* AVIS : liste vide [] = message « Les premiers avis arrivent bientôt ». */
  avis: [
    { texte: "[L'avis du client, copié tel quel]", nom: "[Nom du client]", role: "[Son métier ou sa chaîne]", note: 5 },
    { texte: "[L'avis du client, copié tel quel]", nom: "[Nom du client]", role: "[Son métier ou sa chaîne]", note: 5 },
    { texte: "[L'avis du client, copié tel quel]", nom: "[Nom du client]", role: "[Son métier ou sa chaîne]", note: 5 }
  ],

  aPropos: {
    titre: "Je m'appelle Dieudonné, monteur vidéo basé au Bénin.",
    texte: "[Votre histoire en quelques lignes : comment vous avez commencé le montage, ce qui vous passionne, ce que vous apportez à vos clients.]",
    chiffre: "50+", chiffreLabel: "Vidéos montées"
  },

  faq: [
    { q: "Quel est ton délai de livraison ?", r: "[Votre délai habituel, par exemple selon la durée de la vidéo]" },
    { q: "Comment se passe une collaboration ?", r: "[Les étapes : brief, envoi des rushs, premier montage, retouches, livraison]" },
    { q: "Combien coûtent tes services ?", r: "[Vos tarifs ou « sur devis selon le projet »]" },
    { q: "Combien de retouches sont incluses ?", r: "[Le nombre de retours compris dans le prix]" },
    { q: "Comment je t'envoie mes rushs ?", r: "[Google Drive, WeTransfer, autre]" },
    { q: "Quels logiciels utilises-tu ?", r: "Premiere Pro et DaVinci Resolve pour le montage, After Effects pour le motion design et Blender pour la 3D." }
  ],

  typesVideo: ["VSL", "YouTube", "Podcast", "Ads", "Reels", "Motion design", "Colorimétrie / étalonnage", "Autre"]
};
