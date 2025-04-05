/** @type {import('tailwindcss').Config} */
module.exports = {
	theme: {
		extend: {},
	},
	plugins: [],
	content: [
		"./components/**/*.{js,vue,ts}",
		"./layouts/**/*.vue",
		"./pages/**/*.vue",
		"./plugins/**/*.{js,ts}",
		"./app.vue",
		"./error.vue",
	],
};
