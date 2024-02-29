import headhunter from "./headhunter.js"
import config from "config"

const init = async () => {
    const resumeHashes = await headhunter.getResumeHashes()
    setInterval(async () => {
        await headhunter.processBumping(resumeHashes)
    }, +config.get('checkInterval'))
}

init()
