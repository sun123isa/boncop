/**
 * Villes principales et chefs-lieux de la République du Congo.
 * Source de vérité pour le seed et la validation d'inscription.
 */
export const CONGO_VILLES = [
  "Brazzaville",
  "Pointe-Noire",
  "Dolisie",
  "Nkayi",
  "Ouesso",
  "Owando",
  "Impfondo",
  "Sibiti",
  "Madingou",
  "Gamboma",
  "Mossendjo",
  "Kinkala",
  "Djambala",
  "Ewo",
  "Boundji",
  "Makoua",
  "Dongou",
  "Loango",
  "Mindouli",
  "Oyo",
  "Lékana",
  "Zanaga",
  "Etoumbi",
  "Kellé",
  "Ngabé",
  "Mayama",
  "Boko",
  "Kindamba",
  "Loudima",
  "Mouyondzi",
  "Igné",
  "Komono",
  "Mbinda",
  "Ngoko",
  "Sembé",
  "Souanké",
] as const;

export type CongoVille = (typeof CONGO_VILLES)[number];
