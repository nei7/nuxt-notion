<template>
  <div class="mx-auto max-w-3xl px-6 py-10">
    <nav class="mb-10 text-sm">
      <NuxtLink to="/">
        ← All posts
      </NuxtLink>
    </nav>
    <NuxtPage />
  </div>
</template>

<style>
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@media (prefers-color-scheme: dark) {
  html {
    color-scheme: dark;
    background: #111;
    color: #eee;
  }

  .shiki,
  .shiki span {
    color: var(--shiki-dark) !important;
    background-color: var(--shiki-dark-bg) !important;
    font-style: var(--shiki-dark-font-style) !important;
    font-weight: var(--shiki-dark-font-weight) !important;
    text-decoration: var(--shiki-dark-text-decoration) !important;
  }
}
</style>
