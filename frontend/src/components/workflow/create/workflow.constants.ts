export const NODE_WIDTH = 280;
export const NODE_HEIGHT = 120;
export const NODE_SPACING = 100;
export const LEVEL_SPACING = 150;

export const ZOOM_CONFIG = {
  scaleExtent: [0.1, 3] as [number, number],
  padding: 200,
};

export const EDGE_COLORS = {
  condition: "#67e8f9",
  normal: "#93c5fd",
};

export const ARROW_CONFIG = {
  id: "arrowhead",
  markerWidth: 10,
  markerHeight: 7,
  refX: 9,
  refY: 3.5,
  points: "0 0, 10 3.5, 0 7",
  fill: "#99a1af",
};

export const ADVICES: { text: string; icon: string }[] = [
  {
    text: "Utilisez la molette pour zoomer",
    icon: "🐭",
  },
  {
    text: "Cliquez et glissez pour naviguer",
    icon: "✋",
  },
  {
    text: "Cliquez sur un nœud pour voir les détails",
    icon: "👆",
  },
];

export const WORKFLOW_IMPORT_EXAMPLE = `{
  "nodes": [
    {
      "id": "start",
      "prompt": "What is the language of this message? Answer 'french' or 'english'.\\nMessage: {{input}}",
      "condition": {
        "english": "summarize_en",
        "french": "translate_to_en"
      }
    },
    {
      "id": "translate_to_en",
      "prompt": "Translate this message from French to English:\\n{{lastOutput}}",
      "next": "summarize_en"
    },
    {
      "id": "summarize_en",
      "prompt": "Summarize the following English message:\\n{{lastOutput}}",
      "next": "reply"
    },
    {
      "id": "reply",
      "prompt": "Based on the summary, write a short and friendly reply:\\n{{lastOutput}}"
    }
  ]
}`;

export const WORKFLOW_IMPORT_HELP_TEXT = {
  title: "Format JSON attendu",
  description:
    "Importez un fichier JSON contenant votre workflow de traitement de texte. Chaque nœud peut utiliser {{input}} et {{lastOutput}} dans ses prompts.",
  exampleLabel: "➡️ Exemple avec conditions :",
  properties:
    "Propriétés : id (unique), prompt (avec variables), next (nœud suivant) ou condition (branchement conditionnel)",
};
