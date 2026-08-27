<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <button @click="router.back()" class="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div>
        <h2 class="text-xl font-bold text-slate-800">{{ isEdit ? 'แก้ไขรายการ' : 'บันทึกค่าใช้จ่ายใหม่' }}</h2>
        <p class="text-sm text-slate-500">{{ isEdit ? 'แก้ไขข้อมูลรายการค่าสาธารณูปโภค' : 'เพิ่มรายการค่าสาธารณูปโภคใหม่เข้าระบบ' }}</p>
      </div>
    </div>

    <!-- Form Card -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <!-- Success Alert -->
      <div v-if="successMsg" class="mb-5 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ successMsg }}
      </div>

      <!-- Error Alert -->
      <div v-if="errorMsg" class="mb-5 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ errorMsg }}
      </div>

      <form @submit.prevent="handleSubmit" enctype="multipart/form-data" class="space-y-5">
        <!-- Row 1: Category + Budget -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">ประเภทค่าใช้จ่าย <span class="text-red-500">*</span></label>
            <select v-model="form.expense_category_id" required class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50">
              <option value="" disabled>-- เลือกประเภท --</option>
              <option v-for="c in activeExpenseCategories" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">หมวดเงินงบประมาณ <span class="text-red-500">*</span></label>
            <select v-model="form.budget_category_id" required class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50">
              <option value="" disabled>-- เลือกหมวดเงิน --</option>
              <option v-for="b in activeBudgetCategories" :key="b.id" :value="b.id">{{ b.name }}</option>
            </select>
          </div>
        </div>

        <!-- Row 2: Amount + Billing Month -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">จำนวนเงิน (บาท) <span class="text-red-500">*</span></label>
            <input
              v-model="form.amount"
              type="number"
              min="0.01"
              step="0.01"
              required
              placeholder="0.00"
              class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">เดือน/ปีของบิล <span class="text-red-500">*</span></label>
            <input
              v-model="form.billing_month"
              type="month"
              required
              class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
            />
          </div>
        </div>

        <!-- Row 3: Paid Date + Invoice No -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">วันที่ชำระจริง <span class="text-red-500">*</span></label>
            <input
              v-model="form.paid_date"
              type="date"
              required
              class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">เลขที่ใบแจ้งหนี้</label>
            <input
              v-model="form.invoice_no"
              type="text"
              placeholder="INV-XXXX"
              class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
            />
          </div>
        </div>

        <!-- Note -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">หมายเหตุ</label>
          <textarea
            v-model="form.note"
            rows="3"
            placeholder="บันทึกเพิ่มเติม..."
            class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 resize-none"
          ></textarea>
        </div>

        <!-- Attachment -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">แนบไฟล์ใบเสร็จ (optional)</label>
          <div
            class="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-emerald-400 transition-colors relative"
            @click="$refs.fileInput.click()"
          >
            <input ref="fileInput" type="file" class="hidden" accept="image/*,.pdf" @change="onFileChange" />
            <div v-if="!selectedFile && !currentAttachment">
              <svg class="w-8 h-8 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <p class="text-sm text-slate-500">คลิกเพื่อเลือกไฟล์ภาพหรือ PDF</p>
            </div>
            <div v-else class="text-sm text-emerald-600 font-medium">
              {{ selectedFile ? selectedFile.name : '📎 มีไฟล์แนบอยู่แล้ว' }}
              <span v-if="currentAttachment && !selectedFile" class="ml-2 text-slate-400 text-xs">({{ currentAttachment }})</span>
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex flex-col-reverse sm:flex-row gap-3 pt-2">
          <button
            type="button"
            @click="router.back()"
            class="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-sm"
          >
            ยกเลิก
          </button>
          <button
            id="expense-form-submit"
            type="submit"
            :disabled="submitting"
            class="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-300 text-white font-semibold py-2.5 rounded-xl transition-all text-sm shadow-sm"
          >
            {{ submitting ? 'กำลังบันทึก...' : (isEdit ? 'บันทึกการแก้ไข' : 'บันทึกรายการ') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useExpenseStore } from '../stores/expense';
import { useCategoryStore } from '../stores/category';

const router = useRouter();
const route = useRoute();
const expenseStore = useExpenseStore();
const categoryStore = useCategoryStore();

const isEdit = computed(() => !!route.params.id);
const submitting = ref(false);
const errorMsg = ref('');
const successMsg = ref('');
const selectedFile = ref(null);
const currentAttachment = ref('');
const fileInput = ref(null);

const form = reactive({
  expense_category_id: '',
  budget_category_id: '',
  amount: '',
  billing_month: new Date().toISOString().slice(0, 7),
  paid_date: new Date().toISOString().slice(0, 10),
  invoice_no: '',
  note: ''
});

const activeExpenseCategories = computed(() => categoryStore.expenseCategories.filter(c => c.is_active));
const activeBudgetCategories = computed(() => categoryStore.budgetCategories.filter(b => b.is_active));

const onFileChange = (e) => { selectedFile.value = e.target.files[0] || null; };

const handleSubmit = async () => {
  submitting.value = true;
  errorMsg.value = '';
  successMsg.value = '';

  const fd = new FormData();
  Object.entries(form).forEach(([k, v]) => { if (v !== '' && v != null) fd.append(k, v); });
  if (selectedFile.value) fd.append('attachment', selectedFile.value);

  try {
    if (isEdit.value) {
      await expenseStore.updateExpense(route.params.id, fd);
      successMsg.value = 'แก้ไขรายการสำเร็จ';
    } else {
      await expenseStore.createExpense(fd);
      successMsg.value = 'บันทึกรายการสำเร็จ';
    }
    setTimeout(() => router.push('/expenses'), 1200);
  } catch (e) {
    errorMsg.value = typeof e === 'string' ? e : (e?.response?.data?.message || 'เกิดข้อผิดพลาด');
  } finally {
    submitting.value = false;
  }
};

onMounted(async () => {
  await Promise.all([
    categoryStore.fetchExpenseCategories(),
    categoryStore.fetchBudgetCategories()
  ]);

  if (isEdit.value) {
    const data = await expenseStore.fetchExpenseById(route.params.id);
    if (data) {
      form.expense_category_id = data.expense_category_id;
      form.budget_category_id = data.budget_category_id;
      form.amount = data.amount;
      form.billing_month = data.billing_month?.slice(0, 7);
      form.paid_date = data.paid_date?.slice(0, 10);
      form.invoice_no = data.invoice_no || '';
      form.note = data.note || '';
      currentAttachment.value = data.attachment_path || '';
    }
  }
});
</script>
