export function getRequiredEnv(key:string):string {
    const value = process.env[key]

    if(!value?.trim()) throw new Error(`Missing required environment variable: ${key}`)
    
    return value.trim()
}

export function getOptionalEnv(key:string, defaultValue:string):string {
    return process.env[key] ?? defaultValue
}

export function getNumberEnv(key:string, defaultValue:number):number {
    const value = process.env[key] 
    
    if(value === undefined) {
        return defaultValue
    }

    const parsed = Number(value)
    if(Number.isNaN(parsed)) {
        throw new Error(`Enviroment variable "${key}" must be a valid number`)
    }
    return parsed
}
