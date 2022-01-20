const request = require("request");
const homePage = 'https://web.microsoftstream.com/?noSignUpCheck=1';
let contextCookies = [];
let streamCookies = [];
const matchValue = (key, content) => {
    const matchs = new RegExp(`"${key}":"(.*?)"`, 'gm').exec(content);
    if (matchs) {
        return matchs[1];
    } else {
        return null;
    }
}
const getSessionInfo = (content) => {
    const regex = new RegExp(/\<input\s+type="hidden"\s+name="(.*?)"\s+value="(.*?)"\s+\/\>/, 'gm');
    const items = [];
    let match;
    while (match = regex.exec(content)) {
        items.push({ key: match[1], value: match[2] });
    }
    return items;
}

const getCookieObject = (cookieItems, reset = false) => {
    if (reset) {
        contextCookies = [];
    }
    if (cookieItems && cookieItems.length) {
        const cookies = [];
        const keys = [];
        cookieItems.map((item) => {
            const matchs = new RegExp(/(.*?)=(.*?);/, 'gm').exec(item);
            if (matchs) {
                keys.push(matchs[1]);
                cookies.push({ key: matchs[1], value: matchs[2] });
            }
        });
        const temp = contextCookies.filter(x => !keys.includes(x.key));
        contextCookies = temp.concat(cookies);
    }
    return contextCookies;
}
const createCookieHeader = () => {
    return createBaseCookieHeader(contextCookies);
}
const createBaseCookieHeader = (cookieItems) => {
    if (cookieItems.length) {
        const rs = [];
        cookieItems.map((item) => {
            rs.push(`${item.key}=${item.value}`);
        });
        return rs.join('; ');
    } else {
        return null;
    }
}
const startStep = async () => {
    return new Promise((reslove, reject) => {
        request.get({url: homePage, followRedirect: false}, (err, res, body) => {
            streamCookies = getCookieObject(res.headers['set-cookie']);
            reslove(res.headers['location']);
        });
    });
}
const goAuthorizeStep = async (url) => {
    return new Promise((reslove, reject) => {
        request.get(url, (err, res, body) => {
            const flowToken = matchValue('sFT', body);
            const originalRequest = matchValue('sCtx', body);
            const correlationId = matchValue('correlationId', body); // client-request-id next request
            const apiCanary = matchValue('apiCanary', body); // canary in next step
            const canary = matchValue('canary', body); // canary in next step
            const requestId = res.headers['x-ms-request-id']; //hpgrequestid in next step
            const authorizeCookies = getCookieObject(res.headers['set-cookie']);
            reslove({ requestId, authorizeCookies, flowToken, originalRequest, apiCanary, correlationId, canary });
        });
    });
}
const getCredentialStep = async (context, account) => {
    return new Promise((reslove, reject) => {
        const url = 'https://login.microsoftonline.com/common/GetCredentialType?mkt=en-US';
        const data = {
            "username": account.account,
            "isOtherIdpSupported": false,
            "checkPhones": false,
            "isRemoteNGCSupported": true,
            "isCookieBannerShown": false, // false
            "isFidoSupported": true,
            "originalRequest": context['originalRequest'],
            "country": "CN",
            "forceotclogin": false,
            "isExternalFederationDisallowed": false,
            "isRemoteConnectSupported": false,
            "federationFlags": 0,
            "flowToken": context['flowToken'],
            "isAccessPassSupported": true
        };
        const headers = {
            'canary': context['apiCanary'],
            'client-request-id': context['correlationId'],
            'hpgrequestid': context['requestId'],
            'Cookie': createCookieHeader()
        };
        request.post({ url: url, headers: headers, json: true, body: data }, (err, res, body) => {
            const flowToken = body.FlowToken;
            const originalRequest = matchValue('sCtx', body);
            const apiCanary = body.apiCanary;
            const requestId = res.headers['x-ms-request-id'];
            const credentialCookies = getCookieObject(res.headers['set-cookie']);
            reslove({ requestId, credentialCookies, flowToken, originalRequest, apiCanary });
        });
    });
}

const loginStep = async (authContext, credContext, account) => {
    return new Promise((reslove, reject) => {
        const url = 'https://login.microsoftonline.com/common/login';
        const data = {
            "i13": "0",
            "login": account.account,
            "loginfmt": account.account,
            "type": "11",
            "LoginOptions": "3",
            "lrt": "",
            "lrtPartition": "",
            "hisRegion": "",
            "hisScaleUnit": "",
            "passwd": account.pwd,
            "ps": "2",
            "psRNGCDefaultType": "",
            "psRNGCEntropy": "",
            "psRNGCSLK": "",
            "canary": authContext['canary'],
            "ctx": authContext['originalRequest'],
            "hpgrequestid": authContext['requestId'],
            "flowToken": credContext['flowToken'],
            "PPSX": "",
            "NewUser": "1",
            "FoundMSAs": "",
            "fspost": "0",
            "i21": "0",
            "CookieDisclosure": "0",
            "IsFidoSupported": "1",
            "i2": "1",
            "i17": "",
            "i18": "",
            "i19": "16444"
        };
        const headers = {
            'Cookie': createCookieHeader(),
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        request.post({ url: url, headers: headers, form: data }, (err, res, body) => {
            const flowToken = matchValue('sFT', body);
            const originalRequest = matchValue('sCtx', body);
            const correlationId = matchValue('correlationId', body);
            const apiCanary = matchValue('apiCanary', body);
            const canary = matchValue('canary', body);
            const requestId = res.headers['x-ms-request-id'];
            const loginCookies = getCookieObject(res.headers['set-cookie']);
            reslove({ requestId, loginCookies, flowToken, originalRequest, apiCanary, correlationId, canary });
        });
    });
}
const kmsiStep = async (context) => {
    return new Promise((reslove, reject) => {
        const url = 'https://login.microsoftonline.com/kmsi';
        const data = {
            "LoginOptions": "1",
            "type": "28",
            "ctx": context['originalRequest'],
            "hpgrequestid": context['requestId'],
            "flowToken": context['flowToken'],
            "canary": context['canary'],
            "i2": "",
            "i17": "",
            "i18": "",
            "i19": "423028"
        };
        const headers = {
            'Cookie': createCookieHeader(),
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        request.post({ url: url, headers: headers, form: data }, (err, res, body) => {
            getCookieObject(res.headers['set-cookie']);
            const state = getSessionInfo(body);
            reslove(state);
        });
    });
}
const postCallback = async (data) => {
    return new Promise((reslove, reject) => {
        const url = 'https://web.microsoftstream.com/';
        const headers = {
            'Referer': 'https://login.microsoftonline.com/',
            'Origin': 'https://login.microsoftonline.com/',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': createBaseCookieHeader(streamCookies)
        };
        const formData = {};
        data.map( x => formData[x.key] = x.value);
        request.post({ url: url, headers: headers, form: formData }, (err, res, body) => {
            const postCookies = getCookieObject(res.headers['set-cookie'], true);
            const redirectUrl = res.headers['location'];
            reslove({postCookies, redirectUrl});
        });
    });
}
const getAccessToken = async(context) => {
    return new Promise((reslove, reject) => {
        const url = context['redirectUrl'];
        const headers = {
            'Cookie': createBaseCookieHeader(context['postCookies'])
        };
        request.get({ url: url, headers: headers}, (err, res, body) => {
            const accessToken = matchValue('AccessToken', body);
            const apiGatewayUri = matchValue('ApiGatewayUri', body);
            const apiGatewayVersion = matchValue('ApiGatewayVersion', body);
            const accessTokenExpiry = matchValue('AccessTokenExpiry', body);
            reslove({accessToken, apiGatewayUri, apiGatewayVersion, accessTokenExpiry});
        });
    });
}

const exportStep = async (uuid, token) => {
    return new Promise((resolve, reject) => {
        const url = 'https://uswe-1.api.microsoftstream.com/api/principals/' + uuid + '/exportData?api-version=1.4-private';
        const data = {
            "aadState": "active",
            "type": "User"
        };
        const head = {
            "Content-Type": "application/json;charset=UTF-8",
            "Authorization": "Bearer " + token.accessToken
        };
        request.post({ url: url, headers: head, form: data }, (err, res, body) => {
            resolve({ });
        });
    });
}
async function microsoftStreamAuth(credentials) {
    console.log('* Open web.microsoftstream.com');
    const authUrl = await startStep();
    console.log('* Redirect to login.microsoftonline.com');
    const authContext = await goAuthorizeStep(authUrl);
    console.log('* Send account and check credential type');
    const credContext = await getCredentialStep(authContext, credentials);
    console.log('* Send password');
    const loginContext = await loginStep(authContext, credContext, credentials);
    console.log('* Go thought "Stay in..."');
    const kmsiContext = await kmsiStep(loginContext);
    console.log('* Redirect back to web.microsoftstream.com');
    const postCallbackContext = await postCallback(kmsiContext);
    console.log('* Redirect to web.microsoftstream.com?noSignUpCheck=1 and get access token');
    const token = await getAccessToken(postCallbackContext);
    console.log('* Export usage details')
    //const arr = [];
    //arr.forEach(element => { exportStep(element,token) });
    //const foo = await exportStep(token);
    return token;
};

exports = module.exports = microsoftStreamAuth;
