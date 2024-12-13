import { router, RouterPath } from "@/main"

function showAccountZone()
{
    router.push(`${RouterPath.MAIN}/${RouterPath.USER_ZONE}`)
}

export { showAccountZone }