const dotenv = require('dotenv').config()
const { WebClient } = require('@slack/web-api')
const { createEventAdapter } = require('@slack/events-api')
const { findConversation, sendMessage, publishMessage } = require('./operations')
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET
const slackToken = process.env.SLACK_TOKEN
const slackChannelId = process.env.SLACK_CHANNEL_ID
const port = process.env.PORT || 6969

const slackEvents = createEventAdapter(slackSigningSecret)
const slackClient = new WebClient(slackToken)



slackEvents.on('app_mention', (event) => {
  console.log(`Got message from user ${event.user}: ${event.text} in ${event.channel}`);
  sendMessage(event.user, event.channel)
  })

slackEvents.on('message', (event) => {
  publishMessage(slackChannelId, event.text);
})


slackEvents.on('error', console.error)

slackEvents.start(port).then(() => {
  console.log(`⚡ Server running on port: ${port} ⚡`)
})