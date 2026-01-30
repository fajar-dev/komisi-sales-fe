
<template>
    <div class="h-screen flex items-center justify-center px-4 relative overflow-hidden">
        <HeroBackground/>

        <UContainer class="max-w-md relative z-10">
            <div
                class="p-0"
            >
                <UCard>
                  <div class="space-y-6 text-center">
                    <div class="flex justify-center mb-5">
                        <img
                            src="/logo.png"
                            alt="Sele-Sele Logo"
                            class="h-10 w-auto object-contain transition-transform hover:scale-110 duration-300"
                        />
                    </div>
                    
                    <div class="space-y-2">
                        <p class="text-gray-700 dark:text-gray-300 text-sm font-medium">
                            Komisi Sales Digital Business
                        </p>
                        <p class="text-gray-500 dark:text-gray-400 text-xs">
                            Login untuk melanjutkan.
                        </p>
                    </div>

                    
                    <UButton
                        variant="soft"
                        size="lg"
                        color="neutral"
                        class="w-full justify-center group hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                        :loading="googleLoading"
                        @click="handleGoogleLogin"
                    >
                        <template v-if="!googleLoading" #leading>
                            <Icon name="logos:google-icon" class="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                        </template>
                        <span class="font-medium">
                            {{ googleLoading ? 'Signing in...' : 'Continue with Google' }}
                        </span>
                    </UButton>
                    
                    <!-- Footer -->
                    <div class="pt-4 ">
                      <p class="text-gray-600 dark:text-gray-400 text-sm">
                          PT. Media Antar Nusa • © {{ new Date().getFullYear() }}
                      </p>
                    </div>
                </div>
                </UCard>
            </div>
        </UContainer>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth'
})

const googleLoading = ref(false)
const toast = useToast()
import { authService } from "~/services/auth-service"

const user = authService.user

const userDropdownItems = computed(() => [
  [{
    label: 'Logout',
    icon: 'i-lucide-log-out',
    onSelect: () => {
      authService.logout()
      toast.add({ title: 'Logged out successfully' })
    }
  }]
])

const handleOnSuccess = async (response: any) => {
  try {
    const result = await authService.googleLogin(response.code);
    toast.add({ title: 'Login Successful', color: 'primary' })
    
    const { getRoute } = useDashboardRoute()
    navigateTo(getRoute(result.data.user))
  } catch (error) {
    toast.add({ title: 'Authentication failed', color: 'error' })
  } finally {
    googleLoading.value = false
  }
};

const handleOnError = (errorResponse: any) => {
  googleLoading.value = false
  toast.add({ title: 'Google Sign-In Error', color: 'error' })
};

const { isReady, login } = useCodeClient({
  onSuccess: handleOnSuccess,
  onError: handleOnError,
});

const handleGoogleLogin = () => {
  if (!isReady.value) return
  googleLoading.value = true
  login()
}

</script>