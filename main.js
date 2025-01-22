import headhunter from "./headhunter.js"
import config from "config"

const init = async () => {
    const shouldProcessBumping = config.get('resumeBumper.enabled')
    const shouldBoostActivity = config.get('activityBoost.enabled')

    if (shouldProcessBumping) {
        const resumeHashes = await headhunter.getResumeHashes()
        console.log(`Got ${resumeHashes.length} resumes.`)
        setInterval(async () => {
            await headhunter.processBumping(resumeHashes)
        }, +config.get('resumeBumper.checkInterval'))
    }

    if (shouldBoostActivity) {
        let lastVacancyId;
        setInterval(async () => {
            const activityScore = await headhunter.getActivityScore()
            if (activityScore < 100) {
                console.log(`Current activity score is ${activityScore}.`)
                if (!lastVacancyId) {
                    lastVacancyId = await headhunter.getFirstVacancyId()
                } else {
                    lastVacancyId++
                }
                await headhunter.viewVacancy(lastVacancyId)
            }
        }, +config.get('activityBoost.checkInterval'))
    }
}

init()
