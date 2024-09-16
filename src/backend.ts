import type { Action, ActionType, ConfigFile } from '../definitions'

async function updateAction(actionId: number, label: string, type: ActionType, value: string) {
    const res = await fetch("/action/" + actionId, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            label,
            type,
            value
        } as Action)
    })
    const data = await res.json()
    return data
}

async function deleteAction(actionId: number) {
    const res = await fetch("/action/" + actionId, {
        method: "DELETE"
    })
    const data = await res.json()
    return data
}

async function getConfig(): Promise<ConfigFile> {
    const res = await fetch("/config")
    const data = await res.json()
    return data
}

async function spawnAction(id: number) {
    const res = await fetch("/spawn/action/" + id)
    const data = await res.json()
    return data
}


export default { updateAction, getConfig, spawnAction, deleteAction }