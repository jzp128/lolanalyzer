const champion = require('champion.json');

export function getChampionKeyWithName(champName: string): number {
    return champion.data[champName].key;
}

export function getChampNameWithKey(champID: number): string {
    for (let chName in champion.data) {
        let champ = champion.data[chName];
        if (champ.key === champID) {
            return champ.id;
        }
    }
    return null;
}

export function checkWin(teams: [any], teamId: number): boolean {
    let status = false;
    for (let i = 0; i < teams.length; i++) {
        let t = teams[i];
        if (t.teamId === teamId) {
            if (t.win === 'Fail') {
                status = false;
            } else if (t.win === 'Win') {
                status = true;
            }
            break;
        }
    }
    return status;
}

