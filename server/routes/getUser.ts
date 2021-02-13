import * as express from "express";
import {Express, Request, Response} from "express";
import axios from "axios";
import MatchChecker from "../analyzer/matchchecker";
const testdata = require('./testdata.json')

const apiKey: string = '';
const testUserRouter = express.Router();

testUserRouter.get('/', (req: Request, res: Response): void => {
    return getUserAccountId(res);
});

testUserRouter.get('/test', (req: Request, res: Response): void => {
    let testMatchHistory = new MatchChecker(testdata, 'NPP Hard', '');
    let dmgNumber = testMatchHistory.calculateDamageInNGames(3);
    res.send(JSON.stringify({'damageNumber': dmgNumber}));
});

function getUserAccountId(expressResponse: Response): void {
    // get user account number
    let gameName = 'Anlin';
    let reqURL: string = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${gameName}?api_key=${apiKey}`
    axios.get(reqURL, {}).then(riotResp => {
        if (riotResp.status == 200) {
            let accountId: string = riotResp.data.accountId;
            riotResp = null;
            getUserMatches(expressResponse, accountId);
        }
    });
}

function getUserMatches(expressResponse: Response, accountId: string): void {
    console.log(accountId);
    let reqURL: string = `https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?api_key=${apiKey}&queue=450`;
    // only looks through ARAM for now
    axios.get(reqURL, {}).then(riotResp => {
        if (riotResp.status == 200) {
            getAllMatchData(expressResponse, riotResp.data.matches);
            // expressResponse.send(riotResp.data.matches);
        }
    });
}

async function getAllMatchData(expressResponse: Response, matches: [any]): Promise<any> {
    let matchDataList = [];

    // temp variable to limit requests
    let rateLimiter: number = Math.min(matches.length, 5);

    for (let i = 0; i < rateLimiter; i++) {
        let match = matches[i];
        let matchID = match.gameId;
        let reqURL: string = `https://na1.api.riotgames.com/lol/match/v4/matches/${matchID}?api_key=${apiKey}`;
        await axios.get(reqURL, {}).then(
            resp => {
                matchDataList.push(resp.data);
            }
        );
    }

    //TODO ADD THE NAME AND THE PLAYERID
    let matchHistory = new MatchChecker(matchDataList, 'Anlin', '');
    let damageDealt = matchHistory.calculateDamageInNGames(5);

    expressResponse.send({'dealt': damageDealt});
}

export default testUserRouter;