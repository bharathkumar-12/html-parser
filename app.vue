<template>
	<div class="min-h-screen bg-[#f5f5f7]">
		<!-- Apple-like Header -->
		<header class="bg-white border-b border-gray-200 backdrop-blur-lg bg-opacity-80 sticky top-0 z-50">
			<div class="max-w-[1440px] mx-auto px-8">
				<div class="flex items-center justify-between h-16">
					<div class="flex items-center gap-8">
						<div class="flex items-center gap-2">
							<font-awesome-icon :icon="['fas', 'code']" class="text-gray-900 text-xl" />
							<span class="text-gray-900 font-medium text-lg">JSON Converter</span>
						</div>
						<nav class="hidden md:flex items-center gap-6">
							<a href="#" class="text-gray-600 hover:text-gray-900 transition-colors text-sm">Overview</a>
							<a href="#" class="text-gray-600 hover:text-gray-900 transition-colors text-sm">Documentation</a>
							<a href="#" class="text-gray-600 hover:text-gray-900 transition-colors text-sm">Examples</a>
						</nav>
					</div>
				</div>
			</div>
		</header>

		<!-- Main Content -->
		<main class="max-w-[1440px] mx-auto px-8 py-12">
			<div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
				<div class="flex items-center justify-between mb-8">
					<div>
						<h1 class="text-3xl font-semibold text-gray-900 tracking-tight">JSON to HTML/Markdown Converter</h1>
						<p class="text-gray-500 mt-2 text-lg">Transform your JSON data into beautifully formatted HTML or Markdown</p>
					</div>
					<div class="flex items-center gap-3">
						<button class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-50">
							<font-awesome-icon :icon="['fas', 'star']" class="mr-1" />
							Star
						</button>
						<button class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-50">
							<font-awesome-icon :icon="['fas', 'code-fork']" class="mr-1" />
							Fork
						</button>
					</div>
				</div>

				<div class="flex gap-4">
					<input
						v-model="state.apiUrl"
						class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm bg-gray-50"
						type="text"
						placeholder="https://reqres.in/api/users?page=2"
					/>
					<button
						class="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 text-sm font-medium flex items-center gap-2 shadow-sm"
						@click="fetchData"
					>
						<font-awesome-icon :icon="['fas', 'download']" />
						Fetch Data
					</button>
				</div>

				<p v-if="state.statusMessage" 
					:class="['mt-4 px-4 py-3 rounded-xl text-sm', 
						state.statusMessage.includes('successfully') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200']">
					{{ state.statusMessage }}
				</p>
			</div>

			<div class="flex justify-end gap-4 mb-6">
				<button
					class="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 text-sm font-medium flex items-center gap-2 shadow-sm"
					@click="convertToHtml"
				>
					<font-awesome-icon :icon="['fas', 'code']" />
					Convert to HTML
				</button>
				<button
					class="px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 text-sm font-medium flex items-center gap-2 shadow-sm"
					@click="convertToMarkdown"
				>
					<font-awesome-icon :icon="['fas', 'markdown']" />
					Convert to Markdown
				</button>
			</div>

			<div class="grid grid-cols-2 gap-6">
				<div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
					<div class="bg-gray-900 px-4 py-3 flex items-center justify-between border-b border-gray-800">
						<h2 class="text-sm font-medium text-white">JSON Editor</h2>
						<div class="flex gap-2">
							<div class="h-2.5 w-2.5 rounded-full bg-red-500"></div>
							<div class="h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
							<div class="h-2.5 w-2.5 rounded-full bg-green-500"></div>
						</div>
					</div>
					<textarea
						v-model="state.jsonData"
						class="w-full h-[600px] bg-gray-900 text-gray-100 p-4 font-mono text-sm focus:outline-none"
						placeholder="Paste & Edit JSON data"
					></textarea>
				</div>

				<div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
					<div class="bg-gray-900 px-4 py-3 flex items-center justify-between border-b border-gray-800">
						<h2 class="text-sm font-medium text-white">Preview</h2>
						<div class="flex gap-2">
							<div class="h-2.5 w-2.5 rounded-full bg-red-500"></div>
							<div class="h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
							<div class="h-2.5 w-2.5 rounded-full bg-green-500"></div>
						</div>
					</div>
					<div class="h-[600px] overflow-auto p-4 bg-gray-50">
						<VueMarkdown v-if="!state.showHTML" class="prose max-w-none text-sm" :source="state.markdownContent" />
						<div v-else class="prose max-w-none text-sm" v-html="state.renderedContent"></div>
					</div>
				</div>
			</div>
		</main>
	</div>
</template>

<script setup>
import { ref, computed } from "vue";
import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";
import VueMarkdown from "vue-markdown-render";

// Initialize markdown parser once
const md = new MarkdownIt();

// State management
const state = ref({
	apiUrl: "https://reqres.in/api/users?page=2",
	jsonData: "",
	statusMessage: "",
	showHTML: true,
	markdownContent: "",
	renderedContent: "",
});

// Computed properties
const isValidJson = computed(() => {
	try {
		JSON.parse(state.value.jsonData);
		return true;
	} catch {
		return false;
	}
});

// Utility functions
const isImageUrl = (url) => /\.(jpeg|jpg|gif|png|svg|webp)$/.test(url);

const sanitizeHtml = (html) => DOMPurify.sanitize(html);

// Conversion functions
const convertToHtml = () => {
	state.value.showHTML = true;
	try {
		const dataObj = JSON.parse(state.value.jsonData);
		state.value.renderedContent = sanitizeHtml(jsonToHtml(dataObj));
		state.value.statusMessage = "";
	} catch (error) {
		state.value.statusMessage = "Invalid JSON data.";
		state.value.renderedContent = "";
	}
};

const convertToMarkdown = () => {
	state.value.showHTML = false;
	try {
		const dataObj = JSON.parse(state.value.jsonData);
		state.value.markdownContent = jsonToMarkdown(dataObj);
		state.value.renderedContent = sanitizeHtml(md.render(state.value.markdownContent));
		state.value.statusMessage = "";
	} catch (error) {
		state.value.statusMessage = "Invalid JSON data.";
		state.value.markdownContent = "";
		state.value.renderedContent = "";
	}
};

const jsonToHtml = (data, level = 0) => {
	const indentClass = `pl-${level * 4}`;
	
	if (Array.isArray(data)) {
		return `<ul class="list-disc ${indentClass}">${data.map(item => `<li>${jsonToHtml(item, level + 1)}</li>`).join("")}</ul>`;
	}
	
	if (typeof data === "object" && data !== null) {
		return `<div class="${indentClass} p-4">${Object.entries(data).map(([key, value]) => 
			`<div class="mb-1"><strong>${key}:</strong> ${jsonToHtml(value, level + 1)}</div>`
		).join("")}</div>`;
	}
	
	const valueStr = String(data);
	if (valueStr.startsWith("http://") || valueStr.startsWith("https://")) {
		return isImageUrl(valueStr) 
			? `<img src="${valueStr}" alt="Image" class="max-w-full h-auto">`
			: `<a href="${valueStr}" class="text-blue-500 underline">${valueStr}</a>`;
	}
	
	return `<span class="text-gray-800">${valueStr}</span>`;
};

const jsonToMarkdown = (data, level = 0) => {
	const indent = "  ".repeat(level);
	
	if (Array.isArray(data)) {
		return data.map(item => `${indent}- ${jsonToMarkdown(item, level + 1)}`).join("\n");
	}
	
	if (typeof data === "object" && data !== null) {
		return Object.entries(data).map(([key, value]) => 
			`${indent}**${key}:** ${jsonToMarkdown(value, level + 1)}`
		).join("\n");
	}
	
	return String(data);
};

// API interaction
const fetchData = async () => {
	try {
		const response = await fetch(state.value.apiUrl);
		if (!response.ok) throw new Error(`Error: ${response.status} ${response.statusText}`);
		
		const data = await response.json();
		state.value.jsonData = JSON.stringify(data, null, 2);
		state.value.statusMessage = "Data fetched successfully!";
	} catch (error) {
		state.value.statusMessage = error.message;
	}
};

// Initial data fetch
fetchData();

// Watch for changes
watch(() => state.value.jsonData, () => {
	if (isValidJson.value) {
		const data = JSON.parse(state.value.jsonData);
		state.value.renderedContent = state.value.showHTML 
			? sanitizeHtml(jsonToHtml(data))
			: sanitizeHtml(md.render(jsonToMarkdown(data)));
		state.value.statusMessage = "";
	} else {
		state.value.statusMessage = "Invalid JSON data.";
		state.value.renderedContent = "";
	}
});
</script>

