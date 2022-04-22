const credentials = require('./test/config');
const { login, fetchUserVideoInfos } = require('./msstreams-utils');


const main = async () => {
    const account = process.env.TEST_ACCOUNT || credentials.account;
    const pwd = process.env.TEST_PWD || credentials.pwd;
    const userUuid = process.env.TEST_USER_UUID || credentials.userUuid;

    const token = await login({ account, pwd});
    const videoInfos = await fetchUserVideoInfos(userUuid, token);

    console.log("VideoInfos", videoInfos);
}

main();
