<template>
  <div class="main-page">
    <div class="main-title">
        <h1>Книга памяти «Герой моей семьи»</h1>
        <h6>Для добавления сведений в наш архив заполните предложенные поля и нажмите <span>«Сохранить»</span></h6>
    </div>
    <HeroBio
      v-model="heroInfo"
      :category-options="categoryOptions"
      :titles="titles"
      @category-selected="handleCategorySelected"
      ref="heroBioRef"
    ></HeroBio>
    <HeroOrders
      :medal-titles="medalTitles"
      v-model="orders"
      ref="heroOrdersRef"
    ></HeroOrders>
    <SenderInfo
      v-model="sender"
      @create="handleCreateHero"
      ref="senderInfoRef"
    ></SenderInfo>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import { useValidationStore } from './store/validationStore';
import axios from 'axios';
import HeroBio from './components/HeroBio.vue';
import HeroOrders from './components/HeroOrders.vue';
import SenderInfo from './components/SenderInfo.vue';
interface HeroRanks {
  id: number,
  category: string,
  title: string
}
interface HeroMedals {
  id: number,
  category: string,
  title: string
}
interface Order {
  id: number,
  title: string,
  year: string,
  description: string
}
type SelectedOption = {
  value: string;
}

const heroInfo = ref({
  surname: '',
  name: '',
  patronymic: '',
  livePlace: '',
  category: '',
  rank: '',
  birthDay: { day: '', month: '', year: '' },
  deathDay: { day: '', month: '', year: '' },
  description: '',
  heroPhotos: [],
  archivePhotos: { photo: [], video: [] },
});

const sender = ref({
  surname: '',
  name: '',
  patronymic: '',
  phone: '',
  organization: ''
});

//данные для категорий
const categoryOptions = ref([
  'Герои Великой Отечественной войны',
  'Труженики тыла', 
  'Герои локальных войн', 
  'Герои - ликвидаторы ЧС', 
  'Герои Специальной Военной Операции', 
  'Другая категория'
]);

const titles = ref<string[]>([]);
const ranks = ref<HeroRanks[]>([]);
const medals = ref<HeroMedals[]>([]);
const medalTitles = ref<string[]>([]);
const orders = ref<Order[]>([
  {id: 1, title: '', year: '', description: ''}
])

const validationStore = useValidationStore()

//обработчик выбора категории
const handleCategorySelected = (selectedOption: SelectedOption) => {
  fetchRanks(selectedOption);
  fetchMedals(selectedOption);
};

//загрузка званий по выбранной категории
const fetchRanks = async (selectedOption: SelectedOption) => {
  try {
    const response = await axios.get('https://book-new.itlabs.top/api/military_ranks', {
      params: {
        category: selectedOption.value
      }
    });
    ranks.value = response.data as HeroRanks[];
    titles.value = ranks.value.map(rank => rank.title);
  } catch (error) {
    console.error('Ошибка при загрузке званий:', error);
    titles.value = [];
  }
};
//загрузка медалей по выбанной категории
const fetchMedals = async (selectedOption: SelectedOption) => {
  try {
    const response = await axios.get('https://book-new.itlabs.top/api/hero_awards', {
      params: {
        category: selectedOption.value
      }
    });
    medals.value = response.data as HeroMedals[];
    medalTitles.value = medals.value.map(medal => medal.title);
  }
  catch (error) {
    console.log(error)
    medalTitles.value = [];
  }
}
//объединяем все данные воедино
const preparePayload = () => {
  return {
    images: heroInfo.value.heroPhotos || [],
    archivePhotos: [
      ...heroInfo.value.archivePhotos.photo,
      ...heroInfo.value.archivePhotos.video,
    ],
    surname: heroInfo.value.surname,
    name: heroInfo.value.name,
    patronymic: heroInfo.value.patronymic,
    city: heroInfo.value.livePlace,
    category: heroInfo.value.category,
    militaryRank: heroInfo.value.rank,
    birthDateAt: formattedBirthDay.value,
    deathDateAt: formattedDeathDay.value,
    additional: heroInfo.value.description,
    surnameSender: sender.value.surname,
    nameSender: sender.value.name,
    patronymicSender: sender.value.patronymic,
    phone: sender.value.phone,
    heroAward: orders.value.map(order => ({
      id: order.id,
      title: order.title,
      yearAt: order.year,
      description: order.description
    })),
    institute: sender.value.organization || ''
  };
};

const heroBioRef = ref();
const heroOrdersRef = ref();
const senderInfoRef = ref();

//вызываем методы сброса в каждом компоненте
const resetFormInputs = () => {
  //вызов метода сброса полей для каждого компонента
  heroBioRef.value?.resetInputs();
  senderInfoRef.value?.resetInputs();
  heroOrdersRef.value?.resetInputs()
};

//запрос для создания героя
const handleCreateHero = async () => {
  //проверка валидации у каждого компонента
  const isBioValid = validationStore.validateHeroBio(heroInfo.value)
  const isOrdersValid = validationStore.validateHeroOrders(orders.value)
  const isSenderValid = validationStore.validateSenderInfo(sender.value)
  
  if (!isBioValid || !isOrdersValid || !isSenderValid) {
    scrollToFirstError()
    return
  }
  const postData = preparePayload();

  // Создаем FormData для multipart/form-data
  const formData = new FormData();

  // Добавляем простые текстовые поля
  formData.append('surname', postData.surname);
  formData.append('name', postData.name);
  formData.append('patronymic', postData.patronymic);
  formData.append('city', postData.city);
  formData.append('category', postData.category);
  formData.append('militaryRank', postData.militaryRank);
  formData.append('birthDateAt', postData.birthDateAt);
  formData.append('deathDateAt', postData.deathDateAt);
  formData.append('additional', postData.additional);
  formData.append('surnameSender', postData.surnameSender);
  formData.append('nameSender', postData.nameSender);
  formData.append('patronymicSender', postData.patronymicSender);
  formData.append('phone', postData.phone);
  formData.append('institute', postData.institute);
  formData.append('heroAward', JSON.stringify(postData.heroAward));
  postData.images.forEach((image, index) => {
    formData.append(`images[${index}]`, image);
  });
  postData.archivePhotos.forEach((file, index) => {
    formData.append(`archive[${index}]`, file);
  });

  try {
    const response = await axios.post(
      'https://book-new.itlabs.top/api/application_forms/add',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    resetFormInputs()
    validationStore.resetErrors();
  } catch (error) {
    console.log(error)
  }
};
//переход к перой ошибке
const scrollToFirstError = () => {
  nextTick(() => {
    const firstErrorElement = document.querySelector('.error')
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  })
}
//форматирование даты в одну строку
const formattedBirthDay = computed(() => {
  const { day, month, year } = heroInfo.value.birthDay;
  if (day && month && year) {
    return `${day} ${month} ${year}`;
  }
  return '';
});

const formattedDeathDay = computed(() => {
  const { day, month, year } = heroInfo.value.deathDay;
  if (day && month && year) {
    return `${day} ${month} ${year}`;
  }
  return '';
});
</script>

<style lang="scss" scoped>
@use 'root.scss' as *;
.main-page {

    .main-title {
        padding-bottom: 48px;
        border-bottom: 1px solid rgba(139, 135, 133, 1);
        margin: 0 auto;
        max-width: 1228px;
        display: flex;
        flex-direction: column;
        gap: 16px;
        h1 {
            font-size: 4rem;
        }
        h6 {
            font-size: 2rem;
            color: $gray-color;
            font-weight: 200;
        }
        span {
            font-size: 2rem;
            color: rgba(128, 1, 31, 1);
        }
    }
}

@media (max-width: 960px) {
    .main-page {
        .main-title {
            max-width: 896px;
            width: 100%;
            display: flex;
            flex-direction: column;
            padding-bottom: 32px;
            gap: 16px;
            h1 {
            font-size: 3rem;
            }
            h6, span {
                font-size: 1.5rem;
            }
        }
    }
}

@media (max-width: 360px) {
    .main-page {
        .main-title{
            max-width: 328px;
            width: 100%;
            display: flex;
            flex-direction: column;
            padding-bottom: 32px;
            gap: 16px;
            h1 {
            font-size: 2rem;
            }
            h6, span {
                font-size: 1rem;
            }
        }
    }
}
</style>