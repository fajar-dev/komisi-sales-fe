<template>
    <UContainer>
        <HeroBackground />
        <div class="py-10">
            <div class="flex md:flex-row flex-col items-end justify-between gap-4">
                <div class="flex items-center gap-1">
                    <UUser
                        :avatar="{
                            src: employee?.photo_profile,
                            icon: 'i-lucide-image'
                        }"
                        :ui="{ avatar: 'h-10 w-10' }"
                    />
                    <div>
                        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">
                                {{ employee?.name }}'s Commission
                        </h2>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            Monthly sales commission heatmap 🔥                    
                        </p>
                    </div>
                </div>
                <USelectMenu v-model="year" :items="items" />
            </div>
        </div>

        <div class="py-2">
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <UPageCard
                    v-for="card in monthcard"
                    :key="card.mounth"
                    :title="String(card.total)"
                    :description="card.mounth"
                >
                </UPageCard>
            </div>
        </div>

        <div class="py-2">
            <div class="grid grid-cols-1 md:grid-cols-1 gap-4">
                <UCard>
                <template #header>
                    <div class="lg:flex items-center justify-between">
                        <div>
                            <h2>Monthly Commission</h2>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                Total monthly commission
                            </p>
                        </div>
                        <div>
                            <h1 class="font-bold text-2xl">Total: {{ new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalCommissionData.reduce((total, item) => total + item.total, 0)) }}</h1>
                        </div>
                    </div>
                </template>
                     <LineChart
                        :data="totalCommissionData"
                        :height="280"
                        y-label="Total Commission"
                        :x-num-ticks="4"
                        :y-num-ticks="4"
                        :categories="totalCommissionChart"
                        :x-formatter="xFormatterTotalCommission"
                        :y-formatter="yFormatterCommission"
                        :y-grid-line="true"
                        :curve-type="CurveType.MonotoneX"
                        :legend-position="LegendPosition.TopRight"
                        :hide-legend="false"
                    />
                </UCard>
            </div>
        </div>

        <!-- Internal Charts -->
        <div class="py-2">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UCard>
            <template #header>
                <h2>Commission Internal</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                Internal Sales Commission
                </p>
            </template>
                <AreaChart
                    :key="colorMode.value + '-internal'"
                    :data="commissionInternalData"
                    :height="280"
                    :categories="commissionInternalChart"
                    :stacked="true"
                    :x-formatter="xFormatterCommissionInternal"
                    :y-formatter="yFormatterCommission"
                    :curve-type="CurveType.MonotoneX"
                    :legend-position="LegendPosition.TopRight"
                    :hide-legend="false"
                    :y-grid-line="true"
                    :x-grid-line="false"
                />
            </UCard>
            <UCard>
            <template #header>
                <h2>Customer Internal</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                Internal Customer Count
                </p>
            </template>
                <BarChart
                    :data="customerInternalData"
                    :height="300"
                    :categories="customerInternalChart"
                    :y-axis="['solo', 'booster', 'recurring']"
                    :group-padding="0"
                    :bar-padding="0.2"
                    :x-num-ticks="6"
                    :radius="4"
                    :x-formatter="xFormatterInternal"
                    :y-formatter="yFormatter"
                    :legend-position="LegendPosition.TopRight"
                    :hide-legend="false"
                    :y-grid-line="true"
                />
            </UCard>
        </div>
        </div>

        <!-- Resell Chart -->
        <div class="py-2">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UCard>
            <template #header>
                <h2>Commission Resell</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                Resell Sales Commission
                </p>
            </template>
                <AreaChart
                    :key="colorMode.value + '-resell'"
                    :data="commissionResellData"
                    :height="280"
                    :categories="commissionResellChart"
                    :stacked="true"
                    :x-formatter="xFormatterCommissionResell"
                    :y-formatter="yFormatterCommission"
                    :curve-type="CurveType.MonotoneX"
                    :legend-position="LegendPosition.TopRight"
                    :hide-legend="false"
                    :y-grid-line="true"
                    :x-grid-line="false"
                />
            </UCard>
            <UCard>
            <template #header>
                <h2>Customer Resell</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                Resell Customer Count
                </p>
            </template>
                <BarChart
                    :data="customerResellData"
                    :height="300"
                    :categories="customerResellChart"
                    :y-axis="['margin_high', 'margin_medium', 'margin_low', 'recurring']"
                    :group-padding="0"
                    :bar-padding="0.2"
                    :x-num-ticks="6"
                    :radius="4"
                    :x-formatter="xFormatterResell"
                    :y-formatter="yFormatter"
                    :legend-position="LegendPosition.TopRight"
                    :hide-legend="false"
                    :y-grid-line="true"
                />
            </UCard>
        </div>
        </div>
    </UContainer>
</template>

<script setup lang="ts">
import { CommissionService } from '~/services/commission-service'
import { EmployeeService } from '~/services/employee-service'
import type { Employee } from '~/types/employee'

const route = useRoute()
const employee = ref<Employee>()  

// Year Select
const items = ref([2026, 2027, 2028, 2029, 2030])
const year = ref(new Date().getFullYear())

const colorMode = useColorMode()

// Commission Chart Internal (Area Chart)
const commissionInternalData = ref<{
    date: string;
    solo: number;
    booster: number;
    recurring: number;
}[]>([])

const commissionInternalChart: Record<string, BulletLegendItemInterface> = {
  solo: { name: 'Solo', color: '#3b82f6' },
  booster: { name: 'Booster', color: '#22c55e' },
  recurring: { name: 'Recurring', color: '#f97316' },
}

const xFormatterCommissionInternal = (tick: number, _i?: number, _ticks?: number[]): string => {
  return String(commissionInternalData.value[tick]?.date ?? '')
}

// Commission Chart Resell (Area Chart)
const commissionResellData = ref<{
    date: string;
    margin_high: number;
    margin_medium: number;
    margin_low: number;
    recurring: number;
}[]>([])

const commissionResellChart: Record<string, BulletLegendItemInterface> = {
  margin_high: { name: 'Margin ≥15%', color: '#3b82f6' },
  margin_medium: { name: 'Margin 10-15%', color: '#22c55e' },
  margin_low: { name: 'Margin <10%', color: '#f97316' },
  recurring: { name: 'Recurring', color: '#8b5cf6' },
}

const xFormatterCommissionResell = (tick: number, _i?: number, _ticks?: number[]): string => {
  return String(commissionResellData.value[tick]?.date ?? '')
}

const yFormatterCommission = (value: number): string => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)
}

// Total Commission Chart (Line Chart)
const totalCommissionData = ref<{
    date: string;
    total: number;
}[]>([])

const totalCommissionChart: Record<string, BulletLegendItemInterface> = {
    total: { name: 'Total Commission', color: '#10b981' },
}

const xFormatterTotalCommission = (tick: number, _i?: number, _ticks?: number[]): string => {
  return String(totalCommissionData.value[tick]?.date ?? '')
}

// Customer Chart Internal (Bar Chart)
const customerInternalData = ref<{
    month: string;
    solo: number;
    booster: number;
    recurring: number;
}[]>([])

const customerInternalChart = {
  solo: { name: 'Solo', color: '#3b82f6' },
  booster: { name: 'Booster', color: '#22c55e' },
  recurring: { name: 'Recurring', color: '#f97316' },
}

const xFormatterInternal = (i: number): string => `${customerInternalData.value[i]?.month}`

// Customer Chart Resell (Bar Chart)
const customerResellData = ref<{
    month: string;
    margin_high: number;
    margin_medium: number;
    margin_low: number;
    recurring: number;
}[]>([])

const customerResellChart = {
  margin_high: { name: 'Margin ≥15%', color: '#3b82f6' },
  margin_medium: { name: 'Margin 10-15%', color: '#22c55e' },
  margin_low: { name: 'Margin <10%', color: '#f97316' },
  recurring: { name: 'Recurring', color: '#8b5cf6' },
}

const xFormatterResell = (i: number): string => `${customerResellData.value[i]?.month}`

const yFormatter = (tick: number) => tick.toString()

// Month Card
const monthcard = ref<{ mounth: string; total: string }[]>([])

const fetchData = async () => {
    const employeeService = new EmployeeService()
    const employeeData = await employeeService.getEmployee(route.params.id as string)
    employee.value = employeeData.data
    
    const commissionService = new CommissionService()
    const data = await commissionService.salesCommission(route.params.id as string, { year: year.value })
    
    // Month Card
    monthcard.value = data.data.data.map((item) => ({
        mounth: item.month,
        total: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(item.total),
    }))
    
    // Commission Data Internal
    commissionInternalData.value = data.data.data.map((item) => {
        const detail = item.detail?.[0]
        const solo = detail?.internal?.find(d => d.name === 'Solo')
        const booster = detail?.internal?.find(d => d.name === 'Booster')
        const recurring = detail?.internal?.find(d => d.name === 'Recurring')
        return {
            date: item.month,
            solo: solo?.total ?? 0,
            booster: booster?.total ?? 0,
            recurring: recurring?.total ?? 0,
        }
    })
    
    // Commission Data Resell
    commissionResellData.value = data.data.data.map((item) => {
        const detail = item.detail?.[0]
        return {
            date: item.month,
            margin_high: detail?.resell?.[0]?.total ?? 0,
            margin_medium: detail?.resell?.[1]?.total ?? 0,
            margin_low: detail?.resell?.[2]?.total ?? 0,
            recurring: detail?.resell?.[3]?.total ?? 0,
        }
    })
    
    // Total Commission Data
    totalCommissionData.value = data.data.data.map((item) => ({
        date: item.month,
        total: item.total
    }))
    
    // Customer Data Internal
    customerInternalData.value = data.data.data.map((item) => {
        const detail = item.detail?.[0]
        const solo = detail?.internal?.find(d => d.name === 'Solo')
        const booster = detail?.internal?.find(d => d.name === 'Booster')
        const recurring = detail?.internal?.find(d => d.name === 'Recurring')
        return {
            month: item.month,
            solo: solo?.count ?? 0,
            booster: booster?.count ?? 0,
            recurring: recurring?.count ?? 0,
        }
    })
    
    // Customer Data Resell
    customerResellData.value = data.data.data.map((item) => {
        const detail = item.detail?.[0]
        return {
            month: item.month,
            margin_high: detail?.resell?.[0]?.count ?? 0,
            margin_medium: detail?.resell?.[1]?.count ?? 0,
            margin_low: detail?.resell?.[2]?.count ?? 0,
            recurring: detail?.resell?.[3]?.count ?? 0,
        }
    })
}

watch(year, () => {
    fetchData()
})

onMounted(() => {
    fetchData()
})

</script>