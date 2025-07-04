
export const getIndices = (grid, condition) =>
  grid.flatMap((row, i) => 
    row.flatMap((element, j) => 
      condition(element) ? [[i, j]] : []
    )
);


export async function fetchTexFile(url) {
    
    const response = await fetch(`${url}`);
    if (!response.ok) throw new Error(`Missing: ${url}`);
    
    const content = await response.text();
    return content;
}

export function safeFormat(template, data) {
  return template.replace(/\${(\w+)}/g, (_, key) => data[key] || '');
}