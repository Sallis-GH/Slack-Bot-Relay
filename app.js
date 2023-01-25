const dotenv = require('dotenv').config()
const { WebClient } = require('@slack/web-api')
const { createEventAdapter } = require('@slack/events-api')

const slackSigningSecret = process.env.SLACK_SIGNING_SECRET
const slackToken = process.env.SLACK_TOKEN
const port = process.env.PORT || 6969

const slackEvents = createEventAdapter(slackSigningSecret)
const slackClient = new WebClient(slackToken)

const sendMessage = async (user, channel) => {
  try {
    await slackClient.chat.postMessage({ channel, text: `Hello, <@${user}> :wicked:` })
  } catch (error) {
    console.log(error.data);
  }
}

slackEvents.on('app_mention', (event) => {
  console.log(`Got message from user ${event.user}: ${event.text}`);
  sendMessage(event.user, event.channel)
})

slackEvents.on('message.im', (event) => {
  console.log(`Got private message from user ${event.user}: ${event.text}`);
  sendMessage(event.user, event.channel)
})


slackEvents.on('error', console.error)

slackEvents.start(port).then(() => {
  console.log(`⚡ Server running on port: ${port} ⚡`)
})