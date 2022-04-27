const credentials = require('./config');
const { login, fetchChannelVideoInfos, fetchUserVideoInfos, getChannels, downloadVideo } = require('./msstreams-utils');
const { ensureDirExists, fileExists, readJsonFromFile, writeJsonToFile } = require('./file-utils');

async function processChannel(token, channelUuid) {
    // paths
    const channelDir = `./output/channels`;
    const videoInfosPath = `${channelDir}/${channelUuid}.json`;

    // create user dir if needed
    await ensureDirExists(channelDir);

    // fetch video infos if needed
    let videoInfos;
    if (fileExists(videoInfosPath)) {
        console.log('* Reading videos.json');
        videoInfos = readJsonFromFile(videoInfosPath);
    } else {
        // get the channel's video info
        console.log('* Fetch videos info');
        videoInfos = await fetchChannelVideoInfos(channelUuid, token);

        console.log('* Writing to videos.json');
        writeJsonToFile(videoInfosPath, videoInfos);
    }
}

async function processUser(token, userUuid) {
    // paths
    const userDir = `./output/${userUuid}`;
    const videoInfosPath = `${userDir}/videos.json`;
    const videosDir = `${userDir}/videos`;

    // create user dir if needed
    await ensureDirExists(userDir);

    // fetch video infos if needed
    let videoInfos;
    if (fileExists(videoInfosPath)) {
        console.log('* Reading videos.json');
        videoInfos = readJsonFromFile(videoInfosPath);
    } else {
        // get the user's video info
        console.log('* Fetch videos info');
        videoInfos = await fetchUserVideoInfos(userUuid, token);

        console.log('* Writing to videos.json');
        writeJsonToFile(videoInfosPath, videoInfos);
    }

    // create user videos dir if needed
    await ensureDirExists(videosDir);

    // download video files
    for (const videoInfo of videoInfos) {
        const videoName = videoInfo.name;

        // replaces sequence of non-alphanumeric characters with '-'
        const safeName = videoName.replace(/[^a-z0-9]/gmi, " ").replace(/\s+/g, "-");

        // TODO: Is it right to assume these are mp4?
        // video file's base name is the "<UUID>-<VIDEO NAME>.mp4"
        const videoBaseName = `${videoInfo.id}-${safeName}.mp4`;

        const videoFilePath = `${videosDir}/${videoBaseName}`;

        // download file if needed
        if (fileExists(videoFilePath)) {
            console.log(`* Already downloaded video ${videoBaseName} **`);
        } else {
            console.log(`* Downloading video ${videoBaseName} to ${videoFilePath} **`);
            await downloadVideo(videoInfo, token, videoFilePath);
        }
    }
}

const main = async () => {
    // basic credentials
    const account = process.env.TEST_ACCOUNT || credentials.account;
    const pwd = process.env.TEST_PWD || credentials.pwd;
    const userUuids = credentials.userUuids;
    const channelUuids = credentials.channelUuids;

    // get the account token
    console.log(`** Get account token for ${account} **`);

    const token = await login({ account, pwd});

    console.log(`** Done getting account token for ${account} **`);
    console.log();

    // process all users
    for (const userUuid of userUuids) {
        console.log(`** Processing user ${userUuid} **`);

        await processUser(token, userUuid);

        console.log(`** Done processing user ${userUuid} **`);
        console.log();
    }

    // process all channels
    for (const channelUuid of channelUuids) {
        console.log(`** Processing channel ${channelUuid} **`);

        await processChannel(token, channelUuid);

        console.log(`** Done processing channel ${channelUuid} **`);
        console.log();
    }
}

main();
