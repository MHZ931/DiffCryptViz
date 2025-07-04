import { fetchTexFile, getIndices, safeFormat } from "../dist/helper.js";

function SkinnyShiftRows(oldCells) {
    let newCells = Array(4).fill().map(() => Array(4).fill(0));
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            newCells[i][j] = oldCells[(i-(3-j)+8) % 4][j]
        }
    }
    return newCells
}


function SkinnyMixColumns(oldCells) {
    let newCells = Array(4).fill().map(() => Array(4).fill(0));
    for (let c = 0; c < 4; c++) {
        newCells[c][0] = oldCells[c][1] ^ oldCells[c][3]
        newCells[c][1] = oldCells[c][1] ^ oldCells[c][2]
        newCells[c][2] = oldCells[c][3]
        newCells[c][3] = oldCells[c][0] ^ oldCells[c][1] ^ oldCells[c][3]
    }
    return newCells
}

async function SkinnyRound(activecells1, roundnum) {
    const roundContent = await fetchTexFile("../asset/skinny-round-template.txt");
    
    let activecells2 = SkinnyShiftRows(activecells1);
    let activecells3 = SkinnyMixColumns(activecells2);

    const data = {
      "activecells1": getIndices(activecells1, x => x == 1).map(pair => pair.map(String).join("/")).join(","),
      "activecells2": getIndices(activecells2, x => x == 1).map(pair => pair.map(String).join("/")).join(","),
      "activecells3": getIndices(activecells3, x => x == 1).map(pair => pair.map(String).join("/")).join(","),
      "roundnum": String(5*roundnum),
    }

    return safeFormat(roundContent, data);
}

export async function Skinny(actives, rounds) {
    const startContent = await fetchTexFile("../asset/skinny-start.txt");

    let activecells = Array(4).fill().map(() => Array(4).fill(0));

    for (let x of actives) {
        activecells[x % 4][~~(x / 4)] = 1;
    }

    let contentArray = [startContent];
    
    for (let r = 1; r < rounds+1; r++) {
        const contentEachRound = await SkinnyRound(activecells, r);
        contentArray.push(contentEachRound);
        activecells = SkinnyMixColumns(SkinnyShiftRows(activecells));
    }

    const endContent = `
    \\end{tikzpicture}
    \\end{document}
    `;

    contentArray.push(endContent)

    const mainContent = contentArray.join("\n")
    console.log(mainContent)

    return mainContent;
}