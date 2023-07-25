import axios from "axios"
import * as cheerio from "cheerio";
import { getHeaders } from "./headers.js"
import FormData from 'form-data'

let xsrf
const getResumeHash = async () => {
    try {
        const { data } = await axios.get('https://hh.ru/applicant/resumes', { headers: getHeaders() })
        const $ = cheerio.load(data)
        return $('a[data-qa="resume-title-link"]').eq(0).attr('href').split('/resume/')[1].split('?')[0]
    } catch (e) {
        console.log('Failed to get resume hash.')
        console.log(e)
    }
}

const isResumeReadyToBeBumped = async () => {
    try {
        const { data, headers } = await axios.get('https://hh.ru/applicant/resumes', { headers: getHeaders() })
        setXsrf(headers)
        const $ = cheerio.load(data)
        return $('button[data-qa="resume-update-button_actions"]').eq(0).text() === 'Поднять в поиске'
    } catch (e) {
        console.log('Failed to check resume bump state.')
        console.log(e)
    }
}

const processBumping = async (hash) => {
    try {
        const shouldBump = await isResumeReadyToBeBumped()
        if (shouldBump) {
            const formData = new FormData()
            formData.append('resume', hash)
            formData.append('undirectable', 'true')
            await axios.post('https://hh.ru/applicant/resumes/touch', formData, { headers: getHeaders(xsrf) })
            console.log('Bumped!')
        }
    } catch (e) {
        console.log('Failed to bump resume.')
        console.log(e)
    }
}

const setXsrf = (headers) => {
    const cookies = headers['set-cookie']
    xsrf = cookies.find(cookie => cookie.includes('_xsrf=')).split('_xsrf=')[1].split(';')[0]
}

export default { getResumeHash, processBumping }
