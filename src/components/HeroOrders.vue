<template>
<div class="orders-wrapp">
    <div class="order-container container">
        <div class="order-title">
            <h2>Награды героя</h2>
            <h5>Заполните информацию о наградах героя</h5>
        </div>
        <div class="order-flex">
        <div class="order-info"  v-for="(order, index) in orders" :key="order.id">
            <div class="info-wrapp">
                <div class="info-inputs">
                    <Select 
                    placeholderText="Выберите название" 
                    :externalError="validationStore.errors.heroOrders[`order_${index}`]?.title"
                    :isRequired="!isRequired" 
                    :options="medalTitles" 
                    v-model="order.title" 
                    :tooltipText="tipText">Название награды</Select>
                    <Input placeholderText="Ввдеите год" v-model="order.year">Год выдачи награды</Input>
                </div>
                <div class="info-textarea">
                    <Textarea placeholderText="Дополнительные сведения" v-model="order.description">Описание боевого подвига или заслуги</Textarea>
                </div>
                <div class="info-button">
                    <DeleteBtn @click="openPopup(order.id)" :isDisabled="orders.length === 1"></DeleteBtn>
                </div>
            </div>
        </div>
        </div>
        <div class="order-add">
            <Button @click="addOrder"><img src="../assets/img/pluse.svg" alt=""> Добавить награду</Button>
        </div>
        <div class="border"></div>
    </div>
    <Popup v-if="isShow" @delete="confirmDelete" @close="closePopup" :isShow="isShow"></Popup>
</div>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue'
import { useValidationStore } from '../store/validationStore'
import Input from './UI/Input.vue'
import Textarea from './UI/Textarea.vue'
import Select from './UI/Select.vue'
import Button from './UI/Button.vue'
import DeleteBtn from './UI/DeleteBtn.vue'
import Popup from './UI/Popup.vue'
interface Order {
  id: number;
  title: string;
  year: string;
  description: string;
}

const props = defineProps({
    medalTitles: {
        type: Array as () => string[],
        default: () => []
    },
    modelValue: {
        type: Array as PropType<Order[]>,
        required: true
    }
})
const validationStore = useValidationStore()
const isRequired = ref(false)
const tipText = ref('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.')
const emit = defineEmits(['update:modelValue'])
const orders = ref([...props.modelValue])
const isShow = ref(false)
const orderToDelete = ref<number | null>(null)

//добавление награды
const addOrder = () => {
  const newId = orders.value.length > 0 ? orders.value[orders.value.length - 1].id + 1 : 1
  orders.value.push({ id: newId, title: '', year: '', description: '' })
  emit('update:modelValue', orders.value)
  validationStore.validateHeroOrders(orders.value)
}
//удаление награды
const deleteOrder = (id: number) => {
  orders.value = orders.value.filter(order => order.id !== id)
  emit('update:modelValue', orders.value)
  validationStore.validateHeroOrders(orders.value)
}
//подтверждение удаления
const confirmDelete = () => {
  if (orderToDelete.value !== null) {
    deleteOrder(orderToDelete.value)
  }
  isShow.value = false
}

const openPopup = (id: number) => {
    orderToDelete.value = id
    isShow.value = true
}

const closePopup = () => {
    isShow.value = false
}

const resetInputs = () => {
  orders.value = [{id: 1, title: '', year: '', description: ''}];
};

defineExpose({ resetInputs });

</script>

<style scoped lang="scss">
@use '../root.scss' as *;
.border {
    border-bottom: 1px solid $placeholder;
    padding-bottom: 48px;
}
.order-container {
    padding-bottom: 0;
}
.order-flex {
    display: flex;
    flex-direction: column;
    gap: 24px;
}
.order-info {
    background-color: $order-bg;
    padding: 24px;
    max-width: 1228px;
    height: 292px;
    border-radius: 12px;
    .info-wrapp {
        display: flex;
        gap: 20px;
        .info-inputs {
            max-width: 500px;
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 20px;
            .input {
                max-width: 500px;
                ::v-deep(input) {
                    height: 64px;
                }
            }
            .custom-select {
                max-width: 500px;
            }
        }
        .info-textarea {
            max-width: 544px;
            width: 100%;
            ::v-deep(.label) {
                white-space: nowrap;
            }
            ::v-deep(.textarea-input) {
                height: 194px;
            }
        }
        .info-button {
            width: 96px;
            height: 244px;
            button {
                height: 100%;
                max-width: 96px;
                width: 96px;
            }
        }
    }
}

.order-add {
    display: flex;
    justify-content: right;
    margin-top: 32px;
    button {
        max-width: 396px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
    }
}

@media (max-width: 960px) {
.order-container {
    padding-top: 0;
}
    .order-info {
        max-width: 896px;
        .info-wrapp {
            gap: 24px;
            .info-inputs {
                max-width: 300px;
            }
            .info-textarea {
                max-width: 436px;
            }
            .info-button {
                width: 80px;
                button {
                    width: 80px;
                }
            }
        }
    }
    ::v-deep(.label) {
        white-space: break-spaces
    }
}

@media (max-width: 560px) {
.border {
    border-bottom: 1px solid $placeholder;
    padding-bottom: 32px;
}
.order-container {
    padding-top: 0;
}
    .order-info {
        height: auto;
        .info-wrapp {
            flex-direction: column;
            .info-inputs {
                max-width: 100%;
            }
            .info-button {
                width: 100%;
                height: 80px;
                button {
                    max-width: 100%;
                    width: 100%;
                }
            }
            .info-textarea {
                ::v-deep(.label){
                    white-space: wrap;
                }
            }
        }
    }
}
</style>