<template>
    <div class="input">
        <div class="label">
            <label for=""><slot></slot></label>
            <span v-if="isRequired">*</span>
            <img 
                v-if="tooltipText"
                src="../../assets/img/help.svg"
                @mouseover="showTooltip = true"
                @mouseleave="showTooltip = false"
            >
            <div v-if="showTooltip" class="tooltip">{{ tooltipText }}</div>
        </div>
        <input
        :type="inputType"
        :placeholder="placeholderText"
        :value="modelValue"
        @input="handleInput"
        @blur="handleBlur"
        :required="isRequired"
        :class="{ 'error': shouldShowError }"
        >
        <div v-if="shouldShowError" class="error-message">{{ error }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useValidationStore } from '../../store/validationStore';
const props = defineProps({
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
        default: 'Введите данные'
    },
    tooltipText: {
        type: String,
        default: null
    },
    errorMessage: {
        type: String,
        default: "Это поле обязательно для заполнения"
    },
    externalError: {
        type: Boolean,
        default: false
    },
    inputType: {
        type: String,
        default: 'text'
    }
})

const emit = defineEmits(['update:modelValue', 'blur', 'validation', 'update:externalError'])
const validationStore = useValidationStore()
const showTooltip = ref(false)
const showError = ref(false);
const hasInteracted = ref(false);
const error = ref(props.errorMessage)
//вывод ошибки валидации
const shouldShowError = computed(() => {
    return (props.externalError && !hasInteracted.value) || showError.value;
});

//обработка ввода
const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement | null;
    if (target) {
        hasInteracted.value = true;
        showError.value = false;
        emit('update:modelValue', target.value);
        emit('validation', !props.isRequired || target.value.trim() !== '');
    }
}
//валидация при сбросе фокуса
const handleBlur = () => {
  if (props.inputType === 'tel') {
    const isValid = validationStore.isValidPhoneNumber(props.modelValue);
    showError.value = !isValid;
    error.value = "Неверный формат"
    emit('validation', isValid);
  } else {
    validate(props.modelValue);
  }
  emit('blur');
};
//валидация
const validate = (value: string) => {
    const isValid = !props.isRequired || (value && value.trim() !== '');
    showError.value = !isValid;
    emit('validation', isValid);
    return isValid;
};

</script>

<style lang="scss" scoped>
@use '../../root.scss' as *;
.input {
    max-width: 396px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: relative;
}
input {
    height: 61px;
    border-radius: 12px;
    border: 1px solid $gray-color;
    width: 100%;
    background: transparent;
    outline: none;
    padding: 20px;
    font-size: 16px;
    font-family: 'RobotoSlab';
    font-weight: 200;
    &::placeholder {
        color: $placeholder;
        font-family: 'RobotoSlab';
        font-weight: 200;
        font-size: 16px;
    }
    &.error {
        border: 1px solid $error;
    }
}
.error-message {
    color: $error;
    font-size: 14px;
    position: absolute;
    bottom: -20px;
}
.label {
    position: relative;
    display: flex;
    gap: 16px;
    font-size: 24px;
    white-space: nowrap;
    color: $label-color;

    span {
        color: $red-color;
    }

    img {
        position: absolute;
        right: 0;
    }

    &:hover .tooltip {
        opacity: 1;
        visibility: visible;
    }
}

.tooltip {
    position: absolute;
    top: calc(100% + 16px);
    right: 0;
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

@media (max-width: 1000px) {
    .input {
        max-width: 436px;
        height: 112px;
        gap: 22px;
    }
    .label {
        font-size: 20px;
    }
    .tooltip {
        top: calc(100% + 24px);
    }
}

@media (max-width: 360px) {
    .tooltip {
        top: calc(100% + 24px);
    }
}
</style>