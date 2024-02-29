import headhunter from "./headhunter.js"
import config from "config"

const init = async () => {
    const resumeHashes = await headhunter.getResumeHashes()
    console.log(`Got ${resumeHashes.length} resumes hashes.`)
    setInterval(async () => {
        await headhunter.processBumping(resumeHashes)
    }, +config.get('checkInterval'))
}

init()
