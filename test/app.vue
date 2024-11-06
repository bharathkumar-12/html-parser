<template>
	<div class="max-w-[1440px] px-[64px] py-[32px] h-screen">

		<div class="grid grid-cols-2 bg-blue-50">
			<input
				v-model="apiUrl"
				class="p-2 border-2"
				type="text"
				placeholder="https://reqres.in/api/users?page=2"
			/>
			<button
				class="px-6 py-2 bg-gray-700 text-white hover:bg-gray-800"
				@click="fetchData"
			>
				GET
			</button>
		</div>

		<!-- Status Message -->
		<p class=" py-3 my-3">Status Message: {{ statusMessage }}</p>

		<div class="grid grid-cols-12 gap-4 h-full">
			<textarea
				v-model="jsonData"
				class="h-full border-[0.5px] p-6 col-span-5 shadow-xl"
				placeholder="Enter or edit JSON data"
			></textarea>
			<div class="flex flex-col gap-6 col-span-2">
				<button
					v-if="!showHTML"
					class="border-2 border-gray-800 p-2 hover:bg-gray-50"
					@click="convertToHtml(jsonData)"
				>
					Convert to HTML >>
				</button>
				<button
					v-else
					class="border-2 border-gray-800 p-2 hover:bg-gray-50"
					@click="convertToMarkdown()"
				>
					Convert to Markup >>
				</button>
			</div>
			<div class="col-span-5 border-[0.5px] p-6 shadow-xl">
				<div class="" v-if="showHTML">
					<h2 class="text-xl font-bold mb-2 border-b-2">HTML VIEW</h2>
					<div  v-html="renderedContent"></div>
				</div>
				<div class="" v-else>
					<h2 class="text-xl font-bold mb-2 border-b-2">MARKDOWN VIEW</h2>
					<pre class="overflow-auto text-sm">{{ markdownContent }}</pre>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";

const md = new MarkdownIt();
const showHTML = ref(true);
const apiUrl = ref("");
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
      <div class="${indentClass} mb-2">
        ${Object.entries(data)
					.map(
						([key, value]) => `
          <div class="mb-1">
            <strong class="text-gray-700">${key}:</strong> ${jsonToHtml(
							value,
							level + 1
						)}
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
