import { useAuth } from '../contexts/AuthContext'

export function usePermission() {
    const { permissions } = useAuth()

    const has = (code) => {
        if (!code) return true
        if (!permissions || permissions.length === 0) return false
        return permissions.includes(code)
    }

    const hasAny = (codes = []) => codes.some((c) => has(c))
    const hasAll = (codes = []) => codes.every((c) => has(c))

    return { has, hasAny, hasAll, permissions }
}