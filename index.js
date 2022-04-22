const credentials = require('./test/config');
const { login, fetchUserVideoInfos } = require('./msstreams-utils');
const { ensureDirExists, fileExists, readFromFile, writeToFile } = require('./file-utils');

const main = async () => {
    // basic credentials
    const account = process.env.TEST_ACCOUNT || credentials.account;
    const pwd = process.env.TEST_PWD || credentials.pwd;
    const userUuid = process.env.TEST_USER_UUID || credentials.userUuid;

    // get the account token
    const token = await login({ account, pwd});

    // paths
    const userDir = `./output/${userUuid}`;
    const videoInfosPath = `${userDir}/videos.json`;

    // create user dir if needed
    await ensureDirExists(userDir);

    // fetch video infos if needed
    let videoInfos;
    if (fileExists(videoInfosPath)) {
        videoInfos = readFromFile(videoInfosPath);
    } else {
        // get the user's video info
        videoInfos = await fetchUserVideoInfos(userUuid, token);
        writeToFile(videoInfosPath, videoInfos);
    }

    console.log("VideoInfos", videoInfos);
}

main();
