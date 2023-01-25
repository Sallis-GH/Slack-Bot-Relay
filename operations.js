const dotenv = require('dotenv').config()
const { WebClient } = require('@slack/web-api')
const { createEventAdapter } = require('@slack/events-api')
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET
const slackToken = process.env.SLACK_TOKEN
const port = process.env.PORT || 6969

const slackEvents = createEventAdapter(slackSigningSecret)
const slackClient = new WebClient(slackToken)


async function findConversation(name) {
  try {
    const result = await slackClient.conversations.list({
      token: slackToken,
      limit: 400,
    });
    for (const channel of result.channels) {
      if (channel.name === name) {
        conversationId = channel.id;

        console.log("Found conversation ID: " + conversationId);
        break;
      }
    }
  }
  catch (error) {
    console.error(error);
  }
}

const sendMessage = async (user, channel) => {
  try {
    await slackClient.chat.postMessage({ channel, text: `Hello, <@${user}> :wicked:` })
  } catch (error) {
    console.log(error.data);
  }
}


async function publishMessage(id, text) {
  try {
    // Call the chat.postMessage method using the built-in WebClient
    const result = await slackClient.chat.postMessage({
      // The token you used to initialize your app
      token: slackToken,
      channel: id,
      text: text
      // You could also use a blocks[] array to send richer content
    });

    // Print result, which includes information about the message (like TS)
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
}





module.exports = {findConversation, sendMessage, publishMessage}