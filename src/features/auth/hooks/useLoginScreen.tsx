import { useRouter } from "expo-router"


export const useLoginScreen = () => {
    const router = useRouter()
    const goToRegister = () => {
        router.push('/(auth)/register')

    }
    return {
        goToRegister
    }
}