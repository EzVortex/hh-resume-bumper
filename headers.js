import config from "config";
const token = config.get('token')

const headers = {
    'Cookie': `hhtoken=${token};`,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/116.0',
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br'
}

export const getHeaders = (xsrf) => {
    const tempHeaders = Object.assign({}, headers)
    if (xsrf) {
        tempHeaders['Cookie'] += `_xsrf=${xsrf};`
        tempHeaders['x-xsrftoken'] = xsrf
    }
    return tempHeaders
}
