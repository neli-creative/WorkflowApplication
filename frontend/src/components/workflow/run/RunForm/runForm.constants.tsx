import { CalendarClock, Repeat, ThumbsDown } from "lucide-react";

export const QUICK_PROMPTS = [
  {
    icon: <CalendarClock className="w-5 h-5" />,
    title: "Demander un rendez-vous",
    description:
      "Je veux organiser une réunion la semaine prochaine avec un client",
  },
  {
    icon: <Repeat className="w-5 h-5" />,
    title: "Envoyer une relance",
    description:
      "Relancer un client pour une réponse à ma dernière proposition",
  },
  {
    icon: <ThumbsDown className="w-5 h-5" />,
    title: "Répondre poliment à un refus",
    description: "Répondre de manière professionnelle à un refus d’offre",
  },
];
