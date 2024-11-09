<template>
	<div class="max-w-[1440px] px-[64px] py-[32px] h-screen">
		<div class="grid grid-cols-12">
			<input
				v-model="apiUrl"
				class="p-2 border-2 rounded-l-xl col-span-10"
				type="text"
				placeholder="https://reqres.in/api/users?page=2"
			/>
			<button
				class="px-6 py-2 col-span-2 rounded-r-xl bg-gray-700 text-white hover:bg-gray-800"
				@click="fetchData"
			>
				GET
			</button>
		</div>

		<!-- Status Message -->
		<p v-if="statusMessage" class="px-2">
			{{ statusMessage }}
		</p>
		<div class="grid grid-cols-6 gap-6 mx-auto my-4">
			<div class="col-span-3"></div>
			<div class="col-span-3 grid grid-cols-2 gap-4">
				<button
					class="py-2 px-4 bg-yellow-200 hover:bg-yellow-300 transition-all ease-in-out delay-200 rounded-[8px]"
					@click="convertToHtml(jsonData)"
				>
					Convert to HTML
					<font-awesome-icon class="px-2" :icon="['fas', 'angles-down']" />
				</button>
				<button
					class="py-2 px-4 bg-yellow-200 hover:bg-yellow-300 transition-all ease-in-out delay-200 rounded-[8px]"
					@click="convertToMarkdown()"
				>
					Convert to Markup
					<font-awesome-icon class="px-2" :icon="['fas', 'angles-down']" />
				</button>
			</div>
		</div>
		<div class="grid grid-cols-2 gap-4 h-full">
			<ViewBox>
				<template #heading>
					JSON Editor
				</template>
				<template #content>
					<textarea
						v-model="jsonData"
						class="h-full w-full bg-slate-800 rounded-b-xl text-white p-4 shadow-xl"
						placeholder="Paste & Edit JSON data"
					></textarea>
				</template>
			</ViewBox>
			<div class="  flex relative flex-col border-[0.5px] rounded-xl overflow-scroll">
				<div class="grid gap-1 sticky top-0 rounded-t-xl items-center bg-blue-50 grid-cols-2 px-4 py-2 border-b-[1px] w-full">
					<div class="max-w-[90px] flex flex-row gap-1">
						<div class="h-[15px] w-[15px] bg-red-400 rounded-[50%]"></div>
						<div class="h-[15px] w-[15px] bg-yellow-400 rounded-[50%]"></div>
						<div class="h-[15px] w-[15px] bg-green-400 rounded-[50%]"></div>
					</div>
					<div class="text-center font-semibold">HTML / Markup Viewer</div>
				</div>
				<VueMarkdown v-if="!showHTML" class="p-4" :source="markdownContent" />
				<div v-else class="p-2" v-html="renderedContent"></div>
			</div>

			<!-- <div  class="bg-slate-800 text-light rounded-2xl">
				<div class="bg-blue-50 rounded-t-xl flex flex-row items-center">
					<div
						class="grid gap-1 grid-cols-3 max-w-[90px] px-4 py-2 border-b-[1px] w-full"
					>
						<div class="h-[15px] w-[15px] bg-red-400 rounded-[50%]"></div>
						<div class="h-[15px] w-[15px] bg-yellow-400 rounded-[50%]"></div>
						<div class="h-[15px] w-[15px] bg-green-400 rounded-[50%]"></div>
					</div>
					<div class="font-semibold text-center text-base">
						HTML Preview (9)
					</div>
				</div>
				
			</div>
			<ViewBox  :content="renderedContent">
				<template #heading>
					Markdown Preview
				</template>
				<template #content>
					<div class="p-4 bg-slate-800 rounded-b-xl text-white min-h-full">
						
					</div>
				</template>
			</ViewBox> -->
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";
import VueMarkdown from "vue-markdown-render";
const md = new MarkdownIt();
const showHTML = ref(true);
const apiUrl = ref("https://reqres.in/api/users?page=2");
const jsonData = ref("");
const statusMessage = ref("");
const renderingOption = ref("html"); // or 'markdown'
const renderedContent = ref("");
const markdownContent = ref("");
const renderedHtml = ref("");
const isValidJson = (str) => {
	try {
		JSON.parse(str);
		return true;
	} catch (e) {
		return false;
	}
};

const convertToHtml = () => {
	showHTML.value = true;
	try {
		const dataObj = JSON.parse(jsonData.value);

		// Generate HTML content dynamically
		const rawHtml = jsonToHtml(dataObj);

		// Sanitize the HTML
		renderedContent.value = DOMPurify.sanitize(rawHtml);
		statusMessage.value = "";
	} catch (error) {
		console.error("Invalid JSON data:", error);
		statusMessage.value = "Invalid JSON data.";
		renderedContent.value = "";
	}
};

const jsonToHtml = (data, level = 0) => {
	const indentClass = `pl-${level * 4}`;

	if (Array.isArray(data)) {
		// Handle arrays
		return `
      <ul class="list-disc ${indentClass}">
        ${data
					.map((item) => `<li>${jsonToHtml(item, level + 1)}</li>`)
					.join("")}
      </ul>
    `;
	} else if (typeof data === "object" && data !== null) {
		// Handle objects
		return `
      <div class="${indentClass} p-4">
        ${Object.entries(data)
					.map(
						([key, value]) => `
          <div class="mb-1">
            <strong class="">${key}:</strong> ${jsonToHtml(value, level + 1)}
          </div>
        `
					)
					.join("")}
      </div>
    `;
	} else {
		// Handle primitive values
		const valueStr = String(data);

		// Check if it's a URL
		if (valueStr.startsWith("http://") || valueStr.startsWith("https://")) {
			if (isImageUrl(valueStr)) {
				// Render as image
				return `<img src="${valueStr}" alt="Image" class="max-w-full h-auto">`;
			} else {
				// Render as link
				return `<a href="${valueStr}" class="text-blue-500 underline">${valueStr}</a>`;
			}
		} else {
			// Render as text
			return `<span class="text-gray-800">${valueStr}</span>`;
		}
	}
};

const isImageUrl = (url) => {
	return /\.(jpeg|jpg|gif|png|svg|webp)$/.test(url);
};

const convertToMarkdown = () => {
	showHTML.value = false;
	try {
		const dataObj = JSON.parse(jsonData.value);

		// Generate Markdown content dynamically
		const markdown = jsonToMarkdown(dataObj);

		// Update the markdownContent
		markdownContent.value = markdown;

		// Convert Markdown to HTML and sanitize
		const rawHtml = md.render(markdown);
		renderedHtml.value = DOMPurify.sanitize(rawHtml);

		statusMessage.value = "";
	} catch (error) {
		console.error("Invalid JSON data:", error);
		statusMessage.value = "Invalid JSON data.";
		markdownContent.value = "";
		renderedHtml.value = "";
	}
};

const jsonToMarkdown = (data, level = 0) => {
	let markdown = "";
	const indent = "  ".repeat(level);
	if (Array.isArray(data)) {
		// Handle arrays
		data.forEach((item) => {
			markdown += `${indent}- ${jsonToMarkdown(item, level + 1)}\n`;
		});
	} else if (typeof data === "object" && data !== null) {
		// Handle objects
		Object.entries(data).forEach(([key, value]) => {
			markdown += `${indent}**${key}:** ${jsonToMarkdown(value, level + 1)}\n`;
		});
	} else {
		// Handle primitive values
		markdown += `${String(data)}`;
	}
	return markdown;
};

const fetchData = async () => {
	try {
		const response = await fetch(apiUrl.value);
		if (!response.ok) {
			throw new Error(`Error: ${response.status} ${response.statusText}`);
		}
		const data = await response.json();
		jsonData.value = JSON.stringify(data, null, 2);
		statusMessage.value = "Data fetched successfully!";
	} catch (error) {
		statusMessage.value = error.message;
	}
};
watch([jsonData, renderingOption], () => {
	if (isValidJson(jsonData.value)) {
		const data = JSON.parse(jsonData.value);
		if (renderingOption.value === "html") {
			renderedContent.value = jsonToHtml(data);
		} else if (renderingOption.value === "markdown") {
			renderedContent.value = jsonToMarkdown(data);
		}
		statusMessage.value = "";
	} else {
		statusMessage.value = "Invalid JSON data.";
		renderedContent.value = "";
	}
});
</script>
