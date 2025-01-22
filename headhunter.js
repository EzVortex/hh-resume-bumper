import axios from "axios"
import * as cheerio from "cheerio";
import { getHeaders } from "./headers.js"
import { sleep } from "./helpers.js"
import FormData from 'form-data'
import config from "config";

let xsrf
const getResumeHashes = async () => {
    try {
        const hashes = []
        const { data } = await axios.get('https://hh.ru/applicant/resumes', { headers: getHeaders() })
        const $ = cheerio.load(data)
        $('a[data-qa^="resume-card-link"]').each(function () {
            const hash = $(this).attr('href')?.split('/resume/')[1]?.split('?')[0]
            if (hash) {
                hashes.push(hash)
            }
        });
        return hashes
    } catch (e) {
        console.log('Failed to get resume hashes.')
        console.log(e)
    }
}

const isResumeReadyToBeBumped = async (hash) => {
    try {
        const { data, headers } = await axios.get('https://hh.ru/applicant/resumes', { headers: getHeaders() })
        setXsrf(headers)
        const $ = cheerio.load(data)
        return $(`[href*=${hash}]`).eq(0).closest('[data-qa="resume"]').find('button[data-qa="resume-update-button_actions"]').eq(0).text() === 'Поднять в поиске'
    } catch (e) {
        console.log('Failed to check resume bump state.')
        console.log(e)
    }
}

const processBumping = async (hashes) => {
    try {
        for (const hash of hashes) {
            const shouldBump = await isResumeReadyToBeBumped(hash)
            if (shouldBump) {
                const formData = new FormData()
                formData.append('resume', hash)
                formData.append('undirectable', 'true')
                await axios.post('https://hh.ru/applicant/resumes/touch', formData, { headers: getHeaders(xsrf) })
                console.log('Bumped!')
                await sleep(config.get('resumeBumper.bumpInterval'))
            }
        }
    } catch (e) {
        console.log('Failed to bump resume.')
        console.log(e)
    }
}

const getActivityScore = async () => {
    try {
        const { data } = await axios.get('https://hh.ru/', { headers: getHeaders() })
        const $ = cheerio.load(data)
        return +$(`[data-qa="activity-score"]`).eq(0).text().split('%')[0]
    } catch (e) {
        console.log('Failed to get activity score.')
        console.log(e)
    }
}

const getFirstVacancyId = async () => {
    try {
        const { data } = await axios.get('https://hh.ru/', { headers: getHeaders() })
        const $ = cheerio.load(data)
        return $('[data-qa*="vacancy-serp__vacancy"]').eq(0).find('[data-qa="serp-item__title"]').attr('href').split('/vacancy/')[1].split('?')[0]
    } catch (e) {
        console.log('Failed to get first vacancy id.')
        console.log(e)
    }
}

const viewVacancy = async (id) => {
    try {
        await axios.get(`https://hh.ru/vacancy/${id}?from=applicant_recommended&hhtmFrom=main`, { headers: getHeaders() })
        console.log(`Viewed vacancy with id ${id}.`)
    } catch (e) {
        if (e.response.status === 404) {
            return console.log(`Failed to view vacancy with id ${id}. It was deleted.`)
        }
        console.log(e)
    }
}

const setXsrf = (headers) => {
    const cookies = headers['set-cookie']
    xsrf = cookies.find(cookie => cookie.includes('_xsrf=')).split('_xsrf=')[1].split(';')[0]
}

export default { getResumeHashes, processBumping, getActivityScore, getFirstVacancyId, viewVacancy }
