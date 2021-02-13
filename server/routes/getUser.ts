import * as express from "express";
import {Express, Request, Response} from "express";
import axios from "axios";

const apiKey: string = 'RGAPI-4b6b97fd-2832-41ff-9ebc-c67e15c41c51';
const testUserRouter = express.Router();

testUserRouter.get('/', (req: Request, res: Response): void => {
    return getUserAccountId(res);
});


function getUserAccountId(expressResponse: Response): void {
    // get user account number
    let gameName = 'NPP%20HARD';
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
            expressResponse.send(riotResp.data.matches);

        }
    });
}

function getAllMatchData(expressResponse: Response, matches: [any]): void {
    let matchDataList: {};
    let matchID: number = null;
    let reqURL: string = `https://na1.api.riotgames.com/lol/match/v4/matches/${matchID}?api_key=${apiKey}`;
    for (let i = 0; i < matches.length; i ++){
        let match = matches[i];
        console.log(match.gameId);
    }
}

export default testUserRouter;

