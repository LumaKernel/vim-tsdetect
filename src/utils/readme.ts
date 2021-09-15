export type OptionDeclaration = {
  optionName: string;
  descriptionLines: string[];
};

export const parseOptionLines = (optionName: string, optionLines: readonly string[]): OptionDeclaration => {
  const lines = optionLines.slice(
    0,
    optionLines.findIndex((line) => line.startsWith('Values: ')),
  );
  while (lines[0] === '') lines.shift();
  while (lines[lines.length - 1] === '') lines.pop();

  return {
    optionName,
    descriptionLines: lines,
  };
};

export const parseReadmeMd = (lines: readonly string[]): OptionDeclaration[] => {
  const optionsLines: { [optionName: string]: string[] } = {};
  let start = false;
  let end = false;

  let nowHead: string | null = null;

  lines
    .map((line) => line.trim())
    .forEach((line) => {
      if (end) return;
      if (!start) {
        if (line === '## Options') start = true;
        return;
      }
      if (line.startsWith('## ')) {
        end = true;
        return;
      }

      const isHead = line.startsWith('### ');
      if (isHead) {
        const headPattern = /^### `(.*)`$/;
        if (!headPattern.test(line)) {
          throw new Error('Illegal heading pattern of option name.');
        }
        nowHead = line.replace(headPattern, '$1');
        optionsLines[nowHead] = [];
        return;
      }

      if (nowHead) optionsLines[nowHead]?.push(line);
    });

  return Object.entries(optionsLines).map(([optionName, optionLines]) => {
    return parseOptionLines(optionName, optionLines);
  });
};
