<template>
    <USlideover title="Approval" description="List of commission changes requiring approval">
        <div class="relative inline-flex">
            <UButton icon="i-lucide-bell" size="sm" color="neutral" variant="ghost" />
            <span class="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-gray-900 bg-red-500 transform translate-x-1/4 -translate-y-1/4" />
        </div>

        <template #body>
            <div class="space-y-3 p-1">
                <UCard 
                    v-for="item in approvalItems" 
                    :key="item.id"
                >
                    <template #header>
                        <div class="flex items-start justify-between gap-2">
                            <div class="flex items-center gap-2">
                                <UAvatar :src="item.requester.avatar" :alt="item.requester.name" size="2xs" />
                                <div>
                                    <p class="text-xs font-semibold text-gray-900 dark:text-white leading-tight">{{ item.requester.name }}</p>
                                    <p class="text-[10px] text-gray-500 dark:text-gray-400">{{ item.timestamp }}</p>
                                </div>
                            </div>
                            <UBadge :label="item.type" size="xs" variant="subtle" color="primary" />
                        </div>
                    </template>

                    <div class="space-y-2">
                        <p class="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                            {{ item.description }}
                        </p>

                        <div class="grid grid-cols-2 gap-2">
                            <!-- Old Value Card (Red) -->
                            <div class="p-2 rounded border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20">
                                <ul class="space-y-1">
                                    <li class="flex justify-between text-[10px]">
                                        <span class="text-gray-500 dark:text-gray-400">DPP:</span>
                                        <span class="font-medium text-gray-900 dark:text-white">{{ item.oldValue.dpp }}</span>
                                    </li>
                                    <li class="flex justify-between text-[10px]">
                                        <span class="text-gray-500 dark:text-gray-400">Comm:</span>
                                        <span class="font-medium text-gray-900 dark:text-white">{{ item.oldValue.commission }}</span>
                                    </li>
                                    <li class="flex justify-between text-[10px]">
                                        <span class="text-gray-500 dark:text-gray-400">Status:</span>
                                        <span class="font-medium text-gray-900 dark:text-white">{{ item.oldValue.status }}</span>
                                    </li>
                                </ul>
                            </div>

                            <!-- New Value Card (Green) -->
                            <div class="p-2 rounded border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-950/20">
                                <ul class="space-y-1">
                                     <li class="flex justify-between text-[10px]">
                                        <span class="text-gray-500 dark:text-gray-400">DPP:</span>
                                        <span class="font-medium text-gray-900 dark:text-white">{{ item.newValue.dpp }}</span>
                                    </li>
                                    <li class="flex justify-between text-[10px]">
                                        <span class="text-gray-500 dark:text-gray-400">Comm:</span>
                                        <span class="font-medium text-gray-900 dark:text-white">{{ item.newValue.commission }}</span>
                                    </li>
                                    <li class="flex justify-between text-[10px]">
                                        <span class="text-gray-500 dark:text-gray-400">Status:</span>
                                        <span class="font-medium text-gray-900 dark:text-white">{{ item.newValue.status }}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <template #footer>
                        <div class="flex gap-2">
                            <UButton 
                                size="xs"
                                color="error" 
                                variant="soft" 
                                block 
                                label="Decline" 
                                class="flex-1"
                                @click="handleDecline(item.id)"
                            />
                            <UButton 
                                size="xs"
                                color="success" 
                                variant="solid" 
                                block 
                                label="Accept" 
                                class="flex-1"
                                @click="handleAccept(item.id)"
                            />
                        </div>
                    </template>
                </UCard>
            </div>
        </template>
    </USlideover>
</template>

<script setup lang="ts">
interface ValueDetail {
    dpp: string;
    commission: string;
    status: string;
}

interface ApprovalItem {
    id: number;
    type: string;
    requester: {
        name: string;
        avatar?: string;
    };
    description: string;
    oldValue: ValueDetail;
    newValue: ValueDetail;
    timestamp: string;
}

const approvalItems = ref<ApprovalItem[]>([
    {
        id: 1,
        type: 'Commission',
        requester: { name: 'Cindy J.', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
        description: 'Update commission percentage for Invoice #INV-2024-001.',
        oldValue: { dpp: 'IDR 5M', commission: '5%', status: 'Draft' },
        newValue: { dpp: 'IDR 5M', commission: '7.5%', status: 'Review' },
        timestamp: '2h ago'
    },
    {
        id: 2,
        type: 'Sales',
        requester: { name: 'Budi S.', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
        description: 'Correction of sales nominal for recurring service.',
        oldValue: { dpp: 'IDR 10M', commission: 'IDR 500k', status: 'Pending' },
        newValue: { dpp: 'IDR 12M', commission: 'IDR 600k', status: 'Pending' },
        timestamp: '5h ago'
    },
    {
        id: 3,
        type: 'Adjustment',
        requester: { name: 'Sarah M.', avatar: 'https://i.pravatar.cc/150?u=saw' },
        description: 'Manual adjustment for Q1 bonus calculation.',
        oldValue: { dpp: 'IDR 0', commission: 'IDR 0', status: 'Rejected' },
        newValue: { dpp: 'IDR 0', commission: 'IDR 2.5M', status: 'Approved' },
        timestamp: '1d ago'
    },
    {
        id: 4,
        type: 'Termin',
        requester: { name: 'Joko W.', avatar: 'https://i.pravatar.cc/150?u=jow' },
        description: 'Change payment terms for Client X.',
        oldValue: { dpp: 'IDR 50M', commission: '2.5%', status: 'On Hold' },
        newValue: { dpp: 'IDR 50M', commission: '2.5%', status: 'Active' },
        timestamp: '1d ago'
    },
    {
        id: 5,
        type: 'Commission',
        requester: { name: 'Andi L.', avatar: 'https://i.pravatar.cc/150?u=anl' },
        description: 'Recalculate commission based on new policy.',
        oldValue: { dpp: 'IDR 25M', commission: '2.5%', status: 'Review' },
        newValue: { dpp: 'IDR 25M', commission: '3.0%', status: 'Approved' },
        timestamp: '2d ago'
    },
    {
        id: 6,
        type: 'Profile',
        requester: { name: 'Admin', avatar: '' },
        description: 'Update employee grade level.',
        oldValue: { dpp: '-', commission: '-', status: 'Junior' },
        newValue: { dpp: '-', commission: '-', status: 'Mid-Level' },
        timestamp: '3d ago'
    }
])

const toast = useToast()

const handleAccept = (id: number) => {
    toast.add({
        title: 'Approved',
        description: `Request #${id} accepted`,
        icon: 'i-lucide-check-circle',
        color: 'success', 
    })
    approvalItems.value = approvalItems.value.filter(i => i.id !== id)
}

const handleDecline = (id: number) => {
    toast.add({
        title: 'Declined',
        description: `Request #${id} declined`,
        icon: 'i-lucide-x-circle',
        color: 'error',
    })
    approvalItems.value = approvalItems.value.filter(i => i.id !== id)
}
</script>