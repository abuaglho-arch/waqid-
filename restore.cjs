const fs = require('fs');

const transcriptPath = '/Users/home/.gemini/antigravity-ide/brain/c111de6b-1cda-4f89-9b88-0f7076f47b70/.system_generated/logs/transcript.jsonl';
const outPath = '/Users/home/.gemini/antigravity-ide/scratch/waqid/src/App.jsx.restored';

const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');
const appJsxLines = {};

for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const step = JSON.parse(line);
    if (step.type === 'TOOL_CALL_RESPONSE') {
      const toolCalls = step.tool_calls || [];
      for (const tool of toolCalls) {
        if (tool.name === 'view_file') {
          const output = tool.output || '';
          if (output.includes('File Path: `file:///Users/home/.gemini/antigravity-ide/scratch/waqid/src/App.jsx`')) {
            const outputLines = output.split('\n');
            for (const textLine of outputLines) {
              const match = textLine.match(/^(\d+):\s(.*)$/);
              if (match) {
                const lineNum = parseInt(match[1], 10);
                const content = match[2];
                appJsxLines[lineNum] = content;
              }
            }
          }
        }
      }
    }
  } catch (err) {
    // ignore parse errors on truncated lines
  }
}

const keys = Object.keys(appJsxLines).map(Number);
if (keys.length > 0) {
  const maxLine = Math.max(...keys);
  let result = '';
  for (let i = 1; i <= maxLine; i++) {
    result += (appJsxLines[i] !== undefined ? appJsxLines[i] : '') + '\n';
  }
  fs.writeFileSync(outPath, result);
  console.log(`Restored ${maxLine} lines.`);
} else {
  console.log('No lines found.');
}
