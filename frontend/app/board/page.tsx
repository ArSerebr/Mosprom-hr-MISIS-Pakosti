'use client';

import React, { useState, useCallback } from 'react';
import {
  Container,
  Title,
  Button,
  Group,
  Stack,
  Paper,
  Text,
  Badge,
  ActionIcon,
  Modal,
  TextInput,
  Textarea,
  Select,
  Grid,
  Avatar,
  Card,
  SimpleGrid,
  ThemeIcon,
  Loader,
  Center,
  Alert,
} from '@mantine/core';
import {
  IconPlus,
  IconTrash,
  IconUser,
  IconMail,
  IconBriefcase,
  IconCalendar,
  IconStar,
  IconEdit,
  IconGripVertical,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { BoardCandidate, BoardColumn, CandidateStatus, Vacancy } from '@/types/board';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Примеры вакансий
const SAMPLE_VACANCIES: Vacancy[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'TechCorp',
    location: 'Москва',
    salary: '150,000 - 200,000 ₽',
  },
  {
    id: '2',
    title: 'Backend Developer',
    company: 'DataSoft',
    location: 'Санкт-Петербург',
    salary: '180,000 - 250,000 ₽',
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    company: 'CloudTech',
    location: 'Москва',
    salary: '200,000 - 300,000 ₽',
  },
  {
    id: '4',
    title: 'UI/UX Designer',
    company: 'DesignStudio',
    location: 'Казань',
    salary: '120,000 - 180,000 ₽',
  },
];

// Примеры кандидатов
const SAMPLE_CANDIDATES: BoardCandidate[] = [
  {
    id: '1',
    name: 'Алексей Петров',
    email: 'alexey@example.com',
    position: 'Frontend Developer',
    company: 'TechCorp',
    experience: '3 года',
    skills: ['React', 'TypeScript', 'Next.js'],
    status: 'new',
    createdAt: new Date('2024-01-15'),
    notes: 'Опытный разработчик с хорошим портфолио',
  },
  {
    id: '2',
    name: 'Мария Сидорова',
    email: 'maria@example.com',
    position: 'Backend Developer',
    company: 'DataSoft',
    experience: '5 лет',
    skills: ['Python', 'Django', 'PostgreSQL'],
    status: 'interview',
    createdAt: new Date('2024-01-14'),
    notes: 'Прошла техническое интервью, ждем результатов',
  },
  {
    id: '3',
    name: 'Дмитрий Козлов',
    email: 'dmitry@example.com',
    position: 'DevOps Engineer',
    company: 'CloudTech',
    experience: '4 года',
    skills: ['Docker', 'Kubernetes', 'AWS'],
    status: 'test',
    createdAt: new Date('2024-01-13'),
    notes: 'Выполняет тестовое задание',
  },
  {
    id: '4',
    name: 'Анна Волкова',
    email: 'anna@example.com',
    position: 'UI/UX Designer',
    company: 'DesignStudio',
    experience: '2 года',
    skills: ['Figma', 'Adobe XD', 'Sketch'],
    status: 'offer',
    createdAt: new Date('2024-01-12'),
    notes: 'Готово предложение о работе',
  },
  {
    id: '5',
    name: 'Сергей Морозов',
    email: 'sergey@example.com',
    position: 'Frontend Developer',
    company: 'TechCorp',
    experience: '6 лет',
    skills: ['Vue.js', 'Nuxt.js', 'JavaScript'],
    status: 'accepted',
    createdAt: new Date('2024-01-10'),
    notes: 'Принял предложение, начинаем 1 февраля',
  },
  {
    id: '6',
    name: 'Елена Соколова',
    email: 'elena@example.com',
    position: 'Backend Developer',
    company: 'TechCorp',
    experience: '4 года',
    skills: ['Node.js', 'Express', 'MongoDB'],
    status: 'rejected',
    createdAt: new Date('2024-01-08'),
    notes: 'Не подошел по техническим требованиям',
  },
];

// Конфигурация колонок
const COLUMNS: BoardColumn[] = [
  {
    id: 'new',
    title: 'Новый',
    candidates: [],
    color: 'blue',
  },
  {
    id: 'interview',
    title: 'Интервью',
    candidates: [],
    color: 'orange',
  },
  {
    id: 'test',
    title: 'Тестовое',
    candidates: [],
    color: 'yellow',
  },
  {
    id: 'offer',
    title: 'Оффер',
    candidates: [],
    color: 'purple',
  },
  {
    id: 'accepted',
    title: 'Принято',
    candidates: [],
    color: 'green',
  },
  {
    id: 'rejected',
    title: 'Отказ',
    candidates: [],
    color: 'red',
  },
];

export default function BoardPage() {
  const [candidates, setCandidates] = useState<BoardCandidate[]>(SAMPLE_CANDIDATES);
  const [vacancies] = useState<Vacancy[]>(SAMPLE_VACANCIES);
  const [opened, { open, close }] = useDisclosure(false);
  const [editingCandidate, setEditingCandidate] = useState<BoardCandidate | null>(null);
  const [activeCandidate, setActiveCandidate] = useState<BoardCandidate | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedVacancy, setSelectedVacancy] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Получаем уникальные компании
  const companies = Array.from(new Set(candidates.map(c => c.company)));

  // Фильтруем кандидатов по выбранным фильтрам
  const filteredCandidates = candidates.filter(candidate => {
    const matchesCompany = !selectedCompany || candidate.company === selectedCompany;
    const matchesVacancy = !selectedVacancy || candidate.position === selectedVacancy;
    return matchesCompany && matchesVacancy;
  });

  // Группируем отфильтрованных кандидатов по статусам
  const columns = COLUMNS.map(column => ({
    ...column,
    candidates: filteredCandidates.filter(candidate => candidate.status === column.id),
  }));

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      position: '',
      company: '',
      experience: '',
      skills: '',
      notes: '',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Имя должно содержать минимум 2 символа' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Некорректный email'),
      position: (value) => (value.length < 2 ? 'Должность должна содержать минимум 2 символа' : null),
      company: (value) => (value.length < 2 ? 'Компания должна содержать минимум 2 символа' : null),
    },
  });

  const handleAddCandidate = useCallback((values: typeof form.values) => {
    const newCandidate: BoardCandidate = {
      id: Date.now().toString(),
      name: values.name,
      email: values.email,
      position: values.position,
      company: values.company,
      experience: values.experience,
      skills: values.skills.split(',').map(s => s.trim()).filter(s => s),
      status: 'new',
      createdAt: new Date(),
      notes: values.notes,
    };

    setCandidates(prev => [...prev, newCandidate]);
    form.reset();
    close();
    
    notifications.show({
      title: 'Успешно',
      message: 'Кандидат добавлен',
      color: 'green',
    });
  }, [form, close]);

  const handleEditCandidate = useCallback((values: typeof form.values) => {
    if (!editingCandidate) return;

    const updatedCandidate: BoardCandidate = {
      ...editingCandidate,
      name: values.name,
      email: values.email,
      position: values.position,
      company: values.company,
      experience: values.experience,
      skills: values.skills.split(',').map(s => s.trim()).filter(s => s),
      notes: values.notes,
    };

    setCandidates(prev => prev.map(c => c.id === editingCandidate.id ? updatedCandidate : c));
    form.reset();
    close();
    setEditingCandidate(null);
    
    notifications.show({
      title: 'Успешно',
      message: 'Кандидат обновлен',
      color: 'green',
    });
  }, [editingCandidate, form, close]);

  const handleDeleteCandidate = useCallback((id: string) => {
    setCandidates(prev => prev.filter(c => c.id !== id));
    notifications.show({
      title: 'Успешно',
      message: 'Кандидат удален',
      color: 'green',
    });
  }, []);

  const handleMoveCandidate = useCallback((candidateId: string, newStatus: CandidateStatus) => {
    setCandidates(prev => prev.map(candidate => 
      candidate.id === candidateId 
        ? { ...candidate, status: newStatus }
        : candidate
    ));
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const candidate = candidates.find(c => c.id === active.id);
    setActiveCandidate(candidate || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCandidate(null);

    if (!over) return;

    const candidateId = active.id as string;
    const newStatus = over.id as CandidateStatus;

    if (newStatus && Object.values(COLUMNS).some(col => col.id === newStatus)) {
      handleMoveCandidate(candidateId, newStatus);
    }
  };

  const openEditModal = (candidate: BoardCandidate) => {
    setEditingCandidate(candidate);
    form.setValues({
      name: candidate.name,
      email: candidate.email,
      position: candidate.position,
      company: candidate.company,
      experience: candidate.experience,
      skills: candidate.skills.join(', '),
      notes: candidate.notes || '',
    });
    open();
  };

  return (
    <Container size="xl" py="md">
      <Group justify="space-between" mb="xl">
        <Title order={1}>Доска кандидатов</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={open} color="blue">
          Добавить кандидата
        </Button>
      </Group>

      {/* Боковое меню с фильтрами */}
      <Paper p="md" mb="md" radius="md" withBorder>
        <Group align="flex-start" gap="xl">
          <Stack gap="sm" style={{ minWidth: '200px' }}>
            <Text fw={600} size="sm">Фильтры</Text>
            
            <Select
              label="Компания"
              placeholder="Все компании"
              clearable
              value={selectedCompany}
              onChange={setSelectedCompany}
              data={companies.map(company => ({ value: company, label: company }))}
            />

            <Select
              label="Должность"
              placeholder="Все должности"
              clearable
              value={selectedVacancy}
              onChange={setSelectedVacancy}
              data={Array.from(new Set(candidates.map(c => c.position))).map(position => ({ value: position, label: position }))}
            />

            <Button 
              variant="light" 
              size="xs" 
              onClick={() => {
                setSelectedCompany(null);
                setSelectedVacancy(null);
              }}
            >
              Сбросить фильтры
            </Button>
          </Stack>

          <Stack gap="xs" style={{ flex: 1 }}>
            <Text fw={600} size="sm">Статистика</Text>
            <Group gap="md">
              <Badge color="blue" variant="light">
                Всего: {candidates.length}
              </Badge>
              <Badge color="green" variant="light">
                Активные: {candidates.filter(c => !['rejected', 'accepted'].includes(c.status)).length}
              </Badge>
              <Badge color="red" variant="light">
                Отказы: {candidates.filter(c => c.status === 'rejected').length}
              </Badge>
              <Badge color="green" variant="light">
                Приняты: {candidates.filter(c => c.status === 'accepted').length}
              </Badge>
            </Group>
          </Stack>
        </Group>
      </Paper>

      {/* Канбан доска */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 6 }} spacing="md">
          {columns.map((column) => (
            <ColumnContainer key={column.id} column={column}>
              <Group justify="space-between" mb="md">
                <Text fw={600} size="sm" c={column.color}>
                  {column.title}
                </Text>
                <Badge color={column.color} variant="light">
                  {column.candidates.length}
                </Badge>
              </Group>
              
              <SortableContext items={column.candidates.map(c => c.id)} strategy={verticalListSortingStrategy}>
                <Stack gap="sm">
                  {column.candidates.map((candidate) => (
                    <SortableCandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      onEdit={() => openEditModal(candidate)}
                      onDelete={() => handleDeleteCandidate(candidate.id)}
                    />
                  ))}
                </Stack>
              </SortableContext>
            </ColumnContainer>
          ))}
        </SimpleGrid>

        <DragOverlay>
          {activeCandidate ? (
            <CandidateCard
              candidate={activeCandidate}
              onEdit={() => {}}
              onDelete={() => {}}
              onMove={() => {}}
              isDragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Модальное окно для добавления/редактирования кандидата */}
      <Modal
        opened={opened}
        onClose={() => {
          close();
          setEditingCandidate(null);
          form.reset();
        }}
        title={editingCandidate ? 'Редактировать кандидата' : 'Добавить кандидата'}
        size="md"
      >
        <form onSubmit={form.onSubmit(editingCandidate ? handleEditCandidate : handleAddCandidate)}>
          <Stack gap="md">
            <TextInput
              label="Имя"
              placeholder="Иван Петров"
              required
              {...form.getInputProps('name')}
            />

            <TextInput
              label="Email"
              placeholder="ivan@example.com"
              required
              {...form.getInputProps('email')}
            />

            <TextInput
              label="Должность"
              placeholder="Frontend Developer"
              required
              {...form.getInputProps('position')}
            />

            <TextInput
              label="Компания"
              placeholder="TechCorp"
              required
              {...form.getInputProps('company')}
            />

            <TextInput
              label="Опыт работы"
              placeholder="3 года"
              {...form.getInputProps('experience')}
            />

            <TextInput
              label="Навыки"
              placeholder="React, TypeScript, Node.js"
              description="Разделите навыки запятыми"
              {...form.getInputProps('skills')}
            />

            <Textarea
              label="Заметки"
              placeholder="Дополнительная информация о кандидате"
              rows={3}
              {...form.getInputProps('notes')}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="outline" onClick={() => {
                close();
                setEditingCandidate(null);
                form.reset();
              }}>
                Отмена
              </Button>
              <Button type="submit">
                {editingCandidate ? 'Сохранить' : 'Добавить'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
}

// Компонент контейнера колонки
interface ColumnContainerProps {
  column: BoardColumn;
  children: React.ReactNode;
}

function ColumnContainer({ column, children }: ColumnContainerProps) {
  const { setNodeRef } = useSortable({
    id: column.id,
    data: {
      type: 'column',
      column,
    },
  });

  return (
    <Paper
      ref={setNodeRef}
      p="md"
      radius="md"
      withBorder
      style={{ minHeight: '500px' }}
    >
      {children}
    </Paper>
  );
}

// Компонент сортируемой карточки кандидата
interface SortableCandidateCardProps {
  candidate: BoardCandidate;
  onEdit: () => void;
  onDelete: () => void;
}

function SortableCandidateCard({ candidate, onEdit, onDelete }: SortableCandidateCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: candidate.id,
    data: {
      type: 'candidate',
      candidate,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CandidateCard
        candidate={candidate}
        onEdit={onEdit}
        onDelete={onDelete}
        onMove={() => {}}
        isDragging={isDragging}
      />
    </div>
  );
}

// Компонент карточки кандидата
interface CandidateCardProps {
  candidate: BoardCandidate;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (candidateId: string, newStatus: CandidateStatus) => void;
  isDragging?: boolean;
}

function CandidateCard({ candidate, onEdit, onDelete, isDragging = false }: CandidateCardProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <Card
      p="sm"
      radius="md"
      withBorder
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      style={{ 
        cursor: 'grab',
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'rotate(5deg)' : 'none',
      }}
    >
      <Stack gap="xs">
        <Group justify="space-between">
          <Group gap="xs">
            <Avatar size="sm" color="blue">
              {candidate.name.charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <Text size="sm" fw={500}>
                {candidate.name}
              </Text>
              <Text size="xs" c="dimmed">
                {candidate.position}
              </Text>
              <Text size="xs" c="dimmed">
                {candidate.company}
              </Text>
            </div>
          </Group>
          
          {showActions && !isDragging && (
            <Group gap="xs">
              <ActionIcon size="sm" variant="subtle" onClick={onEdit}>
                <IconEdit size={14} />
              </ActionIcon>
              <ActionIcon size="sm" variant="subtle" color="red" onClick={onDelete}>
                <IconTrash size={14} />
              </ActionIcon>
            </Group>
          )}
        </Group>

        <Group gap="xs">
          <IconMail size={12} />
          <Text size="xs" c="dimmed">
            {candidate.email}
          </Text>
        </Group>

        {candidate.experience && (
          <Group gap="xs">
            <IconBriefcase size={12} />
            <Text size="xs" c="dimmed">
              {candidate.experience}
            </Text>
          </Group>
        )}

        {candidate.skills.length > 0 && (
          <Group gap="xs" wrap="wrap">
            {candidate.skills.slice(0, 2).map((skill, index) => (
              <Badge key={index} size="xs" variant="light" color="blue">
                {skill}
              </Badge>
            ))}
            {candidate.skills.length > 2 && (
              <Badge size="xs" variant="light" color="blue">
                +{candidate.skills.length - 2}
              </Badge>
            )}
          </Group>
        )}

        <Group gap="xs">
          <IconCalendar size={12} />
          <Text size="xs" c="dimmed">
            {candidate.createdAt.toLocaleDateString('ru-RU')}
          </Text>
        </Group>

        {!isDragging && (
          <Group gap="xs" mt="xs">
            <IconGripVertical size={16} style={{ opacity: 0.5 }} />
            <Text size="xs" c="dimmed">
              Перетащите для перемещения
            </Text>
          </Group>
        )}
      </Stack>
    </Card>
  );
}
