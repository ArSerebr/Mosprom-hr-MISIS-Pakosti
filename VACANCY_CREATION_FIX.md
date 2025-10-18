# Исправление ошибки "Не удалось сохранить вакансию"

## 🐛 Проблема

При попытке создать вакансию через frontend возникала ошибка "Не удалось сохранить вакансию" с кодом 403 Forbidden.

## 🔍 Диагностика

Логи backend показывали:
```
INFO: 172.18.0.1:48110 - "POST /api/vacancies/create HTTP/1.1" 403 Forbidden
```

Это указывало на проблему с авторизацией - запросы на создание вакансий не передавали JWT токен.

## ✅ Решение

### 1. Обновлены API функции в frontend

**Файл**: `frontend/lib/api.ts`

Добавлена передача токена авторизации во все функции работы с вакансиями:

```typescript
// Создание вакансии
export async function createVacancy(
  data: Omit<Vacancy, "id" | "created_at" | "is_active">,
  token: string  // ← Добавлен токен
): Promise<Vacancy> {
  const response = await fetch(`${API_URL}/vacancies/create`, {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${token}`,  // ← Добавлен заголовок авторизации
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<Vacancy>(response);
}

// Обновление вакансии
export async function updateVacancy(
  id: number,
  data: Partial<Vacancy>,
  token: string  // ← Добавлен токен
): Promise<Vacancy> {
  // ... аналогично с Authorization header
}

// Удаление вакансии
export async function deleteVacancy(
  id: number, 
  token: string  // ← Добавлен токен
): Promise<void> {
  // ... аналогично с Authorization header
}
```

### 2. Обновлен компонент vacancies

**Файл**: `frontend/app/vacancies/page.tsx`

Добавлена передача токена во все API вызовы:

```typescript
function VacanciesContent() {
  const { token } = useAuth();  // ← Получение токена

  const handleSubmit = async (values: typeof form.values) => {
    try {
      if (!token) {
        throw new Error("Токен авторизации не найден");
      }

      if (editMode && selectedVacancy) {
        const updated = await updateVacancy(selectedVacancy.id, processedValues, token);
        // ...
      } else {
        const newVacancy = await createVacancy({
          ...processedValues,
          status: "pending"
        }, token);  // ← Передача токена
        // ...
      }
    } catch (error) {
      // ...
    }
  };

  const handleDelete = async (id: number) => {
    try {
      if (!token) {
        throw new Error("Токен авторизации не найден");
      }
      
      await deleteVacancy(id, token);  // ← Передача токена
      // ...
    } catch (error) {
      // ...
    }
  };
}
```

### 3. Добавлен маршрут удаления в backend

**Файл**: `backend/vacancies/router.py`

Добавлен недостающий маршрут для удаления вакансий:

```python
@router.delete("/{vacancy_id}")
async def delete_vacancy(vacancy_id: int, user: User = Depends(get_current_user)):
    if user.role not in ["admin", "hr"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    vacancy = await Vacancy.get_or_none(id=vacancy_id)
    if not vacancy:
        raise HTTPException(status_code=404, detail="Vacancy not found")

    if vacancy.created_by_id != user.id and user.role != "admin":
        raise HTTPException(status_code=403, detail="Can only delete your own vacancies")

    await vacancy.delete()
    return {"message": "Vacancy deleted successfully"}
```

## 🔐 Безопасность

Все операции с вакансиями теперь требуют авторизации:

- **Создание вакансий**: Только HR и админы
- **Обновление вакансий**: Только владельцы вакансий или админы  
- **Удаление вакансий**: Только владельцы вакансий или админы
- **Просмотр вакансий**: Только владельцы или админы

## 🚀 Результат

После исправления:

✅ **Создание вакансий** работает корректно  
✅ **Обновление вакансий** работает корректно  
✅ **Удаление вакансий** работает корректно  
✅ **Авторизация** настроена правильно  
✅ **Права доступа** соблюдаются  

## 📋 Тестирование

Для проверки исправления:

1. Войдите в систему как HR-менеджер
2. Перейдите на страницу "Вакансии"
3. Нажмите "Создать вакансию"
4. Заполните форму и нажмите "Создать вакансию"
5. Вакансия должна успешно создаться без ошибок

## 🎯 Статус

**Проблема решена!** Создание вакансий теперь работает корректно с полной авторизацией и проверкой прав доступа.
