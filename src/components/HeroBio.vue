<template>
    <div class="hero-bio">
      <div class="bio-wrapp">
        <div class="hero-main-info container">
          <div class="direction-wrapper">
            <div class="hero-title">
              <div
                class="hero-img"
                @dragover.prevent="onDragOver"
                @dragleave="onDragLeave"
                @drop.prevent="onDrop"
              >
                <img v-if="currentPhoto" :src="getFileUrl(currentPhoto)" alt="Загруженное фото" />
                <div v-else class="placeholder-img">
                  <div class="placeholder-body">
                    <img src="../assets/img/photo.svg" alt="" />
                    <span>Перетащите фото сюда</span>
                    <h6>Рекомендуемый размер фотографии 400х400</h6>
                  </div>
                </div>
                <div v-if="photos.length > 1" class="photo-navigation">
                  <button @click="prevPhoto" class="nav-btn left">
                    <img src="../assets/img/left.svg" alt="" />
                  </button>
                  <button @click="nextPhoto" class="nav-btn right">
                    <img src="../assets/img/right.svg" alt="" />
                  </button>
                </div>
              </div>
              <div class="add-img">
                <Button @click="triggerFileInput" :disabled="photos.length === 10">Загрузить фото</Button>
                <DeleteBtn @click="deleteCurrentPhoto" v-if="currentPhoto"></DeleteBtn>
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  multiple
                  @change="handleFileUpload"
                  class="hidden"
                />
              </div>
              <span>Можно загрузить до 10 шт. Разрешённые типы файлов: .jpg .png .gif</span>
            </div>
            <div class="hero-inputs">
              <div class="first-column">
                <div class="row">
                  <Input 
                  :externalError="validationStore.errors.heroBio.surname"
                  :isRequired="!isRequired" 
                  placeholderText="Константинопольская" 
                  v-model="heroInfo.surname">Фамилия</Input>
                  <Input 
                  :externalError="validationStore.errors.heroBio.name"
                  :isRequired="!isRequired" 
                  placeholderText="Александра" 
                  v-model="heroInfo.name">Имя</Input>
                </div>
                <div class="row">
                  <Input placeholderText="Александровна" v-model="heroInfo.patronymic">Отчество</Input>
                  <Input placeholderText="Ижевск" v-model="heroInfo.livePlace">Место рождения</Input>
                </div>
              </div>
              <div class="row" v-if="width >= 1000">
                <Select 
                :externalError="validationStore.errors.heroBio.category"
                :isRequired="!isRequired" 
                placeholderText="Герой Великой Отечественной Войны" 
                :options="categoryOptions" 
                :tooltipText="tipText"
                @option="handleSelectedOption"
                v-model="heroInfo.category"
                >
                  Категория героя
                </Select>
                <Select :tooltipText="tipText" :options="titles" v-model="heroInfo.rank">Воинское звание</Select>
              </div>
              <div class="date-inputs" v-if="width >= 1000">
                <div class="date-row">
                  <label for="">Дата рождения</label>
                  <div class="row-input">
                    <Select :options="dayOptions" v-model="heroInfo.birthDay.day"></Select>
                    <Select :options="monthOptions" v-model="heroInfo.birthDay.month"></Select>
                    <Select placeholderText="Год" :options="yearOptions" v-model="heroInfo.birthDay.year"></Select>
                  </div>
                </div>
                <div class="date-row">
                  <label for="">Дата смерти</label>
                  <div class="row-input">
                    <Select :options="dayOptions" v-model="heroInfo.deathDay.day"></Select>
                    <Select :options="monthOptions" v-model="heroInfo.deathDay.month"></Select>
                    <Select placeholderText="Год" :options="yearOptions" v-model="heroInfo.deathDay.year"></Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row responsive-row" v-if="width < 1000 && width >= 360">
            <Select
             :externalError="validationStore.errors.heroBio.category"
             :isRequired="!isRequired"
             :options="categoryOptions" 
             placeholderText="Герой Великой Отечественной Войны" 
             :tooltipText="tipText"
             @option="handleSelectedOption"
             v-model="heroInfo.category"
             >
             Категория героя
            </Select>
            <Select :tooltipText="tipText" :options="titles" v-model="heroInfo.rank">Воинское звание</Select>
          </div>
          <div class="date-inputs" v-if="width < 1000 && width >= 360">
            <div class="date-row">
              <label for="">Дата рождения</label>
              <div class="row-input">
                <Select :options="dayOptions" v-model="heroInfo.birthDay.day"></Select>
                <Select :options="monthOptions" v-model="heroInfo.birthDay.month"></Select>
                <Select placeholderText="Год" :options="yearOptions" v-model="heroInfo.birthDay.year"></Select>
              </div>
            </div>
            <div class="date-row">
              <label for="">Дата смерти</label>
              <div class="row-input">
                <Select :options="dayOptions" v-model="heroInfo.deathDay.day"></Select>
                <Select :options="monthOptions" v-model="heroInfo.deathDay.month"></Select>
                <Select placeholderText="Год" :options="yearOptions" v-model="heroInfo.deathDay.year"></Select>
              </div>
            </div>
          </div>
          <Textarea placeholderText="Биография и другие сведения" :tooltipText="tipText" v-model="heroInfo.description">Дополнительные сведения</Textarea>
          <div class="picture-list">
            <div class="list-wrapp">
              <label for="">Материалы архива</label>
              <span>Можно загрузить до 10 шт. Разрешённые типы файлов: .jpg .png .gif .mp4 . Максимальный размер фото: 8 МБ, видео: 100МБ.</span>
              <div class="list">
                <div
                  class="picture-add"
                  @click="triggerArchiveFileInput"
                  :class="{ 'disabled': archivePhotos.length === 10 }"
                >
                  <img src="../assets/img/photo.svg" alt="" />
                </div>
                <input
                  ref="archiveFileInput"
                  type="file"
                  accept="image/*, video/*"
                  multiple
                  @change="handleArchiveFileUpload"
                  class="hidden"
                />
                <div class="scroll-container">
                  <div
                    class="picture-card"
                    v-for="(archivePhoto, index) in archivePhotos"
                    :key="'photo-' + index"
                  >
                    <img
                      src="../assets/img/delete.svg"
                      alt="Удалить"
                      class="delete-btn"
                      @click="deleteArchivePhoto(index)"
                    />
                    <div class="card-img">
                      <img :src="getFileUrl(archivePhoto)" alt="Архивное фото" />
                    </div>
                  </div>
                  <div
                    class="picture-card"
                    v-for="(archiveVideo, index) in archiveVideos"
                    :key="'video-' + index"
                    
                  >
                    <img
                      src="../assets/img/delete.svg"
                      alt="Удалить"
                      class="delete-btn"
                      @click="deleteArchiveVideo(index)"
                    />
                    <div class="card-img">
                      <video :src="getFileUrl(archiveVideo)" controls @click="openModal(getFileUrl(archiveVideo))"></video>
                    </div>
                  </div>
                  <div class="shadow"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="border"></div>
        </div>
      </div>
    </div>
    <div v-if="isModalVisible" class="modal" @click.self="closeModal">
        <div class="modal-content">
            <button class="close-btn" @click="closeModal">
                <img src="../assets/img/delete.svg" alt="Закрыть" />
            </button>
            <video :src="selectedVideo || undefined" controls autoplay></video>
        </div>
    </div>
    <Popup @close="closePopup" :isShow="isShow" :isSpecial="isSpecial"></Popup>
</template>
  
<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useValidationStore } from '../store/validationStore';
import Popup from './UI/Popup.vue';
import Button from './UI/Button.vue';
import DeleteBtn from './UI/DeleteBtn.vue';
import Input from './UI/Input.vue';
import Select from './UI/Select.vue';
import Textarea from './UI/Textarea.vue';
const tipText = ref('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.')
const isRequired = ref(false)
const width = ref(window.innerWidth)
const isShow = ref(false)
const isSpecial = ref(false)
const isDragging = ref(false);
const monthOptions = ref([
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
]);
const dayOptions = ref([...Array(31).keys()].map(i => (i + 1).toString()));
const yearOptions = ref([...Array(2000 - 1800).keys()].map(i => (1800 + i).toString()));
// Нижний блок загрузки архивных материалов
const archiveFileInput = ref<HTMLInputElement | null>(null);
const currentIndex = ref(0); // Текущий индекс
const isModalVisible = ref(false);
const selectedVideo = ref<string | null>(null);
const photos = ref<File[]>([]);
const archivePhotos = ref<File[]>([]);
const archiveVideos = ref<File[]>([]);
const validationStore = useValidationStore()
interface HeroInfo {
  surname: string;
  name: string;
  patronymic: string;
  livePlace: string;
  category: string;
  rank: string;
  birthDay: { day: string; month: string; year: string };
  deathDay: { day: string; month: string; year: string };
  description: string;
  heroPhotos: File[]; // Теперь храним File объекты
  archivePhotos: { photo: File[]; video: File[] };
}
const props = defineProps({
  categoryOptions: {
    type: Array as () => string[],
    required: true
  },
  titles: {
    type: Array as () => string[],
    default: () => []
  },
  modelValue: {
    type: Object as () => HeroInfo,
    required: true
  }
});

const emit = defineEmits(['category-selected', 'update:modelValue']);
const heroInfo = ref({ ...props.modelValue });

type SelectedOption = {
  value: string
}

const closePopup = () => {
  isShow.value = false
  isSpecial.value = false
  heroInfo.value.category = ''
}

const openPopup = () => {
  isShow.value = true
  isSpecial.value = true
}

const handleSelectedOption = (selectedOption: SelectedOption) => {
  emit('category-selected', selectedOption);
};

const resizeWidth = () => {
  width.value = window.innerWidth
}
  
const onDragOver = () => {
  isDragging.value = true;
};
  
const onDragLeave = () => {
  isDragging.value = false;
};

//загрузка фото перетаскиванием
const onDrop = (event: DragEvent) => {
  isDragging.value = false;
  
  if (event.dataTransfer?.files) {
    const newPhotos = Array.from(event.dataTransfer.files)
      .slice(0, 10 - photos.value.length)
      .map(file => file); // Сохраняем сам файл
    
    photos.value.push(...newPhotos);
    heroInfo.value.heroPhotos = [...photos.value];
  }
};

//ыычисляемое свойство для текущего фото
const currentPhoto = computed(() => photos.value[currentIndex.value] || null);
  
//триггер для открытия диалога выбора файлов (верхний блок)
const fileInput = ref<HTMLInputElement | null>(null);
const triggerFileInput = () => fileInput.value?.click();
  
//обработка загрузки файлов (верхний блок)
const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files) return;
  
  const newPhotos = Array.from(input.files)
    .slice(0, 10 - photos.value.length)
    .map(file => file);
  
  photos.value.push(...newPhotos);
  heroInfo.value.heroPhotos = [...photos.value];
};
  
//удаление текущего фото (верхний блок)
const deleteCurrentPhoto = () => {
  if (photos.value.length === 0) return;
  
  photos.value.splice(currentIndex.value, 1);
  heroInfo.value.heroPhotos = [...photos.value];
  if (currentIndex.value >= photos.value.length) {
    currentIndex.value = Math.max(photos.value.length - 1, 0);
    
  }
};
  
//переключение фото (верхний блок)
const nextPhoto = () => {
  if (photos.value.length > 0) {
    currentIndex.value = (currentIndex.value + 1) % photos.value.length;
  }
};
const prevPhoto = () => {
  if (photos.value.length > 0) {
    currentIndex.value = (currentIndex.value - 1 + photos.value.length) % photos.value.length;
  }
};

const triggerArchiveFileInput = () => {
  if (archivePhotos.value.length < 10) {
    archiveFileInput.value?.click();
  }
};
  

//загрузка архивных файлов (нижний блок)
const handleArchiveFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files) return;

  Array.from(input.files).forEach(file => {
    if (isImageFile(file) && archivePhotos.value.length < 10) {
        archivePhotos.value.push(file);
        heroInfo.value.archivePhotos.photo = [...archivePhotos.value];
    } else if (isVideoFile(file) && archiveVideos.value.length < 10) {
        archiveVideos.value.push(file);
        heroInfo.value.archivePhotos.video = [...archiveVideos.value];
    }
  });
};

//удаление фото архива
const deleteArchivePhoto = (index: number) => {
  URL.revokeObjectURL(getFileUrl(archivePhotos.value[index])); // Освобождаем память
  archivePhotos.value.splice(index, 1);
  heroInfo.value.archivePhotos.photo = [...archivePhotos.value];
};

//удаление видео врхива
const deleteArchiveVideo = (index: number) => {
  URL.revokeObjectURL(getFileUrl(archiveVideos.value[index])); // Освобождаем память
  archiveVideos.value.splice(index, 1);
  heroInfo.value.archivePhotos.video = [...archiveVideos.value];
};
  
const isImageFile = (file: File): boolean => {
  return file.type.startsWith("image/");
};

const isVideoFile = (file: File): boolean => {
  return file.type.startsWith("video/");
};


const openModal = (videoUrl: string) => {
  selectedVideo.value = videoUrl;
  isModalVisible.value = true;
};

const closeModal = () => {
  selectedVideo.value = null;
  isModalVisible.value = false;
};

const getFileUrl = (file: File) => {
  return URL.createObjectURL(file);
};

const resetInputs = () => {
  // Сохраняем текущие файлы отдельно
  const currentHeroPhotos = [...heroInfo.value.heroPhotos];
  const currentArchivePhotos = {...heroInfo.value.archivePhotos};
  
  // Сбрасываем все текстовые поля
  heroInfo.value = {
    surname: '',
    name: '',
    patronymic: '',
    livePlace: '',
    category: '',
    rank: '',
    birthDay: { day: '', month: '', year: '' },
    deathDay: { day: '', month: '', year: '' },
    description: '',
    // Сохраняем файловые поля без изменений
    heroPhotos: currentHeroPhotos,
    archivePhotos: currentArchivePhotos
  };
  
  // Очищаем превью файлов
  photos.value = [];
  archivePhotos.value = [];
  archiveVideos.value = [];
  currentIndex.value = 0;
  
  // Сбрасываем файловые инпуты
  if (fileInput.value) fileInput.value.value = '';
  if (archiveFileInput.value) archiveFileInput.value.value = '';
  
  // Очищаем файлы в heroInfo (если нужно полное сброс)
  heroInfo.value.heroPhotos = [];
  heroInfo.value.archivePhotos = { photo: [], video: [] };
};

onMounted(() => {
  window.addEventListener('resize', resizeWidth)
})
  
onUnmounted(() => {
  window.removeEventListener('resize', resizeWidth)
})

watch(heroInfo, (newValue: HeroInfo) => {
  emit('update:modelValue', newValue);
}, { deep: true });

watch(
  () => heroInfo.value.category,
  (newCategory) => {
    if (newCategory?.includes("Герои Специальной Военной Операции")) {
      openPopup();
    }
  }
);

defineExpose({ resetInputs });
</script>

<style lang="scss" scoped>
@use '../root.scss' as *;
.border {
    border-bottom: 1px solid $placeholder;
    padding-bottom: 48px;
}
.hero-bio {
    margin-top: 48px;
}
.hero-main-info {
    display: flex;
    gap: 20px;
    flex-direction: column;
    padding-top: 0;
    padding-bottom: 0;
    .direction-wrapper {
        display: flex;
        gap: 20px;
    }
    .hero-title {
        max-width: 396px;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 24px;
        span {
            color: rgba(70, 68, 68, 1);
        }
        .hero-img {
            position: relative;
            width: 100%;
            height: 396px;
            background-image: url("data:image/svg+xml;utf8,<svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' ry='8' style='fill: none; stroke: black; stroke-width: 1; stroke-dasharray: 10 8'/></svg>");
            border: none;
            display: flex;
            justify-content: center;
            border-radius: 8px;
            overflow: hidden;
            img {
                max-width: 100%;
                max-height: 100%;
                object-fit: cover;
            }
            .placeholder-img {
                font-size: 18px;
                color: #999;
                .placeholder-body {
                    display: flex;
                flex-direction: column;
                align-items: center;
                height: 100%;
                justify-content: center;
                gap: 16px;
                text-align: center;
                    img {
                        width: 68px;
                    }
                }
            }

            .photo-navigation {
                position: absolute;
                width: 100%;
                display: flex;
                justify-content: space-between;
                top: 50%;
                transform: translateY(-50%);
            }

            .nav-btn {
                color: #fff;
                background: transparent;
                border: none;
                border-radius: 50%;
                width: 48px;
                height: 48px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            }
        }
        .add-img {
            display: flex;
            align-items: center;
            gap: 20px;
        }
    }
    .hero-inputs {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 24px;
        .first-column {
            gap: 24px;
        }
        .row {
            display: flex;
            gap: 20px;
        }
        .date-inputs {
            display: flex;
            gap: 20px;
            margin-top: 33px;
            .date-row {
                display: flex;
                flex-direction: column;
                width: 100%;
                label {
                    font-size: 24px;
                }
                .row-input {
                    display: flex;
                    gap: 8px;
                    .custom-select:nth-child(2) {
                        max-width: 158px;
                        width: 100%;
                    }
                    .custom-select {
                        width: 114px;
                    }
                }
            }
        }
    }
    .picture-list {
        .list-wrapp {
            display: flex;
            flex-direction: column;
            gap: 16px;
            label {
            font-size: 24px;
            }
            span {
            color: $gray-color;
            font-size: 16px;
            }
            .list {
            display: flex;
            gap: 20px;
            align-items: center;
                .picture-add {
                    max-width: 144px;
                    width: 100%;
                    height: 144px;
                    background-image: url("data:image/svg+xml;utf8,<svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' ry='8' style='fill: none; stroke: black; stroke-width: 1; stroke-dasharray: 5, 5'/></svg>");
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor:pointer;
                }
                .scroll-container {
                display: flex;
                gap: 20px;
                overflow-x: auto;
                padding-bottom: 20px;
                padding-top: 20px;
                width: 100%;
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
                .picture-card {
                    min-width: 144px;
                    width: 144px;
                    height: 144px;
                    position: relative;
                    img {
                        position: absolute;
                        z-index: 2;
                        right: -16px;
                        top: -16px;
                    }
                    .delete-btn {
                        cursor:pointer;
                        img {
                            width: 100%;
                            height: 100%;
                        }
                }
                    .card-img {
                        width: 100%;
                        height: 100%;
                        overflow: hidden;
                        border-radius: 8px;
                        position: relative;
                        img, 
                        video {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                            position: absolute;
                            z-index: 1;
                            top: 0;
                            left: 0;
                        }
                    }
                }
            }
        }
    }
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  .modal-content {
    position: relative;
    max-width: 90%;
    max-height: 90%;
    background: transparent;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
    video {
      width: 100%;
      height: 100%;
      padding: 40px;
    }
    .close-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      background: none;
      border: none;
      cursor: pointer;
      z-index: 10;
      img {
        width: 24px;
        height: 24px;
      }

      &:hover {
        opacity: 0.8;
      }
    }
  }
}

@media (max-width: 1920px) {
    .first-column {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
}

@media (max-width: 999px) {
.border {
    padding-bottom: 48px;
}
.hero-main-info {
    .hero-title {
        max-width: 436px;

        .hero-img {
            height: 436px;
        }
    }
}
    .hero-inputs{
        max-width: 436px;
        width: 100%;
        .first-column {
            display: flex;
            flex-direction: column;
            gap: 33px;
            .row {
                display: flex;
                flex-direction: column;
                gap: 27px;
            }
        }
    }
    .responsive-row {
        display: flex;
        gap: 20px;

        .custom-select {
          height: 112px;
          justify-content: space-between;
        }
        .input {
            max-width: 436px;
            width: 100%;
        }
    }
    .date-inputs {
        display: flex;
        gap: 20px;
        .date-row {
            display: flex;
            flex-direction: column;
            max-width: 436px;
            width: 100%;
            label {
                font-size: 20px;
            }
            .row-input {
                display: flex;
                gap: 8px;
                .custom-select:nth-child(2) {
                    max-width: 190px;
                    width: 100%;
                }
                .custom-select:nth-child(3) {
                    max-width: 124px;
                    width: 100%;
                }
                .custom-select {
                    width: 106px;
                }
            }
        }
    }
}
.hidden {
  display: none;
}

.scroll-container {
  .shadow {
    width: 58px;
    right: 0;
    height: 144px;
    background: linear-gradient(90deg, rgba(242, 229, 204, 0) 0%, #F2E5CC 100%);
    position: absolute;
    z-index: 1;
  }
}

@media (max-width: 640px) {
  .date-inputs {
    flex-direction: column;
    .date-row {
      width: 100%;
    }
  }
}

@media (max-width: 545px) {
  .responsive-row {
    flex-direction: column;
    .custom-select {
      max-width: 100%;
    }
  }
}

@media (max-width: 360px) {
.border {
    padding-bottom: 32px;
}
    .hero-main-info {
        .hero-title {
            .hero-img {
                height: 328px;
            }
        }
        .direction-wrapper {
            flex-direction: column;
        }
        .responsive-row {
            flex-direction: column;
        }
        .date-inputs {
            flex-direction: column;
            .row-input {
                .custom-select:nth-child(2) {
                    min-width: 125px;
                    width: 100%;
                }
                .custom-select:nth-child(3) {
                    min-width: 100px;
                    width: 100%;
                }
                .custom-select {
                    min-width: 87px;
                }
            }
        }
    }
}
</style>