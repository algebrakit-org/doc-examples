import {ApiClient} from './ak-sdk/ApiClient.js';
import express from 'express';

const API_KEY = '<your api key here'; // Replace with your actual API key
const AlgebrakitAPI = new ApiClient('https://api.algebrakit.com', API_KEY);

const port = 3300

const app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/exercise/:exerciseId', async (req, res) => {
    const exerciseId = req.params.exerciseId;
    console.log('Fetching exercise info for ID:', exerciseId);
    try {
        const createSessionResponse = await AlgebrakitAPI.createSession({
            exercises: [{
                exerciseId: exerciseId,
            }],
            apiVersion: 2,
        });

        res.render('exercise', {
            session: createSessionResponse[0].sessions[0],
        });
    } catch (error) {
        console.error('Error fetching exercise info:', error);
        res.status(500).send('Error fetching exercise info');
    }
});

app.get('/score/:sessionId', async (req, res) => {
    const sessionId = req.params.sessionId;
    console.log('Fetching score for session ID:', sessionId);
    try {
        const sessionScoreResponse = await AlgebrakitAPI.getSessionScore({
            sessionId: sessionId,
        });

        if (sessionScoreResponse.scoring) {
            res.render('score', {
                score: sessionScoreResponse
            });
        } else {
            res.status(404).send('No score found for this session');
        }
    } catch (error) {
        console.error('Error fetching score:', error);
        res.status(500).send('Error fetching score');
    }
});

app.listen(port, () => console.log(`AlgebraKiT demo app listening on port ${port}!`))