<template>
    <div class="textarea">
        <div class="label">
            <label for=""><slot></slot></label>
            <span v-if="isRequired">*</span>
                <img 
                v-if="tooltipText"
                src="../../assets/img/help.svg" 
                alt="Подсказка"
                @mouseover="showTooltip = true" 
                @mouseleave="showTooltip = false"
                >
            <div v-if="showTooltip" class="tooltip">{{ tooltipText }}</div>
        </div>
        <textarea 
          :placeholder="placeholderText" 
          class="textarea-input"
          @input="handleInput"
          :value="modelValue"
          ></textarea>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    isRequired: {
        type: Boolean,
        default: false
    },
    placeholderText: {
        type: String,
        default: 'Выберите значение'
    },
    tooltipText: {
        type: String,
        default: null
    }
})

const emit = defineEmits(['update:modelValue'])

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement || null
    if (target) {
        emit('update:modelValue', target.value)
    }
}

const showTooltip = ref(false)
</script>

<style scoped lang="scss">
@use '../../root.scss' as *;
.textarea {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
}
textarea {
    height: 128px;
    border-radius: 12px;
    border: 1px solid $gray-color;
    width: 100%;
    background-color: transparent;
    outline: none;
    padding: 20px;
    font-size: 16px;
    font-family: 'RobotoSlab';
    font-weight: 200;
    resize: none;
    &::placeholder {
        color: $placeholder;
        font-family: 'RobotoSlab';
        font-weight: 200;
        font-size: 16px;
    }

    &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 4px;
        margin: 8px;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(215, 209, 184, 1);
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
}
.label {
    display: flex;
    gap: 16px;
    font-size: 24px;
    white-space: nowrap;
    color: $label-color;
    position: relative;
    span {
        color: $red-color;
    }

    &:hover .tooltip {
        opacity: 1;
        visibility: visible;
    }
}

.tooltip {
    position: absolute;
    top: calc(100% + 16px);
    left: -6px;
    background-color: $label-color;
    color: $white-color;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 14px;
    white-space: pre-wrap;
    z-index: 10;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
    max-width: 396px;

    &::before {
        content: '';
        position: absolute;
        bottom: 100%;
        right: 8px;
        border-width: 14px 8px 14px 8px;
        border-style: solid;
        border-color: transparent transparent $label-color transparent;
    }
}

@media (max-width: 960px) {
    label {
        font-size: 20px;
        white-space: break-spaces;
    }
    .tooltip {
        top: calc(100% + 24px);
        max-width: 200px;
        left: 130px;
    }
    .textarea {
        gap: 20px;
    }
}

@media (max-width: 360px) {
    .tooltip {
        top: calc(100% + 24px);
        right: -3px;
    }
}
</style>