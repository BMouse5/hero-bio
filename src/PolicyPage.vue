<template>
<div class="policy">
    <div class="policy-wrapp container">
        <div class="policy-title">
            <Button @click="toBack"><img src="./assets/img/arrow.svg" alt=""> Назад</Button>
            <h2>Согласие на обработку персональных данных</h2>
        </div>
        <div v-html="privacy?.description"></div>
    </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted} from 'vue'
import axios from 'axios';
import Button from './components/UI/Button.vue';
import { useRouter } from 'vue-router';

const router = useRouter()
interface PrivacyData {
    id: number,
    description: string
}

const privacy = ref<PrivacyData | null>(null)

const fetchPrivacy = async () => {
    try {
        const response = await axios.get<PrivacyData>(`https://book-new.itlabs.top/api/personal_data_accepts`)
        privacy.value = response.data
    }
    catch (error) {
        console.log(error)
    }
}

const toBack = () => {
    router.push('/')
}

onMounted(fetchPrivacy)
</script>

<style scoped lang="scss">

.policy-title {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 40px;
    button {
        max-width: 184px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }
}

@media (max-width: 1920px) {
    h2 {
        font-size: 40px;
    }
}

@media (max-width: 960px) {
    .policy-wrapp {
        padding-top: 0;
        padding-bottom: 0;
    }
    h2 {
        font-size: 32px;
    }
}

@media (max-width: 360px) {
    .policy-wrapp {
        padding-top: 0;
        padding-bottom: 0;
    }
    .policy-title {
        flex-direction: column;
        text-align: center;

        h2 {
            font-size: 20px;
        }
        button {
            max-width: 140px;
        }
    }
}
</style>