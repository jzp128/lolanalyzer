import {checkWin, getChampionKeyWithName} from "../../utils/Utils";

export default class MatchChecker {
    private readonly matches: Array<any>;
    private playerMatchesDetail: Array<any>;
    private playerName: string;
    private playerId: string;

    // key pairing of {matchid: {participantId: int, teamId: int}}
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

            // finds participant ID and saves their own match history & stuff
            for (let j = 0; j < participants.length; j++) {
                let p = participants[j].player;
                if (p.summonerName === this.playerName) {
                    this.playerMatchesDetail.push(match.participants[j]);
                    this.participantId[match.gameId] = {"participantId": p.participantId, 'teamId': p.teamId};
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

    companionWinRateCalculator() {
        // calculate the wr of people you played with for 3 or more games
        let players = {};

        for (let i = 0; i < this.matches.length; i++) {
            let match = this.matches[i];
            let participants = match.participantIdentities;
            let playerTeamId = this.participantId[match.gameId].teamId;
            let playerParticipantId = this.participantId[match.gameId];
            // check if we won or nah
            let win: boolean = checkWin(match.teams, playerTeamId);
            // finds participant ID add tallies the win/loss
            for (let j = 0; j < participants.length; j++) {
                let p = participants[j].player;

                if (p.teamId === playerTeamId && p.participantId !== playerParticipantId) {
                    // adds the player to the dictionary if not inside yet
                    if (!(p.summonerName in players)) {
                        players[p.summonerName] = win ? {'win': 1, 'loss': 0, 'total': 1} : {
                            'win': 0,
                            'loss': 1,
                            'total': 1
                        };
                    } else {
                        // increment the game results otherwise
                        if (win) {
                            players[p.summonerName].win += 1;
                        } else {
                            players[p.summonerName].loss += 1;
                        }
                        players[p.summonerName].total += 1;
                    }
                }
            }
        }

        let result = [];
        // get players that you've played with for more than 3 games
        for (let pkey in players) {
            let p = players[pkey];
            if (p.total >= 3) {
                // we can remove the player from the list we already have
                result.push(p);
            }
        }

        return result;

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