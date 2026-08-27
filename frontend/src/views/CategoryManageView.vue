<template>
  <div class="space-y-6">
    <!-- Tabs -->
    <div class="flex gap-2">
      <button
        @click="activeTab = 'expense'"
        :class="activeTab === 'expense'
          ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20'
          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'"
        class="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
      >
        ⚡ ประเภทค่าใช้จ่าย
      </button>
      <button
        @click="activeTab = 'budget'"
        :class="activeTab === 'budget'
          ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20'
          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'"
        class="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
      >
        💰 หมวดเงินงบประมาณ
      </button>
    </div>

    <!-- Header + Add Button -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold text-slate-800">
          {{ activeTab === 'expense' ? 'จัดการประเภทค่าใช้จ่าย' : 'จัดการหมวดเงินงบประมาณ' }}
        </h2>
        <p class="text-sm text-slate-500 mt-0.5">
          {{ activeTab === 'expense' ? `${expenseCategories.length} รายการ` : `${budgetCategories.length} รายการ` }}
        </p>
      </div>
      <button
        @click="openModal(null)"
        class="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-4 py-2 rounded-xl transition-all text-sm shadow-sm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        เพิ่มรายการ
      </button>
    </div>

    <!-- Loading -->
    <div v-if="categoryStore.loading" class="flex justify-center py-12">
      <svg class="w-8 h-8 animate-spin text-emerald-500" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <table class="min-w-full divide-y divide-slate-100">
        <thead>
          <tr class="bg-slate-50">
            <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">ชื่อ</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">รหัส</th>
            <th v-if="activeTab === 'expense'" class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">หน่วย</th>
            <th class="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">สถานะ</th>
            <th class="px-5 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">จัดการ</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="item in currentList" :key="item.id" class="hover:bg-slate-50 transition-colors">
            <td class="px-5 py-3.5 text-sm font-medium text-slate-800">{{ item.name }}</td>
            <td class="px-5 py-3.5">
              <span class="bg-slate-100 text-slate-600 text-xs font-mono font-medium px-2 py-0.5 rounded">{{ item.code }}</span>
            </td>
            <td v-if="activeTab === 'expense'" class="px-5 py-3.5 text-xs text-slate-500">{{ item.unit || '-' }}</td>
            <td class="px-5 py-3.5">
              <span
                :class="item.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'"
                class="text-xs font-medium px-2.5 py-1 rounded-full"
              >{{ item.is_active ? 'ใช้งาน' : 'ปิดใช้งาน' }}</span>
            </td>
            <td class="px-5 py-3.5 text-center">
              <div class="flex items-center justify-center gap-2">
                <button @click="openModal(item)" class="text-blue-500 hover:text-blue-700 p-1 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button @click="confirmDelete(item)" class="text-red-400 hover:text-red-600 p-1 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!currentList.length">
            <td :colspan="activeTab === 'expense' ? 5 : 4" class="px-5 py-10 text-center text-slate-400 text-sm">ยังไม่มีข้อมูล</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <h3 class="text-lg font-bold text-slate-800 mb-5">
          {{ editTarget ? 'แก้ไขรายการ' : 'เพิ่มรายการใหม่' }}
        </h3>

        <div v-if="modalError" class="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-lg">{{ modalError }}</div>

        <form @submit.prevent="handleSave" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">ชื่อ <span class="text-red-500">*</span></label>
            <input v-model="modalForm.name" type="text" required class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="เช่น ค่าไฟฟ้า" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">รหัส (Code) <span class="text-red-500">*</span></label>
            <input v-model="modalForm.code" type="text" required class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="เช่น ELEC" />
          </div>
          <div v-if="activeTab === 'expense'">
            <label class="block text-sm font-medium text-slate-700 mb-1">หน่วย</label>
            <input v-model="modalForm.unit" type="text" class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="เช่น บาท" />
          </div>
          <div class="flex items-center gap-3">
            <label class="text-sm font-medium text-slate-700">สถานะใช้งาน</label>
            <button
              type="button"
              @click="modalForm.is_active = !modalForm.is_active"
              :class="modalForm.is_active ? 'bg-emerald-500' : 'bg-slate-200'"
              class="relative w-11 h-6 rounded-full transition-colors duration-200"
            >
              <span
                :class="modalForm.is_active ? 'translate-x-5' : 'translate-x-1'"
                class="inline-block w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
              ></span>
            </button>
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" @click="showModal = false" class="flex-1 border border-slate-200 text-slate-600 font-semibold py-2 rounded-xl hover:bg-slate-50 text-sm">ยกเลิก</button>
            <button type="submit" :disabled="modalSaving" class="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-2 rounded-xl transition-colors text-sm disabled:opacity-60">
              {{ modalSaving ? 'กำลังบันทึก...' : 'บันทึก' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <div v-if="deleteTarget" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
        <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="text-lg font-bold text-slate-800 mb-2">ยืนยันการลบ</h3>
        <p class="text-slate-500 text-sm mb-6">ต้องการลบ <strong>{{ deleteTarget.name }}</strong> ใช่หรือไม่?</p>
        <div class="flex gap-3">
          <button @click="deleteTarget = null" class="flex-1 border border-slate-200 text-slate-600 font-semibold py-2 rounded-xl hover:bg-slate-50 text-sm">ยกเลิก</button>
          <button @click="handleDelete" :disabled="deleting" class="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-xl text-sm disabled:opacity-60">
            {{ deleting ? 'กำลังลบ...' : 'ลบ' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCategoryStore } from '../stores/category';

const route = useRoute();
const categoryStore = useCategoryStore();

// Detect tab from route path
const activeTab = ref(route.path.includes('budget') ? 'budget' : 'expense');
watch(() => route.path, (p) => { activeTab.value = p.includes('budget') ? 'budget' : 'expense'; });

const expenseCategories = computed(() => categoryStore.expenseCategories);
const budgetCategories = computed(() => categoryStore.budgetCategories);
const currentList = computed(() => activeTab.value === 'expense' ? expenseCategories.value : budgetCategories.value);

const showModal = ref(false);
const editTarget = ref(null);
const deleteTarget = ref(null);
const deleting = ref(false);
const modalSaving = ref(false);
const modalError = ref('');

const modalForm = reactive({ name: '', code: '', unit: '', is_active: true });

const openModal = (item) => {
  editTarget.value = item;
  if (item) {
    modalForm.name = item.name;
    modalForm.code = item.code;
    modalForm.unit = item.unit || '';
    modalForm.is_active = item.is_active;
  } else {
    modalForm.name = '';
    modalForm.code = '';
    modalForm.unit = '';
    modalForm.is_active = true;
  }
  modalError.value = '';
  showModal.value = true;
};

const handleSave = async () => {
  modalSaving.value = true;
  modalError.value = '';
  const payload = { name: modalForm.name, code: modalForm.code, is_active: modalForm.is_active };
  if (activeTab.value === 'expense') payload.unit = modalForm.unit;
  try {
    if (editTarget.value) {
      if (activeTab.value === 'expense') await categoryStore.updateExpenseCategory(editTarget.value.id, payload);
      else await categoryStore.updateBudgetCategory(editTarget.value.id, payload);
    } else {
      if (activeTab.value === 'expense') await categoryStore.createExpenseCategory(payload);
      else await categoryStore.createBudgetCategory(payload);
    }
    showModal.value = false;
  } catch (e) {
    modalError.value = typeof e === 'string' ? e : 'เกิดข้อผิดพลาด';
  } finally {
    modalSaving.value = false;
  }
};

const confirmDelete = (item) => { deleteTarget.value = item; };

const handleDelete = async () => {
  if (!deleteTarget.value) return;
  deleting.value = true;
  try {
    if (activeTab.value === 'expense') await categoryStore.deleteExpenseCategory(deleteTarget.value.id);
    else await categoryStore.deleteBudgetCategory(deleteTarget.value.id);
    deleteTarget.value = null;
  } catch (e) {
    alert('ไม่สามารถลบได้ อาจมีรายการค่าใช้จ่ายที่อ้างอิงถึงรายการนี้อยู่');
    deleteTarget.value = null;
  } finally {
    deleting.value = false;
  }
};

onMounted(async () => {
  await Promise.all([
    categoryStore.fetchExpenseCategories(),
    categoryStore.fetchBudgetCategories()
  ]);
});
</script>
