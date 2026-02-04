<template>
  <UModal
    :open="props.open"
    :title="`#${invoiceData?.invoiceNumber}`"
    :description="invoiceData?.customerCompany"
    @update:open="emit('update:open', $event)"
    :ui="{
      overlay: 'bg-white/45 dark:bg-black/45 backdrop-blur-xs'
    }"
  >
    <template #body>
      <div v-if="loading" class="flex justify-center py-8">
        <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-gray-500" />
      </div>
      
      <div v-else class="space-y-4">
          <UAlert
            color="warning"
            variant="subtle"
            description="Data changes may affect the commission of the Implementator and Sales Manager."
            icon="i-lucide-alert-triangle"
            size="xs"
            :ui="{
              icon: 'pt-8'
            }"
          />

        <UForm
            :schema="schema"
            :state="formData"
            class="space-y-3"
            @submit="onSubmit"
        >
            <UFormField name="isDeleted" label="Delete Data">
                <div class="flex items-center gap-2">
                    <USwitch v-model="formData.isDeleted" />
                    <span class="text-sm text-gray-500">Enable to soft delete/hide this invoice</span>
                </div>
            </UFormField>

            <template v-if="!formData.isDeleted">

                <div class="grid grid-cols-10 gap-2">
                  <UFormField name="paidDate" label="Paid Date" required class="col-span-7">
                      <UInput v-model="formData.paidDate" type="date" class="w-full" />
                  </UFormField>
                  <UFormField name="monthPeriod" label="Month Period" required class="col-span-3">
                      <UInput v-model="formData.monthPeriod" type="number" class="w-full" />
                  </UFormField>
                </div>

                <div class="grid grid-cols-10 gap-2">
                    <UFormField name="percentage" label="Percentage (%)" required class="col-span-3">
                        <USelect 
                            v-model.number="formData.percentage" 
                            :items="percentageOptions" 
                            class="w-full" 
                        />
                    </UFormField>
                    <UFormField name="commission" label="Commission" required class="col-span-7">
                        <UInput v-model.number="formData.commission" type="number" class="w-full" >
                            <template #leading>
                                <span class="text-gray-500 text-sm">Rp.</span>
                            </template>
                        </UInput>
                    </UFormField>
                </div>

            </template>

            <UFormField label="Note" name="note" required>
                <UTextarea
                    v-model="formData.note"
                    class="w-full"
                    placeholder="Reason..."
                    :rows="3"
                />
            </UFormField>

            <div class="flex justify-end gap-2">
            <UButton
                label="Cancel"
                color="neutral"
                variant="subtle"
                :disabled="saving"
                @click="emit('update:open', false)"
            />
            <UButton
                label="Save"
                color="primary"
                variant="solid"
                type="submit"
                :loading="saving"
            />
            </div>
        </UForm>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { InvoiceService } from '~/services/invoice-service'
import { useRoute } from 'vue-router'
import type { InvoiceSalesData } from '~/types/sales'
import { AdjustmentService } from '~/services/adjustment-service'

const props = defineProps<{
  ai: number
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'updated'): void
  (e: 'update:open', value: boolean): void
}>()

const route = useRoute()
const employeeId = route.params.id as string

const schema = z.object({
  isDeleted: z.boolean(),
  paidDate: z.string().optional(),
  monthPeriod: z.number().optional(),
  percentage: z.number().optional(),
  commission: z.number().optional(),
  note: z.string().min(1, 'Note is required')
}).superRefine((data, ctx) => {
  if (!data.isDeleted) {
    if (!data.paidDate) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Paid Date is required", path: ["paidDate"] })
    if (!data.monthPeriod) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Month Period is required", path: ["monthPeriod"] })
    if (data.percentage === undefined || data.percentage === null) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Percentage is required", path: ["percentage"] })
    if (data.commission === undefined || data.commission === null) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Commission is required", path: ["commission"] })
  }
})

type Schema = z.output<typeof schema>

const formData = reactive({
  isDeleted: false,
  paidDate: undefined as string | undefined,
  monthPeriod: undefined as number | undefined,
  percentage: 0 as number | undefined,
  commission: 0 as number | undefined,
  note: '',
})

const saving = ref(false)
const loading = ref(false)
const isInitializing = ref(false)
const invoiceData = ref<InvoiceSalesData | null>(null)

async function loadInvoiceData() {
  if (!props.ai) return

  loading.value = true
  const invoiceService = new InvoiceService()
  const response = await invoiceService.getInvoiceById(employeeId, String(props.ai))
  if (response?.data) {
     invoiceData.value = response.data
     const data = response.data as any
     
     let formattedDate = undefined
     if (data.paidDate) {
        const date = new Date(data.paidDate)
        if (!isNaN(date.getTime())) {
            formattedDate = date.toISOString().split('T')[0]
        }
     }

     isInitializing.value = true
     Object.assign(formData, {
      isDeleted: !!data.isDeleted,
      monthPeriod: data.monthPeriod,
      paidDate: formattedDate,
      percentage: Math.round(data.salesCommissionPercentage ?? 0),
      commission: Math.round(data.salesCommission ?? 0),
      note: data.adjustmentNote || '',
    })
    nextTick(() => {
      isInitializing.value = false
    })
  }
  loading.value = false
}

watch(() => formData.percentage, (newVal) => {
  if (isInitializing.value) return
  if (!formData.isDeleted && newVal !== undefined && invoiceData.value?.dpp) {
      formData.commission = Math.round((invoiceData.value.dpp * newVal) / 100)
  }
})

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen && props.ai) {
      await loadInvoiceData()
    } else {
      resetForm()
      invoiceData.value = null
    }
  },
  { immediate: true }
)

function resetForm() {
  Object.assign(formData, {
    isDeleted: false,
    paidDate: undefined,
    percentage: 0,
    commission: 0,
    note: '',
  })
}

const percentageOptions = computed(() => {
  const defaults = [12, 15, 1, 5, 4, 2.5, 0.4]

  if (!invoiceData.value) return defaults
  const type = String((invoiceData.value as any).type || '').toLowerCase().trim()
  
  if (type.includes('resell')) return [5, 4, 2.5, 0.4]
  if (type.includes('internal')) return [12, 15, 1]
  
  return defaults
})

async function onSubmit(_event: FormSubmitEvent<Schema>) {
  if (!props.ai || !invoiceData.value) return

  saving.value = true
  const adjustmentService = new AdjustmentService()

  const oldValue = {
      paidDate: invoiceData.value.paidDate ? new Date(invoiceData.value.paidDate).toISOString().split('T')[0] : null,
      monthPeriod: invoiceData.value.monthPeriod,
      salesCommissionPercentage: Math.round(invoiceData.value.salesCommissionPercentage ?? 0),
      salesCommission: Math.round(invoiceData.value.salesCommission ?? 0),
  }

  const newValue = {
          paidDate: formData.paidDate,
          monthPeriod: formData.monthPeriod,
          salesCommissionPercentage: formData.percentage,
          salesCommission: formData.commission,
  }
  
  let action: 'update' | 'delete' = 'update'

  if (formData.isDeleted) {
      action = 'delete'
  } else {
      action = 'update'
  }

  await adjustmentService.createAdjustment({
      ai: props.ai,
      oldValue: oldValue as any,
      newValue: newValue,
      note: formData.note,
      action: action
  })
  
  emit('updated')
  emit('update:open', false)
  resetForm()
  saving.value = false
}
</script>