import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface ValidationErrors {
  heroBio: {
    surname: boolean
    name: boolean
    category: boolean
  }
  heroOrders: Record<string, {
    title: boolean
  }>
  senderInfo: {
    patronymic: boolean
    name: boolean
    phone: boolean
    organization: boolean
  }
}

export const useValidationStore = defineStore('validation', () => {
  const errors = ref<ValidationErrors>({
    heroBio: {
      surname: false,
      name: false,
      category: false,
    },
    heroOrders: {},
    senderInfo: {
      name: false,
      patronymic: false,
      phone: false,
      organization: false
    }
  })

  
  //сброс ошибок
  const resetErrors = () => {
    Object.values(errors.value).forEach(component => {
      Object.keys(component).forEach(field => {
        ;(component as Record<string, boolean>)[field] = false
      })
    })
  }

  const isValid = computed(() => {
  // Проверяем heroBio
  const bioValid = !Object.values(errors.value.heroBio).some(Boolean);
  
  // Проверяем heroOrders
  const ordersValid = !Object.values(errors.value.heroOrders).some(
    order => order.title
  );
  
  // Проверяем senderInfo
  const senderValid = !Object.values(errors.value.senderInfo).some(Boolean);
  
  return bioValid && ordersValid && senderValid;
});

  const validateHeroBio = (bio: any) => {
    const newErrors = {
      surname: !bio.surname,
      name: !bio.name,
      category: !bio.category
    }
    errors.value.heroBio = newErrors
    return !Object.values(newErrors).some(error => error)
  }
  
  const validateHeroOrders = (orders: any[]) => {
    const newErrors: Record<string, { title: boolean}> = {};
    let isValid = true;
    
    orders.forEach((order, index) => {
      const hasTitleError = !order.title;
      
      newErrors[`order_${index}`] = {
        title: hasTitleError
      };
      
      if (hasTitleError) isValid = false;
    });
    
    errors.value.heroOrders = newErrors;
    return isValid;
  }

  const validateSenderInfo = (sender: any) => {
    const newErrors = {
      name: !sender.name,
      patronymic: !sender.patronymic,
      phone: !sender.phone,
      organization: !sender.organization
    }
    errors.value.senderInfo = newErrors
    return !Object.values(newErrors).some(error => error)
  }

const isValidPhoneNumber = (phone: string) => {
  const phoneQuery = /^8\d{10}$/;
  return phoneQuery.test(phone.trim());
};

  return { 
    errors, 
    resetErrors, 
    isValid,
    validateHeroBio,
    validateHeroOrders,
    validateSenderInfo,
    isValidPhoneNumber
  }
})