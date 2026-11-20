# UConn MBB Timeline

## Project direction

Gather as much relevant public data as possible about upcoming games (stats, analytics, news, etc.). A model uses that data to make predictions about each game, and the system scores itself after the game concludes.

- Predictions can be anything: game outcome, spreads, player or team stat lines, etc.
- Predictions are made by a model working from the gathered data, and its reasoning is shown alongside each prediction.
- After the game, once raw stats are available online, they are ingested and each prediction is graded against what actually happened.

## Ideas to consider

- Training an open-weights model with reinforcement learning, using the post-game grading as the reward signal for its predictions.
