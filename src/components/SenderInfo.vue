<template>
<div class="sender-wrapp">
    <div class="sender-container container">
        <div class="order-title">
            <h2>Информация об отправителе</h2>
            <h5>Заполните информацию о отправителе</h5>
            <div class="sender-info">
                <Input placeholderText="Романов" v-model="senderData.surname">Фамилия</Input>
                <Input 
                :externalError="validationStore.errors.senderInfo.name"
                placeholderText="Иван" 
                :isRequired="!isRequired" 
                v-model="senderData.name">Имя</Input>
                <Input 
                :externalError="validationStore.errors.senderInfo.patronymic"
                placeholderText="Иванович" 
                :isRequired="!isRequired" 
                v-model="senderData.patronymic">Отчество</Input>
                <Input 
                :externalError="validationStore.errors.senderInfo.phone"
                placeholderText="+7 (912) 999-99-99" 
                :isRequired="!isRequired" 
                inputType="tel"
                v-model="senderData.phone">Номер телефона</Input>
                <Select 
                :externalError="validationStore.errors.senderInfo.organization"
                placeholderText="Название организации" 
                :isRequired="!isRequired" 
                :tooltipText="tipText" 
                :options="organization ? organization.map(org => org.title) : []"
                v-model="senderData.organization"
                >Организация</Select>
            </div>
            <div class="sender-btn">
                <span>
                    Нажимая кнопку "Сохранить" вы подтверждаете 
                    <router-link to="/privacy-policy">согласие на обработку персональных данных</router-link>
                </span>                
                <Button @click="createHero">Сохранить</Button>
            </div>
        </div>
    </div>
    <Popup @close="closePopup" :isSave="isSave"></Popup>
</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useValidationStore } from '../store/validationStore';
import axios from 'axios';
import Input from './UI/Input.vue';
import Select from './UI/Select.vue';
import Button from './UI/Button.vue';
import Popup from './UI/Popup.vue';
const tipText = ref('Lorem ipsum dolor sit amet...');
const isRequired = ref(false);
const isSave = ref(false);
const validationStore = useValidationStore()
interface SenderOrg {
  id: number;
  title: string;
}

interface SenderData {
  surname: string;
  name: string;
  patronymic: string;
  phone: string;
  organization: string;
}

defineProps({
    modelValue: {
        type: Object as () => SenderData,
        required: true
    }
})

const organization = ref<SenderOrg[]>([]);

const senderData = ref<SenderData>({
  surname: '',
  name: '',
  patronymic: '',
  phone: '',
  organization: ''
});

const emit = defineEmits(['update:modelValue', 'create']);

const fetchOrganization = async () => {
  try {
    const response = await axios.get('https://book-new.itlabs.top/api/institutions');
    organization.value = response.data as SenderOrg[];
  } catch (error) {
    console.error('Ошибка загрузки организаций', error);
  }
};

const createHero = () => {  
    
    emit('create');
    isSave.value = true;
};

const resetInputs = () => {
  senderData.value = {
    surname: '',
    name: '',
    patronymic: '',
    phone: '',
    organization: ''
  };
};


const closePopup = () => {
    isSave.value = false
}

onMounted(() => {
    fetchOrganization();
});


watch(senderData, (newValue: SenderData) => {
    emit('update:modelValue', newValue);
}, { deep: true });

defineExpose({ resetInputs });
</script>

<style scoped lang="scss">
@use '../root.scss' as *;

.sender-container {
    padding-top: 0;
    padding-bottom: 0;

    .sender-info {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
    }
    .sender-btn {
        display: flex;
        span {
            font-size: 18px;
            color: $gray-color;
            font-weight: 200;
        }
        a {
            color: $red-color;
            transition: all 0.3s ease;
        }
        button {
            max-width: 396px;
            width: 100%;
        }
    }
}

@media (max-width: 360px) {
    .sender-btn {
        flex-direction:column-reverse;
        gap: 16px;

    }
}
</style>