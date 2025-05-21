<template>
    <button :class="bgColor">
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
defineProps({
    bgColor: {
        type: String,
        default: 'red-btn'
    }
})

</script>

<style lang="scss" scoped>
@use '../../root.scss' as *;
button {
  border: none;
  border-radius: 12px;
  font-family: 'RobotoSlab';
  max-width: 312px;
  width: 100%;
  min-height: 64px;
  font-size: 1.125rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
}
.red-btn {
    background-color: $red-color;
    color: $white-color;

    &:disabled {
        opacity: 50%;
        cursor: not-allowed;
        transform: none;
    }
}

.wheat-btn {
    background-color: $wheat-color;
    color: $black-color;

}

.white-text {
    color: $white-color;
}

@media (max-width: 960px) {
    button {
        max-width: 352px;
    }
}

@media (max-width: 360px) {
    button {
        max-width: 244px;
    }
}
</style>