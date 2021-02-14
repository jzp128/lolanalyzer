const champion = require('champion.json');

export function getChampionKeyWithName(champName: string): number {
    return champion.data[champName].key;
}

export function getChampNameWithKey(champID: number): string {
    for (let chName in champion.data){
        let champ = champion.data[chName];
        if(champ.key === champID){
            return champ.id;
        }
    }
    return null;
}

