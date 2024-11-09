<template>
	<div class="bg-slate-800 text-light rounded-2xl">
		<div class="bg-blue-50 rounded-t-xl flex flex-row items-center">
			<div
				class="grid gap-1 grid-cols-3 max-w-[90px] px-4 py-2  border-b-[1px] w-full"
			>
				<div class="h-[15px] w-[15px] bg-red-400 rounded-[50%]"></div>
				<div class="h-[15px] w-[15px] bg-yellow-400 rounded-[50%]"></div>
				<div class="h-[15px] w-[15px] bg-green-400 rounded-[50%]"></div>
				
			</div>
			<div class="font-semibold text-center text-base py-2"> <slot name="heading" /> </div>
		</div>
        <slot name="content" />
	</div>
</template>
