const credentials = require('./test/config');
const login = require('./index');

const main = async () => {
    const account = process.env.TEST_ACCOUNT;
    const pwd = process.env.TEST_PWD;
    const cred = account && pwd ? {account, pwd} : credentials;
    console.log(cred)
    const rs = await login(cred);
    console.log(rs)
}

main();
