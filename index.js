const credentials = require('./test/config');
const { login, fetchUserVideoInfos } = require('./msstreams-utils');
const { ensureDirExists, fileExists, readJsonFromFile, writeJsonToFile } = require('./file-utils');

async function processUser(token, userUuid) {
    // paths
    const userDir = `./output/${userUuid}`;
    const videoInfosPath = `${userDir}/videos.json`;

    // create user dir if needed
    await ensureDirExists(userDir);

    // fetch video infos if needed
    let videoInfos;
    if (fileExists(videoInfosPath)) {
        videoInfos = readJsonFromFile(videoInfosPath);
    } else {
        // get the user's video info
        videoInfos = await fetchUserVideoInfos(userUuid, token);
        writeJsonToFile(videoInfosPath, videoInfos);
    }

    console.log("VideoInfos", videoInfos);
}

const main = async () => {
    // basic credentials
    const account = process.env.TEST_ACCOUNT || credentials.account;
    const pwd = process.env.TEST_PWD || credentials.pwd;
    const userUuids = credentials.userUuids;

    // get the account token
    const token = await login({ account, pwd});

    // process all users
    for (const userUuid of userUuids) {
        await processUser(token, userUuid);
    }
}

main();
