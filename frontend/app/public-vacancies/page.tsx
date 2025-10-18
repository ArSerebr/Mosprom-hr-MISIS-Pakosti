"use client";

import {
  Stack,
  Title,
  Paper,
  TextInput,
  Select,
  Group,
  Card,
  Text,
  Badge,
  Button,
  Modal,
  Textarea,
  Grid,
  FileInput,
  SimpleGrid,
} from "@mantine/core";
import {
  IconSearch,
  IconMapPin,
  IconCurrencyRubel,
  IconBriefcase,
  IconUpload,
  IconFileText,
} from "@tabler/icons-react";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

// Моковые данные опубликованных вакансий
const mockVacancies = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "ТехКомпания",
    location: "Москва",
    employmentType: "Полная занятость",
    salary: "200 000 - 300 000 ₽",
    description: "Разработка современных веб-приложений на React и TypeScript",
    requirements: "React, TypeScript, 5+ лет опыта",
    publishedAt: "2025-10-15",
  },
  {
    id: 2,
    title: "Product Manager",
    company: "Стартап АБВ",
    location: "Москва",
    employmentType: "Полная занятость",
    salary: "250 000 - 350 000 ₽",
    description: "Управление продуктовой командой и стратегией развития",
    requirements: "Опыт в продуктовом менеджменте 3+ года",
    publishedAt: "2025-10-14",
  },
  {
    id: 3,
    title: "UX/UI Designer",
    company: "Дизайн Студия",
    location: "Удаленно",
    employmentType: "Полная занятость",
    salary: "150 000 - 220 000 ₽",
    description: "Проектирование пользовательских интерфейсов",
    requirements: "Figma, опыт 2+ года, портфолио обязательно",
    publishedAt: "2025-10-13",
  },
  {
    id: 4,
    title: "Backend Developer",
    company: "ТехКомпания",
    location: "Москва",
    employmentType: "Полная занятость",
    salary: "180 000 - 280 000 ₽",
    description: "Разработка серверной части приложений",
    requirements: "Python/FastAPI, PostgreSQL, 3+ года опыта",
    publishedAt: "2025-10-12",
  },
];

export default function PublicVacanciesPage() {
  const [vacancies] = useState(mockVacancies);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState<string | null>("all");
  const [selectedVacancy, setSelectedVacancy] = useState<any>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [responseType, setResponseType] = useState<"file" | "form">("file");

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      position: "",
      experience: "",
      education: "",
      skills: "",
      about: "",
      coverLetter: "",
      resumeFile: null as File | null,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Некорректный email"),
    },
  });

  const handleResponse = (vacancy: any) => {
    setSelectedVacancy(vacancy);
    form.reset();
    open();
  };

  const handleSubmit = (values: typeof form.values) => {
    if (responseType === "file" && !values.resumeFile) {
      notifications.show({
        title: "Ошибка",
        message: "Пожалуйста, загрузите резюме",
        color: "red",
      });
      return;
    }

    // Здесь будет отправка на backend
    notifications.show({
      title: "Успешно",
      message: "Ваш отклик отправлен работодателю",
      color: "green",
    });
    close();
  };

  const filteredVacancies = vacancies.filter((vacancy) => {
    const matchesSearch =
      vacancy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vacancy.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation =
      locationFilter === "all" || vacancy.location === locationFilter;
    return matchesSearch && matchesLocation;
  });

  return (
    <Stack gap="lg" p="md">
      <div>
        <Title order={1}>Каталог вакансий</Title>
        <Text c="dimmed" mt="xs">
          Найдите работу мечты в лучших компаниях
        </Text>
      </div>

      {/* Поиск и фильтры */}
      <Paper p="md" radius="md" withBorder>
        <Group>
          <TextInput
            placeholder="Поиск по названию или компании..."
            leftSection={<IconSearch size={18} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Локация"
            data={[
              { value: "all", label: "Все" },
              { value: "Москва", label: "Москва" },
              { value: "Удаленно", label: "Удаленно" },
            ]}
            value={locationFilter}
            onChange={setLocationFilter}
            w={200}
          />
        </Group>
      </Paper>

      {/* Список вакансий */}
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        {filteredVacancies.map((vacancy) => (
          <Card key={vacancy.id} padding="lg" radius="md" withBorder>
            <Stack gap="md">
              <div>
                <Group justify="space-between" mb="xs">
                  <Text fw={700} size="lg">
                    {vacancy.title}
                  </Text>
                  <Badge variant="light" color="green">
                    Активна
                  </Badge>
                </Group>
                <Text fw={500} c="dimmed">
                  {vacancy.company}
                </Text>
              </div>

              <Stack gap="xs">
                <Group gap="xs">
                  <IconMapPin size={16} />
                  <Text size="sm">{vacancy.location}</Text>
                </Group>
                <Group gap="xs">
                  <IconCurrencyRubel size={16} />
                  <Text size="sm">{vacancy.salary}</Text>
                </Group>
                <Group gap="xs">
                  <IconBriefcase size={16} />
                  <Text size="sm">{vacancy.employmentType}</Text>
                </Group>
              </Stack>

              <Text size="sm" lineClamp={3}>
                {vacancy.description}
              </Text>

              <Button
                fullWidth
                onClick={() => handleResponse(vacancy)}
                variant="light"
              >
                Откликнуться
              </Button>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>

      {/* Модальное окно отклика */}
      <Modal
        opened={opened}
        onClose={close}
        title={`Отклик на вакансию: ${selectedVacancy?.title}`}
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Select
              label="Способ отклика"
              description="Выберите, как вы хотите откликнуться"
              data={[
                { value: "file", label: "Загрузить резюме (файл)" },
                { value: "form", label: "Заполнить анкету на платформе" },
              ]}
              value={responseType}
              onChange={(value) => setResponseType(value as "file" | "form")}
            />

            {responseType === "file" ? (
              <>
                <FileInput
                  label="Резюме"
                  placeholder="Выберите файл"
                  accept=".pdf,.doc,.docx"
                  leftSection={<IconUpload size={18} />}
                  required
                  {...form.getInputProps("resumeFile")}
                />
                <Textarea
                  label="Сопроводительное письмо (опционально)"
                  placeholder="Расскажите, почему вы подходите на эту позицию..."
                  minRows={4}
                  {...form.getInputProps("coverLetter")}
                />
              </>
            ) : (
              <>
                <TextInput
                  label="ФИО"
                  placeholder="Иван Иванов"
                  required
                  {...form.getInputProps("name")}
                />
                <Grid>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Email"
                      placeholder="ivan@email.com"
                      type="email"
                      required
                      {...form.getInputProps("email")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Телефон"
                      placeholder="+7 (999) 123-45-67"
                      required
                      {...form.getInputProps("phone")}
                    />
                  </Grid.Col>
                </Grid>
                <Grid>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Желаемая позиция"
                      placeholder="Frontend Developer"
                      required
                      {...form.getInputProps("position")}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Опыт работы"
                      placeholder="5 лет"
                      required
                      {...form.getInputProps("experience")}
                    />
                  </Grid.Col>
                </Grid>
                <TextInput
                  label="Образование"
                  placeholder="МГУ, Прикладная математика"
                  required
                  {...form.getInputProps("education")}
                />
                <TextInput
                  label="Навыки (через запятую)"
                  placeholder="React, TypeScript, Next.js"
                  required
                  {...form.getInputProps("skills")}
                />
                <Textarea
                  label="О себе"
                  placeholder="Расскажите о себе и своем опыте..."
                  minRows={3}
                  required
                  {...form.getInputProps("about")}
                />
              </>
            )}

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={close}>
                Отмена
              </Button>
              <Button type="submit">Отправить отклик</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
