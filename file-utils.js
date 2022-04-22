const fs = require('fs');
const stream = require('stream');
const { promisify } = require('util');
const axios = require('axios');

async function ensureDirExists(path) {
    try {
        await fs.promises.mkdir(path, { recursive: true });
    } catch (err) {
        // Ignore the error if the folder already exists
        if (err.code !== 'EEXIST') {
            throw err;
        }
    }
}

function fileExists(path) {
    return fs.existsSync(path);
}

function readJsonFromFile(path) {
    const data = fs.readFileSync(path);
    return JSON.parse(data);
}

function writeJsonToFile(path, json) {
    let data = JSON.stringify(json);
    return fs.writeFileSync(path, data);
}

async function downloadFile(fileUrl, headers, filePath) {
    const tempFilePath = `${filePath}.tmp`;

    // delete temp file if it exists
    if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath)
    }

    const finished = promisify(stream.finished);
    const writer = fs.createWriteStream(tempFilePath);
    await axios({
        method: 'get',
        url: fileUrl,
        responseType: 'stream',
        headers,
    }).then(async response => {
        response.data.pipe(writer);
        return await finished(writer);
    });

    // move file to real path
    fs.renameSync(tempFilePath, filePath);
}

module.exports = {
    ensureDirExists,
    fileExists,
    readJsonFromFile,
    writeJsonToFile,
    downloadFile,
};
