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
                        <div class="flex items-center justify-between gap-2">
                            <UUser
                                :name="item.requester.name"
                                :description="item.timestamp"
                                :avatar="{
                                    src: item.requester.avatar,
                                    icon: 'i-lucide-image'
                                }"
                            />
                            <UBadge :label="item.type" size="md" variant="subtle" color="primary" />
                        </div>
                    </template>

                    <div class="space-y-2">

                        <div class="overflow-hidden rounded border border-gray-200 dark:border-gray-800">
                            <table class="w-full text-[10px] border-collapse">
                                <thead>
                                    <tr class="bg-gray-50 dark:bg-gray-900">
                                        <th class="px-2 py-1 text-left font-medium text-gray-500 dark:text-gray-400">
                                            Field
                                        </th>
                                        <th class="px-2 py-1 text-left font-medium text-red-600 dark:text-red-400">
                                            Value Lama
                                        </th>
                                        <th class="px-2 py-1 text-left font-medium text-green-600 dark:text-green-400">
                                            Value Baru
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="border-t border-gray-200 dark:border-gray-800">
                                        <td class="px-2 py-1 text-gray-500 dark:text-gray-400">DPP</td>
                                        <td class="px-2 py-1 font-medium text-gray-900 dark:text-white">
                                            {{ item.oldValue.dpp }}
                                        </td>
                                        <td class="px-2 py-1 font-medium text-gray-900 dark:text-white">
                                            {{ item.newValue.dpp }}
                                        </td>
                                    </tr>

                                    <tr class="border-t border-gray-200 dark:border-gray-800">
                                        <td class="px-2 py-1 text-gray-500 dark:text-gray-400">Comm</td>
                                        <td class="px-2 py-1 font-medium text-gray-900 dark:text-white">
                                            {{ item.oldValue.commission }}
                                        </td>
                                        <td class="px-2 py-1 font-medium text-gray-900 dark:text-white">
                                            {{ item.newValue.commission }}
                                        </td>
                                    </tr>

                                    <tr class="border-t border-gray-200 dark:border-gray-800">
                                        <td class="px-2 py-1 text-gray-500 dark:text-gray-400">Status</td>
                                        <td class="px-2 py-1 font-medium text-gray-900 dark:text-white">
                                            {{ item.oldValue.status }}
                                        </td>
                                        <td class="px-2 py-1 font-medium text-gray-900 dark:text-white">
                                            {{ item.newValue.status }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <UAlert
                            variant="soft"
                            color="neutral"
                            size="2xs"
                            description="You can change the primary color in your app config."
                        />
                    </div>

                    <template #footer>
                        <div class="flex gap-2">
                            <UButton 
                                color="error" 
                                variant="soft" 
                                block 
                                label="Decline" 
                                class="flex-1"
                            />
                            <UButton 
                                color="success" 
                                variant="solid" 
                                block 
                                label="Accept" 
                                class="flex-1"
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
</script>