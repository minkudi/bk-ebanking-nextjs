// lib/smsErrors.js
export const SMS_ERROR_CODES = {
  4001: "Le message est vide (0 caractères).",
  4002: "Message trop long (max 1280 caractères).",
  4003:
    "Sender ID invalide (3-11 caractères alphanumériques ou 3-15 chiffres).",
  4004: "Numéro de destination invalide.",
  4005: "Tag trop long (max 280 caractères).",
  4006: "Le message contient des termes inappropriés.",
  4007: "Message bloqué — termes suspects. Compte désactivé.",
  4008: "ID de message invalide.",
  4009: "Date/heure invalide ou dans le passé.",
  4010: "Un batch doit contenir entre 1 et 5 000 messages.",
  4011: "Non authentifié — JWT invalide ou expiré.",
  4012: "Sender ID trop générique. Rejeté par le réseau mobile.",
  4021: "Crédits insuffisants pour envoyer ce message.",
  4022: "Crédits insuffisants pour envoyer ce batch.",
  4031: "Compte non trouvé. Envoi impossible.",
  4032: "Compte non trouvé. Envoi impossible.",
  4033: "Compte désactivé (filtre anti-spam déclenché).",
  4034: "SMS international non activé sur ce compte.",
  4036: "Adresse IP non autorisée (whitelist).",
  4037: "Envoi vers ce pays non activé sur votre compte.",
  4041: "Code secret introuvable.",
  5002: "Erreur base de données SMS Works. Contactez le support.",
};

export const SMS_DELIVERY_STATUSES = {
  SCHEDULED: "Planifié — en attente d'envoi au réseau.",
  SENT: "Envoyé au réseau — en attente de confirmation.",
  DELIVERED: "Livré avec succès sur le téléphone.",
  UNDELIVERABLE: "Non livrable. Crédit remboursé (UK uniquement).",
  EXPIRED: "Expiré — non livré dans les 48h.",
  REJECTED: "Rejeté par le réseau.",
};

export const SMS_DELIVERY_ERRORS = {
  5001: {
    detail: "Numéro inexistant ou non attribué à un utilisateur.",
    permanent: true,
  },
  5003: {
    detail: "Sender ID bloqué ou non enregistré auprès de l'opérateur.",
    permanent: true,
  },
  5004: {
    detail: "Rejeté par l'opérateur — numéro inactif ou injoignable.",
    permanent: true,
  },
  5006: {
    detail: "Pas de réponse du téléphone (éteint ou hors réseau).",
    permanent: true,
  },
  5007: {
    detail: "Identifié comme spam par l'opérateur.",
    permanent: true,
  },
  5008: {
    detail: "Itinérance internationale non autorisée sur ce numéro.",
    permanent: true,
  },
  5009: {
    detail: "Rapport UNDELIVERED reçu de l'opérateur réseau.",
    permanent: true,
  },
  5010: {
    detail: "Numéro en DND (Do Not Disturb) ou communication bloquée.",
    permanent: true,
  },
  5011: {
    detail: "Service mobile suspendu par l'opérateur.",
    permanent: true,
  },
  5015: {
    detail:
      "Expiré — message en attente jusqu'à la fin de la période de validité (48h).",
    permanent: false,
  },
  5020: {
    detail:
      "Anti-flood — max 20 messages variés ou 6 identiques par heure sur ce numéro.",
    permanent: true,
  },
  5034: {
    detail: "Erreur système du téléphone (handset failure).",
    permanent: true,
  },
};

export function resolveErrorMessage(code, fallback) {
  if (code && SMS_ERROR_CODES[code]) {
    return `[${code}] ${SMS_ERROR_CODES[code]}`;
  }
  return fallback;
}

export function resolveDeliveryError(failurereason) {
  if (!failurereason) return null;

  const code = failurereason.code;
  if (code && SMS_DELIVERY_ERRORS[code]) {
    const entry = SMS_DELIVERY_ERRORS[code];
    return `[${code}] ${entry.detail}${
      entry.permanent ? " (définitif)" : " (peut encore être livré)"
    }`;
  }

  return failurereason.message ?? null;
}
