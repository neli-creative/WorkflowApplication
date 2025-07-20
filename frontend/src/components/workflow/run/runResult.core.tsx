export function parseResult(result: string): {
  subject: string;
  body: string[];
} {
  const lines = result.split("\n");
  let subject = "";
  let body: string[] = [];
  let inBody = false;

  for (let line of lines) {
    line = line.trim();

    if (line.startsWith("Subject:")) {
      subject = line.replace("Subject:", "").trim();
    } else if (line && !subject && !inBody) {
      inBody = true;
      body.push(line);
    } else if (inBody || (line && subject)) {
      inBody = true;
      if (line) {
        body.push(line);
      } else {
        body.push("");
      }
    }
  }

  return { subject, body };
}

export function renderBody(body: string[]): JSX.Element[] {
  const paragraphs: string[][] = [];
  let currentParagraph: string[] = [];

  body.forEach((line) => {
    if (line === "") {
      if (currentParagraph.length > 0) {
        paragraphs.push([...currentParagraph]);
        currentParagraph = [];
      }
    } else {
      currentParagraph.push(line);
    }
  });

  if (currentParagraph.length > 0) {
    paragraphs.push(currentParagraph);
  }

  return paragraphs.map((paragraph, index) => (
    <div key={index} className="mb-4 last:mb-0">
      {paragraph.map((line, lineIndex) => (
        <p key={lineIndex} className="text-gray-700 leading-relaxed">
          {line}
        </p>
      ))}
    </div>
  ));
}
