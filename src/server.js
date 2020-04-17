const express = require('express');
const config = require('./utils/config.js');
const app = express();
app.use(require('body-parser').json());

const hook = require('./hook.js');
const storage = require('./storage.js');
const logger = require('./utils/logging.js');
const port = config.get('server:port');

app.get('/', (req, res) => res.send('Hello World!'));

/**
 * Create a Hook
 */
app.post('/hook', async (req, res) => {
  try {
    if(!req.body.pryvApiEndpoint){
      res.status(400).send('Missing pryvApiEndpoint field');
    }
    const response = await hook.create(req.body.pryvApiEndpoint, {});
    res.send(response)
  } catch (error) {
    logger.error('Error Creating hook: ', error);
    res.status(500).send('Something broke!');
  }
});

/**
 * Handle webhooks from Pryv.io
 *
 * "messages": [
 *  "eventsChanged",
 *  "streamsChanged"
 * ],
 * "meta": {
 *   "apiVersion": "1.4.11",
 *   "serial": "20190802",
 *   "serverTime": 1586845324.691
 * }
 */
app.post('/trigger/:accessId', async (req, res) => {
  try {
    logger.info('Trigger ', req.params.accessId, req.body);
    const result = await hook.handleTrigger(req.params.accessId, req.body);
    return res.status(200).send({result: 'OK'});
  } catch (error) {
    logger.error('Error Trigger Res: ', error);
    res.status(500).send('Something broke!');
  }
});


hook.reactivateAllHooks();

app.listen(port, () => logger.info(`Pryv Webhook Aggregator listening on port ${port}!`))
