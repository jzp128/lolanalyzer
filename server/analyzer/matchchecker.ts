export default class MatchChecker {
    private readonly matches: Array<any>;
    private playerMatchesDetail: Array<any>;
    private playerName: string;
    private playerId: string;

    constructor(matches: Array<any>, playerName: string, playerId: string) {
        this.matches = matches;
        this.playerId = playerId;
        this.playerName = playerName;
        this.playerMatchesDetail = [];
        this.getMatchesForPlayer();
    }

    test() {
        return this.matches[0].participantIdentities;
    }

    findUser(summonerName: string) {

    }

    calculateDamageInNGames(gameNum: number) {
        let games: number = Math.min(gameNum, this.matches.length);
        let totalDmg: number = 0;
        for (let i = 0; i < games; i++) {
            let dmg = this.playerMatchesDetail[i].stats.totalDamageDealtToChampions;
            totalDmg += dmg;
        }
        console.log(totalDmg);
        return totalDmg;
    }


    private getMatchesForPlayer() {
        for (let i = 0; i < this.matches.length; i++) {
            let match = this.matches[i];
            let participants = match.participantIdentities;

            // finds participant ID and adds the damage
            for (let j = 0; j < participants.length; j++) {
                let p = participants[j].player;
                if (p.summonerName === this.playerName) {
                    this.playerMatchesDetail.push(match.participants[j]);
                    break;
                }
            }

        }
    }
}