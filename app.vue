<template>
  <div class="min-h-screen bg-surface font-body text-on-surface">

    <!-- Top App Bar -->
    <header class="bg-surface-container-lowest/80 backdrop-blur-xl sticky top-0 z-50">
      <div class="flex justify-between items-center h-16 px-6 w-full max-w-[1920px] mx-auto">
        <div class="flex items-center gap-8">
          <div class="flex items-center gap-2">
            <span class="text-xl font-light tracking-tight text-on-surface">JSON Atelier</span>
          </div>
          <nav class="hidden md:flex items-center gap-6">
            <a href="#" class="text-primary font-semibold border-b-2 border-primary h-16 flex items-center text-sm">
              Editor
            </a>
            <a href="#" class="text-on-surface-variant hover:text-on-surface transition-colors duration-200 text-sm">
              Documentation
            </a>
            <a href="#" class="text-on-surface-variant hover:text-on-surface transition-colors duration-200 text-sm">
              API Docs
            </a>
          </nav>
        </div>
        <div class="flex items-center gap-4">
          <button
            class="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold text-on-primary"
            style="background: linear-gradient(135deg, #004ac6, #2563eb)"
            @click="exportContent"
          >
            <font-awesome-icon :icon="['fas', 'download']" class="text-[15px]" />
            Export
          </button>
          <button class="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors duration-200">
            <font-awesome-icon :icon="['fas', 'gear']" />
          </button>
        </div>
      </div>
      <!-- Divider via tonal shift, no border -->
      <div class="h-px bg-surface-container-high opacity-60"></div>
    </header>

    <!-- Sidebar -->
    <aside class="hidden lg:flex flex-col p-4 gap-2 bg-surface-container-low h-screen w-64 fixed left-0 top-0 pt-16 text-sm font-medium z-40">
      <div class="px-2 py-4">
        <p class="text-[11px] uppercase tracking-widest text-outline mb-4">Project Workspace</p>
        <div class="space-y-1">
          <button class="w-full flex items-center gap-3 px-3 py-2 bg-primary-fixed text-on-primary-fixed rounded-lg transition-all duration-200 hover:translate-x-1">
            <font-awesome-icon :icon="['fas', 'link']" class="text-primary" />
            Input URL
          </button>
          <button
            class="w-full flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container transition-all duration-200 rounded-lg hover:translate-x-1"
            @click="setView('html')"
          >
            <font-awesome-icon :icon="['fas', 'code']" />
            HTML View
          </button>
          <button
            class="w-full flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container transition-all duration-200 rounded-lg hover:translate-x-1"
            @click="setView('markdown')"
          >
            <font-awesome-icon :icon="['fas', 'file-alt']" />
            Markdown View
          </button>
          <button class="w-full flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container transition-all duration-200 rounded-lg hover:translate-x-1">
            <font-awesome-icon :icon="['fas', 'clock-rotate-left']" />
            History
          </button>
        </div>
      </div>
      <div class="mt-auto px-2 pb-20 space-y-1">
        <button
          class="w-full py-2.5 rounded-xl font-semibold text-sm mb-4 bg-secondary-container text-on-secondary-container"
          @click="clearAll"
        >
          New Transformation
        </button>
        <button class="w-full flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-all">
          <font-awesome-icon :icon="['fas', 'circle-question']" />
          Help
        </button>
        <button class="w-full flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-all">
          <font-awesome-icon :icon="['fas', 'chart-bar']" />
          Status
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="lg:pl-64 pt-4 min-h-[calc(100vh-64px)] bg-surface">
      <div class="max-w-[1600px] mx-auto p-6 space-y-6">

        <!-- Asymmetric Header Section -->
        <section class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 class="text-4xl font-light tracking-tight text-on-surface mb-2">Workspace</h1>
            <p class="text-on-surface-variant max-w-md text-sm">
              Refine and transform your data structure with editorial-grade atelier tools.
            </p>
          </div>
          <!-- URL Fetch Input -->
          <div class="w-full md:w-[480px] flex gap-2 p-1.5 bg-surface-container-low rounded-xl ring-1 ring-outline-variant/20">
            <div class="relative flex-grow flex items-center pl-3 gap-2">
              <font-awesome-icon :icon="['fas', 'link']" class="text-outline text-sm" />
              <input
                v-model="state.apiUrl"
                class="w-full bg-transparent border-none focus:ring-0 text-sm py-2 text-on-surface placeholder:text-outline"
                type="text"
                placeholder="Fetch JSON from URL"
              />
            </div>
            <button
              class="px-5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap text-on-primary transition-opacity hover:opacity-80"
              style="background: linear-gradient(135deg, #004ac6, #2563eb)"
              @click="fetchData"
            >
              Fetch Data
            </button>
          </div>
        </section>

        <!-- Split Pane Editor -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 h-[700px]">

          <!-- Left: Dark JSON Editor -->
          <div class="flex flex-col bg-inverse-surface rounded-xl overflow-hidden shadow-2xl">
            <div class="flex items-center justify-between px-6 py-4 bg-white/5">
              <div class="flex items-center gap-3">
                <font-awesome-icon :icon="['fas', 'code']" class="text-inverse-primary" />
                <span class="text-sm font-semibold text-white tracking-wide">JSON Editor</span>
              </div>
              <div class="flex gap-2">
                <div class="w-3 h-3 rounded-full bg-error/40"></div>
                <div class="w-3 h-3 rounded-full bg-secondary/40"></div>
                <div class="w-3 h-3 rounded-full bg-primary/40"></div>
              </div>
            </div>
            <textarea
              v-model="state.jsonData"
              class="flex-grow bg-transparent text-white/90 p-6 font-mono text-sm focus:outline-none resize-none placeholder:text-white/30 hide-scrollbar"
              placeholder="Paste or edit JSON data here..."
            ></textarea>
          </div>

          <!-- Right: Light Preview -->
          <div class="flex flex-col bg-surface-container-lowest rounded-xl overflow-hidden shadow-lg">
            <div class="flex items-center justify-between px-6 py-3 bg-surface-container-low">
              <div class="flex items-center gap-3">
                <font-awesome-icon :icon="['fas', 'eye']" class="text-primary" />
                <span class="text-sm font-semibold text-on-surface tracking-wide">Preview</span>
              </div>
              <!-- Toggle + Convert -->
              <div class="flex items-center gap-3">
                <div class="flex bg-surface-container-high p-1 rounded-full">
                  <button
                    :class="[
                      'px-4 py-1.5 rounded-full text-xs font-bold transition-all',
                      state.showHTML
                        ? 'bg-surface-container-lowest text-primary shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    ]"
                    @click="convertToHtml"
                  >
                    HTML View
                  </button>
                  <button
                    :class="[
                      'px-4 py-1.5 rounded-full text-xs font-medium transition-all',
                      !state.showHTML
                        ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                        : 'text-on-surface-variant hover:text-on-surface'
                    ]"
                    @click="convertToMarkdown"
                  >
                    Markdown
                  </button>
                </div>
              </div>
            </div>
            <!-- Status message inside preview pane -->
            <div
              v-if="state.statusMessage"
              :class="[
                'mx-6 mt-4 px-4 py-2.5 rounded-lg text-xs font-medium',
                state.statusMessage.includes('successfully')
                  ? 'bg-primary-fixed text-on-primary-fixed'
                  : 'bg-error-container text-on-error-container',
              ]"
            >
              {{ state.statusMessage }}
            </div>
            <div class="flex-grow p-8 overflow-y-auto hide-scrollbar">
              <VueMarkdown
                v-if="!state.showHTML"
                class="prose max-w-none text-sm text-on-surface"
                :source="state.markdownContent"
              />
              <div
                v-else
                class="prose max-w-none text-sm text-on-surface"
                v-html="state.renderedContent"
              ></div>
            </div>
          </div>
        </div>

        <!-- Bento Status Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-6 bg-surface-container-low rounded-xl flex items-start gap-4">
            <div class="w-12 h-12 rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-center text-primary">
              <font-awesome-icon :icon="['fas', 'circle-check']" class="text-lg" />
            </div>
            <div>
              <p class="text-sm font-bold text-on-surface">
                {{ isValidJson ? 'JSON Valid' : 'JSON Invalid' }}
              </p>
              <p class="text-xs text-on-surface-variant">
                {{ isValidJson ? 'Structure is well-formed' : 'Check syntax errors' }}
              </p>
            </div>
          </div>
          <div class="p-6 bg-surface-container-low rounded-xl flex items-start gap-4">
            <div class="w-12 h-12 rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-center text-secondary">
              <font-awesome-icon :icon="['fas', 'bolt']" class="text-lg" />
            </div>
            <div>
              <p class="text-sm font-bold text-on-surface">
                {{ state.showHTML ? 'HTML Mode' : 'Markdown Mode' }}
              </p>
              <p class="text-xs text-on-surface-variant">Real-time transformation</p>
            </div>
          </div>
          <div
            class="p-6 rounded-xl flex items-start gap-4"
            style="background: linear-gradient(135deg, #004ac6, #2563eb)"
          >
            <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" class="text-white text-lg" />
            </div>
            <div>
              <p class="text-sm font-bold text-white">Auto-Transform</p>
              <p class="text-xs text-white/70">Detecting structure on edit</p>
            </div>
          </div>
        </div>

      </div>
    </main>

    <!-- Footer -->
    <footer class="lg:pl-64 w-full bg-surface-container-low/50 backdrop-blur-md">
      <div class="max-w-[1920px] mx-auto px-6 py-3 flex items-center justify-between text-[11px] font-medium text-on-surface-variant uppercase tracking-widest">
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-green-500"></span>
            <span>System Operational</span>
          </div>
          <div class="flex items-center gap-2">
            <font-awesome-icon :icon="['fas', 'microchip']" class="text-[11px]" />
            <span>V1.0.4 — Production</span>
          </div>
        </div>
        <div class="flex items-center gap-6">
          <a href="#" class="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" class="hover:text-primary transition-colors">Terms of Service</a>
          <span>© 2024 Atelier Labs</span>
        </div>
      </div>
    </footer>

    <!-- State Toast -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div v-if="state.showToast" class="fixed bottom-8 right-8 z-50">
        <div class="bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/20 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
            <font-awesome-icon :icon="['fas', 'check-double']" class="text-sm" />
          </div>
          <div>
            <p class="text-xs font-bold text-on-surface">{{ state.toastMessage }}</p>
            <p class="text-[10px] text-on-surface-variant leading-none">Ready for export</p>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue';
  import MarkdownIt from 'markdown-it';
  import DOMPurify from 'dompurify';
  import VueMarkdown from 'vue-markdown-render';

  const md = new MarkdownIt();

  const state = ref({
    apiUrl: 'https://reqres.in/api/users?page=2',
    jsonData: '',
    statusMessage: '',
    showHTML: true,
    markdownContent: '',
    renderedContent: '',
    showToast: false,
    toastMessage: '',
  });

  const isValidJson = computed(() => {
    try {
      JSON.parse(state.value.jsonData);
      return true;
    } catch {
      return false;
    }
  });

  const isImageUrl = (url) => /\.(jpeg|jpg|gif|png|svg|webp)$/.test(url);
  const sanitizeHtml = (html) => DOMPurify.sanitize(html);

  let toastTimer = null;
  const showToast = (message) => {
    state.value.toastMessage = message;
    state.value.showToast = true;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { state.value.showToast = false; }, 3000);
  };

  const setView = (view) => {
    if (view === 'html') convertToHtml();
    else convertToMarkdown();
  };

  const clearAll = () => {
    state.value.jsonData = '';
    state.value.renderedContent = '';
    state.value.markdownContent = '';
    state.value.statusMessage = '';
  };

  const exportContent = () => {
    const content = state.value.showHTML
      ? state.value.renderedContent
      : state.value.markdownContent;
    if (!content) return;
    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = state.value.showHTML ? 'output.html' : 'output.md';
    a.click();
    showToast('Export complete');
  };

  const convertToHtml = () => {
    state.value.showHTML = true;
    try {
      const dataObj = JSON.parse(state.value.jsonData);
      state.value.renderedContent = sanitizeHtml(jsonToHtml(dataObj));
      state.value.statusMessage = '';
      showToast('JSON converted to HTML');
    } catch {
      state.value.statusMessage = 'Invalid JSON data.';
      state.value.renderedContent = '';
    }
  };

  const convertToMarkdown = () => {
    state.value.showHTML = false;
    try {
      const dataObj = JSON.parse(state.value.jsonData);
      state.value.markdownContent = jsonToMarkdown(dataObj);
      state.value.renderedContent = sanitizeHtml(md.render(state.value.markdownContent));
      state.value.statusMessage = '';
      showToast('JSON converted to Markdown');
    } catch {
      state.value.statusMessage = 'Invalid JSON data.';
      state.value.markdownContent = '';
      state.value.renderedContent = '';
    }
  };

  const jsonToHtml = (data, level = 0) => {
    const indentClass = `pl-${level * 4}`;
    if (Array.isArray(data)) {
      return `<ul class="list-disc ${indentClass}">${data
        .map((item) => `<li>${jsonToHtml(item, level + 1)}</li>`)
        .join('')}</ul>`;
    }
    if (typeof data === 'object' && data !== null) {
      return `<div class="${indentClass} p-4">${Object.entries(data)
        .map(([key, value]) =>
          `<div class="mb-1"><strong>${key}:</strong> ${jsonToHtml(value, level + 1)}</div>`,
        )
        .join('')}</div>`;
    }
    const valueStr = String(data);
    if (valueStr.startsWith('http://') || valueStr.startsWith('https://')) {
      return isImageUrl(valueStr)
        ? `<img src="${valueStr}" alt="Image" class="max-w-full h-auto rounded-lg">`
        : `<a href="${valueStr}" class="text-primary underline">${valueStr}</a>`;
    }
    return `<span class="text-on-surface">${valueStr}</span>`;
  };

  const jsonToMarkdown = (data, level = 0) => {
    const indent = '  '.repeat(level);
    if (Array.isArray(data)) {
      return data.map((item) => `${indent}- ${jsonToMarkdown(item, level + 1)}`).join('\n');
    }
    if (typeof data === 'object' && data !== null) {
      return Object.entries(data)
        .map(([key, value]) => `${indent}**${key}:** ${jsonToMarkdown(value, level + 1)}`)
        .join('\n');
    }
    return String(data);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(state.value.apiUrl, {
        headers: { 'x-api-key': 'reqres_77b2587ba6824d4abc48abbf3ac44e54' },
      });
      if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);
      const data = await response.json();
      state.value.jsonData = JSON.stringify(data, null, 2);
      state.value.statusMessage = 'Data fetched successfully!';
      showToast('JSON fetched & validated');
    } catch (error) {
      state.value.statusMessage = error.message;
    }
  };

  fetchData();

  watch(
    () => state.value.jsonData,
    () => {
      if (isValidJson.value) {
        const data = JSON.parse(state.value.jsonData);
        if (state.value.showHTML) {
          state.value.renderedContent = sanitizeHtml(jsonToHtml(data));
        } else {
          state.value.markdownContent = jsonToMarkdown(data);
          state.value.renderedContent = sanitizeHtml(md.render(state.value.markdownContent));
        }
        state.value.statusMessage = '';
      } else {
        state.value.statusMessage = 'Invalid JSON data.';
        state.value.renderedContent = '';
      }
    },
  );
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  body { font-family: 'Inter', sans-serif; }

  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
