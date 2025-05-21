<template>
  <button :disabled="isDisabled">
    <svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.4375 2.8125H15.257L14.7999 1.44197C14.6602 1.02186 14.3917 0.656438 14.0325 0.397592C13.6733 0.138746 13.2417 -0.000368497 12.799 7.33091e-07H9.20098C8.75819 -0.000293168 8.32655 0.13884 7.96728 0.397666C7.60801 0.656492 7.33935 1.02187 7.19942 1.44197L6.74291 2.8125H2.5625C1.39934 2.8125 0.453125 3.75872 0.453125 4.92188V6.32813C0.453125 7.11131 1.15817 7.03125 1.91483 7.03125H20.8438C21.2324 7.03125 21.5469 6.71677 21.5469 6.32813V4.92188C21.5469 3.75872 20.6007 2.8125 19.4375 2.8125ZM8.22561 2.8125L8.53358 1.88691C8.58026 1.74685 8.66985 1.62505 8.78965 1.53878C8.90944 1.45251 9.05336 1.40614 9.20098 1.40625H12.799C13.1018 1.40625 13.3703 1.59919 13.4658 1.88691L13.7741 2.8125H8.22561ZM2.03122 8.53125L3.15233 22.0815C3.25189 23.1753 4.15484 24 5.2528 24H16.7472C17.8452 24 18.7482 23.1753 18.8484 22.0753L19.9689 8.53125H2.03122ZM7.48438 20.4844C7.48438 21.4112 6.07812 21.415 6.07812 20.4844V10.6406C6.07812 9.71377 7.48438 9.70997 7.48438 10.6406V20.4844ZM11.7031 20.4844C11.7031 21.4112 10.2969 21.415 10.2969 20.4844V10.6406C10.2969 9.71377 11.7031 9.70997 11.7031 10.6406V20.4844ZM15.9219 20.4844C15.9219 21.4112 14.5156 21.415 14.5156 20.4844V10.6406C14.5156 10.252 14.8301 9.9375 15.2188 9.9375C15.6074 9.9375 15.9219 10.252 15.9219 10.6406V20.4844Z" fill="#2B2A29"/>
    </svg>
  </button>
</template>

<script setup lang="ts">
defineProps({
  isDisabled: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
@use '../../root.scss' as *;
button {
    background-color: $wheat-color;
    max-width: 64px;
    width: 100%;
    height: 64px;
    border:none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
    path {
      transition: fill 0.3s ease;
      fill: #2B2A29;
    }
  }
  &:not(:disabled):hover {
    transform: scale(1.02);
    filter: brightness(0.9);
    svg {
      path {
        fill: $red-color;
      }
    }
  }
  &:disabled {
    opacity: 50%;
    transition: none;
    pointer-events: none;
  }
}

</style>