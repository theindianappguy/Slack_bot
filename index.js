require('dotenv').config();
const { App } = require('@slack/bolt');
const { URL } = require('url');
const axios = require('axios'); // Import axios for making HTTP requests

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

// Regular expression to match YouTube video URLs
const youtubeRegex = /^(https?\:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/).+$/;

app.message(async ({ message, say }) => {
  try {
    // Extract URLs from the message text
    const urls = extractUrls(message.text);
    const messageLength = message.text.trim().length;


    let isYoutubeLink = false;
    for (const url of urls) {
      if (url.match(youtubeRegex)) {
        isYoutubeLink = true;
        const apiResponse = await axios.post('https://magicslides-tools-api.onrender.com/public/api/ppt_from_youtube', {
          youtubeURL: url,
          email: 'adarshpriyadarshi001@gmail.com',
          accessId: '8PYSzcJe-aUNS7S8K-2G2p4lIg-1hci7l2X'
        });

        // console.log('API Response:', apiResponse.data);

        await say({
          text: `YouTube API Response: ${JSON.stringify(apiResponse.data.url)}`,
          channel: message.channel
        });
        break;
      }
    }

    // *********************************************************************************************************
    // *********************************************************************************************************

    const pdfRegex = /^(https?:\/\/)?([^\/\s]+\/)(\S+)\.pdf$/i;

    let isPdfLink = false;
    for (const url of urls) {
      // Decode the URL to remove %3E
      const decodedUrl = decodeURIComponent(url).replace(/>/g, '');

      console.log("These is ppt url...........", decodedUrl.match(pdfRegex));

      if (decodedUrl.match(pdfRegex)) {
        isPdfLink = true;
        // Call the API with required parameters for YouTube link
        const apiResponse = await axios.post('https://magicslides-tools-api.onrender.com/public/api/ppt_from_pdf', {
          pdfURL: decodedUrl,
          email: 'adarshpriyadarshi001@gmail.com',
          accessId: '8PYSzcJe-aUNS7S8K-2G2p4lIg-1hci7l2X'
        });

        // Log the API response data
        //console.log('API Response:', apiResponse.data);

        // Send the API response to the Slack bot
        await say({
          text: `PDF API Response: ${JSON.stringify(apiResponse.data.url)}`,
          channel: message.channel
        });
        break; // Exit the loop once a YouTube link is found
      }
    }



    // *********************************************************************************************************
    // *********************************************************************************************************

    const isOtherLink = false;
    for (const url of urls) {
      const decodedUrl = decodeURIComponent(url).replace(/>/g, '');
      console.log("These is url.........", decodedUrl)
      if (!isYoutubeLink && !isPdfLink) {
        const isOtherLink = true;
        // Call the API with required parameters for YouTube link
        const apiResponse = await axios.post('https://magicslides-tools-api.onrender.com/public/api/ppt_from_url', {
          webURL: decodedUrl,
          email: 'adarshpriyadarshi001@gmail.com',
          accessId: '8PYSzcJe-aUNS7S8K-2G2p4lIg-1hci7l2X'
        });

        // Log the API response data
        console.log('API Response:', apiResponse.data);

        // Send the API response to the Slack bot
        await say({
          text: `Simple API Response: ${JSON.stringify(apiResponse.data.url)}`,
          channel: message.channel
        });
        break; // Exit the loop once a YouTube link is found
      }
    }


    // *********************************************************************************************************
    // *********************************************************************************************************


    //If it's not a YouTube link, check the length of the message
    if (!isYoutubeLink && !isPdfLink && !isOtherLink) {
      if (messageLength < 12) {
        // If message length is less than 12, send error message
        await say('Invalid input, Try after sometime');

      } else if (messageLength > 100) {
        const pptApiResponse = await axios.post('https://magicslides-tools-api.onrender.com/public/api/ppt_from_summery', {
          msSummaryText: message.text,
          email: "adarshpriyadarshi001@gmail.com",
          accessId: "8PYSzcJe-aUNS7S8K-2G2p4lIg-1hci7l2X"
        });
        await say({
          text: `Summary API Response: ${JSON.stringify(pptApiResponse.data.url)}`,
          channel: message.channel
        });

      } else if(messageLength>12 && messageLength<99){
        // If message length is greater than or equal to 12, call the PPT API with the specified topic
        const pptApiResponse = await axios.post('https://magicslides-tools-api.onrender.com/public/api/ppt_from_topic', {
          topic: 'Indian Army',
          extraInfoSource: null,
          email: 'adarshpriyadarshi001@gmail.com',
          accessId: '8PYSzcJe-aUNS7S8K-2G2p4lIg-1hci7l2X'
        });

        // Log the PPT API response data
        //console.log('PPT API Response:', pptApiResponse.data);

        // Send the PPT API response to the Slack bot
        await say({
          text: `Topic to PPT API Response: ${JSON.stringify(pptApiResponse.data.url)}`,
          channel: message.channel
        });
      }
    }


  } catch (error) {
    console.error(error);
  }
});

// *********************************************************************************************************
// *********************************************************************************************************


// Function to extract URLs from text using the URL module
function extractUrls(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = text.match(urlRegex);
  return urls ? urls.map(url => new URL(url).href) : [];
}

// Start your app
(async () => {
  await app.start();
  console.log('Bot is running!');
})();





























// *********************************************************************************************************
// *********************************************************************************************************
// *********************************************************************************************************
// *********************************************************************************************************
// *********************************************************************************************************

// // Define a simple message handler
// app.command('/hello',async({command, ack, say}) => { 

//    await ack();
//   // Reply with a simple text message
//   await say(`Hello ,<@${command.user_id}>`);
// });

// app.message("hey", async ({ command, say }) => {
//   try {
//     say("Hello Human!");
//   } catch (error) {
//       console.log("err")
//     console.error(error);
//   }
// });