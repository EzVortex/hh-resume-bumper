import headhunter from "./headhunter.js"
import config from "config"

const init = async () => {
    const resumeHash = await headhunter.getResumeHash()
    setInterval(async () => {
        await headhunter.processBumping(resumeHash)
    }, config.get('interval'))
}

init()
