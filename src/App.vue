<script setup>
import { onMounted, ref } from 'vue';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import {
  ChevronUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from '@heroicons/vue/20/solid';
import ApiStatusSkeletonLoader from '@/components/ApiStatusSkeletonLoader.vue';

const isGlobalApiLoading = ref(true);
const isLocalApiLoading = ref(true);
const apiServiceStatuses = ref([]);

async function checkLocalApiStatus(url) {
  isLocalApiLoading.value = true;

  try {
    const { ok, statusText } = await fetch(url);
    return { ok, message: statusText };
  } catch ({ message, stack, cause }) {
    return { ok: false, message };
  } finally {
    isLocalApiLoading.value = false;
  }
}

async function getApiStatus() {
  isGlobalApiLoading.value = true;
  apiServiceStatuses.value = [];

  try {
    const response = await fetch('/.netlify/functions/api-status');
    const data = await response.json();

    apiServiceStatuses.value = await Promise.all(
      data.map(async (item) => {
        const localStatus = await checkLocalApiStatus(item.url);
        return { localStatus, ...item };
      }),
    );
  } finally {
    isGlobalApiLoading.value = false;
  }
}

function displayStatusMessage({ localStatus }) {
  return localStatus.message === 'Failed to fetch'
    ? 'Probability CORS error. Check your console browser for detail, please.'
    : localStatus.message;
}

async function refreshLocalApiStatus(url) {
  const currentApiStatus = apiServiceStatuses.value.find((item) => item.url === url);
  currentApiStatus.localStatus = await checkLocalApiStatus(url);
}

function refreshGlobalApiStatus() {
  getApiStatus();
}

onMounted(() => {
  getApiStatus();
});
</script>

<template>
  <header>
    <div class="bg-[#2D3E50] shadow-md">
      <div class="container py-8">
        <div>
          <a href="/">
            <img
              class="inline"
              src="/images/dicoding.png"
              alt="Dicoding Academy Logo"
              width="150"
            />
          </a>
        </div>
        <div class="mt-3 text-white text-xl">Status Layanan-Layanan Dicoding Academy API</div>
      </div>
    </div>
  </header>

  <main>
    <div class="container">
      <div class="max-w-5xl mx-auto py-8">
        <div class="flex justify-end mb-4">
          <button
            @click="refreshGlobalApiStatus"
            class="py-2 px-4 rounded bg-[#2D3E50] hover:bg-blue-950 text-white focus-visible:outline-0 focus-visible:ring-4 focus-visible:ring-blue-500/75"
            :disabled="isGlobalApiLoading"
            title="Click to refresh server status"
          >
            <ArrowPathIcon class="inline h-5 w-5"></ArrowPathIcon>
            Netlify Network
          </button>
        </div>

        <div v-if="isGlobalApiLoading" class="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-2">
          <template v-for="n in 10">
            <ApiStatusSkeletonLoader class="shadow"></ApiStatusSkeletonLoader>
          </template>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-2">
          <Disclosure
            v-for="apiServiceStatus in apiServiceStatuses"
            :key="apiServiceStatus.name"
            class="text"
            as="article"
            v-slot="{ open }"
          >
            <DisclosureButton
              class="w-full flex justify-between items-center px-4 py-2 text-left border border-black"
            >
              <div>
                <div>{{ apiServiceStatus.name }}</div>
                <div class="text-sm text-slate-500">
                  <a class="hover:underline" :href="apiServiceStatus.url" target="_blank">
                    {{ apiServiceStatus.url }}
                  </a>
                </div>
              </div>
              <div class="flex items-center gap-1">
                <CheckCircleIcon
                  v-if="apiServiceStatus.localStatus.ok && apiServiceStatus.localStatus.ok"
                  class="inline h-6 w-6 text-green-500"
                />
                <ExclamationTriangleIcon
                  v-else-if="apiServiceStatus.ok || apiServiceStatus.localStatus.ok"
                  class="inline h-6 w-6 text-orange-500"
                ></ExclamationTriangleIcon>
                <XCircleIcon v-else class="inline h-6 w-6 text-red-500" />

                <ChevronUpIcon :class="open ? 'rotate-180 transform' : ''" class="h-5 w-5" />
              </div>
            </DisclosureButton>
            <DisclosurePanel>
              <ul>
                <li class="px-4 py-2 border-b border-x border-black">
                  <span>Netlify Network: </span>
                  <CheckCircleIcon
                    v-if="apiServiceStatus.ok"
                    class="inline h-6 w-6 text-green-500"
                  />
                  <XCircleIcon v-else class="inline h-6 w-6 text-red-500" />
                </li>
                <li class="px-4 py-2 border-b border-x border-black">
                  <div class="flex justify-between">
                    <div>
                      Your Network:
                      <template v-if="isLocalApiLoading">
                        <span class="text-sm text-slate-500 select-none">Loading...</span>
                      </template>
                      <template v-else>
                        <span
                          v-if="apiServiceStatus.localStatus.ok"
                          :title="displayStatusMessage(apiServiceStatus)"
                        >
                          <CheckCircleIcon class="inline h-6 w-6 text-green-500" />
                        </span>
                        <span v-else :title="displayStatusMessage(apiServiceStatus)">
                          <XCircleIcon class="inline h-6 w-6 text-red-500" />
                        </span>
                      </template>
                    </div>
                    <div>
                      <button
                        @click="refreshLocalApiStatus(apiServiceStatus.url)"
                        class="px-2 rounded"
                        title="Click to refresh local status"
                      >
                        <ArrowPathIcon class="inline h-5 w-5"></ArrowPathIcon>
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
            </DisclosurePanel>
          </Disclosure>
        </div>
      </div>

      <div class="py-4">
        <hr class="my-6" />

        <div class="flex justify-around">
          <div class="flex items-center gap-1">
            <CheckCircleIcon class="inline h-6 w-6 text-green-500" />
            Aktif
          </div>
          <div class="flex items-center gap-1">
            <ExclamationTriangleIcon
              class="inline h-6 w-6 text-orange-500"
            ></ExclamationTriangleIcon>
            Ada masalah
          </div>
          <div class="flex items-center gap-1">
            <XCircleIcon class="inline h-6 w-6 text-red-500" />
            Tidak aktif
          </div>
        </div>
      </div>
    </div>
  </main>

  <footer>
    <div class="container py-4">
      <hr class="my-6" />
      <div
        class="text-slate-500 flex justify-between items-center flex-col sm:flex-row gap-y-2 gap-x-4"
      >
        <div>&copy; 2024 Dicoding | PT Presentologics.</div>
        <div>
          <a href="https://www.dicoding.com/">dicoding.com</a>
        </div>
      </div>
    </div>
  </footer>
</template>
