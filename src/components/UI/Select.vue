<template>
  <div class="custom-select" ref="dropdown">
    <div class="label">
      <label for="select-unique-id">
        <slot></slot>
      </label>
      <span v-if="isRequired" class="required-indicator">*</span>
      <img 
        v-if="tooltipText"
        src="../../assets/img/help.svg" 
        alt="Подсказка"
        @mouseover="showTooltip = true" 
        @mouseleave="showTooltip = false"
      >
      <div v-if="showTooltip" class="tooltip">{{ tooltipText }}</div>
    </div>
    <div
      id="select-unique-id"
      class="select-trigger"
      :class="{ 'is-open': isOpen, 'error': shouldShowError }"
      @click="toggleDropdown"
    >
      <span class="placeholder" v-if="modelValue === null || modelValue === ''">
        {{ placeholderText }}
      </span>
      <span v-else class="selected-option">
        {{ selectedOption }}
      </span>
      <svg class="icon" viewBox="0 0 5 9">
        <path d="M0.419,9.000 L0.003,8.606 L4.164,4.500 L0.003,0.394 L0.419,0.000 L4.997,4.500 L0.419,9.000 Z" />
      </svg>
    </div>
    <div v-if="shouldShowError" class="error-message">{{ errorMessage }}</div>
    <ul 
      v-if="isOpen" 
      class="select-dropdown"
      :style="dropdownStyle"
    >
      <div class="shadow"></div>
      <li
        v-for="(option, index) in options"
        v-if="options.length > 0"
        :key="index"
        :class="{ 'is-selected': option === modelValue }"
        @click="selectOption(option)"
        class="select-option"
      >
        {{ option }}
      </li>
      <li v-else>
        Выберите категорию героя
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';

const props = defineProps({
  placeholderText: {
    type: String,
    default: 'Нет',
  },
  options: {
    type: Array as () => string[],
    default: () => []
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
  tooltipText: {
    type: String,
    default: null
  },
  modelValue: {
    type: String,
    default: ''
  },
  errorMessage: {
    type: String,
    default: "Это поле обязательно для заполнения"
  },
  externalError: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['option', 'update:modelValue', 'validation', 'update:externalError']);

const showTooltip = ref(false);
const isOpen = ref(false);
const showError = ref(false);
const hasInteracted = ref(false);
const selectedOption = ref<string | null>(null);
const dropdown = ref<HTMLElement | null>(null);


//вывод ошибки
const shouldShowError = computed(() => {
  return (props.externalError && !hasInteracted.value) || showError.value;
});

//стиль для выпад. списка
const dropdownDirection = ref<'down' | 'up'>('down');
const dropdownStyle = computed(() => {
  return dropdownDirection.value === 'up' 
    ? { bottom: '70%', top: 'auto', marginTop: '0'}
    : {};
});

//открытие селекта
const toggleDropdown = async () => {
  isOpen.value = !isOpen.value;
  
  if (isOpen.value) {
    await nextTick();
    calculateDropdownDirection();
  }
};

//расчет направления выпад. списка
const calculateDropdownDirection = () => {
  if (!dropdown.value) return;
  
  const trigger = dropdown.value.querySelector('.select-trigger');
  const dropdownList = dropdown.value.querySelector('.select-dropdown');
  
  if (!trigger || !dropdownList) return;
  
  const triggerRect = trigger.getBoundingClientRect();
  const dropdownHeight = dropdownList.clientHeight;
  const spaceBelow = window.innerHeight - triggerRect.bottom;
  const spaceAbove = triggerRect.top;
  
  // Если места внизу меньше чем высота dropdown и при этом вверху больше места
  if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
    dropdownDirection.value = 'up';
  } else {
    dropdownDirection.value = 'down';
  }
};

//выбор значения из выпад.списка
const selectOption = (option: string) => {
  hasInteracted.value = true;
  selectedOption.value = option;
  showError.value = false;
  if (props.externalError) {
    emit('update:externalError', false);
  }
  emit('update:modelValue', option);
  emit('option', selectedOption);
  isOpen.value = false;
  validate(option);
};

//закрытие списка при клике в другом месте
const handleClickOutside = (event: MouseEvent) => {
  if (isOpen.value && dropdown.value && !dropdown.value.contains(event.target as Node)) {
    isOpen.value = false;
    validate(selectedOption.value || '');
  }
};

//валидация
const validate = (value: string) => {
  const isValid = !props.isRequired || (value && value.trim() !== '');
  showError.value = !isValid;
  emit('validation', isValid);
  return isValid;
};


onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('resize', calculateDropdownDirection);
  // Инициализация выбранного значения
  if (props.modelValue && props.options.includes(props.modelValue)) {
    selectedOption.value = props.modelValue;
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', calculateDropdownDirection);
});
</script>

<style scoped lang="scss">
  @use '../../root.scss' as *;
  .custom-select {
    position: relative;
    max-width: 396px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    .label {
      display: flex;
      align-items: center;
      font-size: 24px;
      gap: 16px;
      position: relative;
      label {
        font-weight: 500;
        color: $label-color;
      }
      &:hover .tooltip {
        opacity: 1;
        visibility: visible;
      }
      .required-indicator {
        color: $red-color;
      }
      img {
        position: absolute;
        right: 0;
      }
    }
  
    .select-trigger {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background-color: transparent;
      border: 1px solid rgb(70, 68, 68);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s;
      height: 61px;
      
      &.is-open {
        border-color: #333;
      }
      &.error {
        border: 1px solid $error !important;
      }
  
      .placeholder {
        color: $placeholder;
        font-family: 'RobotoSlab';
        font-weight: 200;
        font-size: 16px;
      }
      .selected-option {
        color: rgba(43, 42, 41, 1);
        font-weight: 200;
      }
      .icon {
        width: 16px;
        height: 16px;
        fill: rgba(43, 42, 41, 1);
        transform: rotate(90deg);
      }
    }
  
    .select-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      margin-top: 16px;
      background-color: $option-color;
      border: 1px solid #ccc;
      border-radius: 8px;
      max-height: 200px;
      overflow-y: auto;
      z-index: 10;
      padding: 12px 30px 12px 12px;
      list-style-type: none;
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
      .select-option {
        padding: 12px 16px;
        border-radius: 12px;
        cursor: pointer;
        transition: background-color 0.3s;
        font-weight: 200;
        &:hover,
        &.is-selected {
          background-color: rgba(128, 1, 31, 0.05);
          border-radius: 12px;
          color: $red-color;
        }
      }
    }
    .error-message {
      position: absolute;
      bottom: -20px;
      color: $error;
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
  .custom-select {
    max-width: 436px;
  }
  label {
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