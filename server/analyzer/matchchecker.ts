import {getChampionKeyWithName} from "../../utils/ChampionUtils";

export default class MatchChecker {
    private readonly matches: Array<any>;
    private playerMatchesDetail: Array<any>;
    private playerName: string;
    private playerId: string;

    // key pairing of matchid: participantId
    private participantId: {};

    constructor(matches: Array<any>, playerName: string, playerId: string) {
        this.matches = matches;
        this.playerId = playerId;
        this.playerName = playerName;
        this.playerMatchesDetail = [];
        this.participantId = {};
        this.getMatchesForPlayer();
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
                    this.participantId[match.gameId] = p.participantId;
                    break;
                }
            }

        }
    }

    getKaisaGames() {
        const kaisaID = getChampionKeyWithName('Kaisa');
        let kaisagames = [];
        // gets matches where someone's played kai'sa
        for (let i = 0; i < this.playerMatchesDetail.length; i++) {
            let matchDetail = this.playerMatchesDetail[i];
            if (matchDetail.championId === kaisaID) {
                kaisagames.push(matchDetail);
            }
        }

        // checks the builds that the kiasa games u went
        for (let i = 0; i < kaisagames.length; i++) {
            let matchDetail = this.playerMatchesDetail[i];
            if (matchDetail.championId === kaisaID) {
                kaisagames.push(this.playerMatchesDetail);
            }
        }

    }

    getGamesOnChampion() {

    }

    getExhuastGames() {

    }

    calculateDamageInNGames(gameNum: number) {
        let games: number = Math.min(gameNum, this.matches.length);
        let totalDmg: number = 0;
        for (let i = 0; i < games; i++) {
            let dmg = this.playerMatchesDetail[i].stats.totalDamageDealtToChampions;
            totalDmg += dmg;
        }
        return totalDmg;
    }


}