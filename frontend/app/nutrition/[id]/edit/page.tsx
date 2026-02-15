'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container, Row, Col, Form, Button, Card, Spinner } from 'react-bootstrap';
import BootstrapClient from '../../../components/BootstrapClient';
import GymPostersBackground from '../../../components/GymPostersBackground';
import ModernNavbar from '../../../components/ModernNavbar';
import { api } from '../../../lib/api';

interface Food {
  id: string;
  name: string;
  nameUk?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

interface SelectedItem {
  name: string;
  nameUk?: string | null;
  amount: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number | null;
  food?: Food;
  foodId?: string;
  customName?: string;
}

export default function EditNutritionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [nutritionData, setNutritionData] = useState({
    date: '',
    mealType: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchDebounced, setSearchDebounced] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(searchQuery), 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  useEffect(() => {
    fetchLog();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchFoods();
  }, [searchDebounced]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchFoods = async () => {
    try {
      const filters: Record<string, string> = { limit: '100' };
      if (searchDebounced.trim()) filters.search = searchDebounced.trim();
      const data = await api.getFoods(filters) as { foods?: Food[] };
      setFoods(data?.foods ?? []);
    } catch (err) {
      console.error('Error fetching foods:', err);
    }
  };

  const fetchLog = async () => {
    setLoading(true);
    setError('');
    try {
      const log = await api.getNutritionLog(id) as { date: string; mealType?: string; items?: { name?: string; nameUk?: string; amount?: number; calories?: number; protein?: number; carbs?: number; fat?: number; fiber?: number }[] };
      setNutritionData({
        date: new Date(log.date).toISOString().split('T')[0],
        mealType: log.mealType || ''
      });
      const items = log.items || [];
      setSelectedItems(items.map((item: { name?: string; nameUk?: string; amount?: number; calories?: number; protein?: number; carbs?: number; fat?: number; fiber?: number }) => ({
        name: item.name || '',
        nameUk: item.nameUk || null,
        amount: Number(item.amount) || 100,
        calories: item.calories || 0,
        protein: item.protein || 0,
        carbs: item.carbs || 0,
        fat: item.fat || 0,
        fiber: item.fiber ?? null,
        customName: item.name
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка завантаження запису');
    } finally {
      setLoading(false);
    }
  };

  const addFood = (food: Food) => {
    const amount = 100;
    const multiplier = amount / 100;
    setSelectedItems([...selectedItems, {
      name: food.name,
      nameUk: food.nameUk || null,
      amount,
      calories: Math.round(food.calories * multiplier),
      protein: Math.round((food.protein || 0) * multiplier),
      carbs: Math.round((food.carbs || 0) * multiplier),
      fat: Math.round((food.fat || 0) * multiplier),
      fiber: food.fiber ?? null,
      food,
      foodId: food.id,
      customName: ''
    }]);
  };

  const removeItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: number | string) => {
    const updated = [...selectedItems];
    const item = updated[index];
    (item as unknown as Record<string, unknown>)[field] = value;

    if ((field === 'amount' || field === 'foodId') && item.food) {
      const mult = parseFloat(String(item.amount)) / 100;
      item.calories = Math.round((item.food.calories || 0) * mult);
      item.protein = Math.round((item.food.protein || 0) * mult);
      item.carbs = Math.round((item.food.carbs || 0) * mult);
      item.fat = Math.round((item.food.fat || 0) * mult);
    }
    setSelectedItems(updated);
  };

  const calculateTotals = () => {
    return selectedItems.reduce((acc, item) => ({
      calories: acc.calories + (item.calories || 0),
      protein: acc.protein + (item.protein || 0),
      carbs: acc.carbs + (item.carbs || 0),
      fat: acc.fat + (item.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    if (!nutritionData.mealType) {
      setError('Оберіть тип прийому їжі');
      setSaving(false);
      return;
    }
    if (selectedItems.length === 0) {
      setError('Додайте хоча б один продукт');
      setSaving(false);
      return;
    }
    try {
      await api.updateNutritionLog(id, {
        ...nutritionData,
        items: selectedItems.map((item) => ({
          name: item.customName || item.name,
          nameUk: item.nameUk || null,
          amount: parseFloat(String(item.amount)),
          calories: item.calories || 0,
          protein: item.protein || 0,
          carbs: item.carbs || 0,
          fat: item.fat || 0,
          fiber: item.fiber ?? null
        }))
      });
      router.push('/nutrition');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка збереження');
    } finally {
      setSaving(false);
    }
  };

  const totals = calculateTotals();

  if (loading) {
    return (
      <>
        <BootstrapClient />
        <div className="min-h-screen bg-dark d-flex align-items-center justify-content-center">
          <Spinner animation="border" variant="primary" />
        </div>
      </>
    );
  }

  return (
    <>
      <BootstrapClient />
      <div className="min-h-screen bg-dark d-flex flex-column">
        <GymPostersBackground />
        <ModernNavbar />

        <main className="flex-grow-1" style={{ position: 'relative' }}>
          <Container className="py-5" style={{ position: 'relative', zIndex: 1 }}>
            <div className="mb-4">
              <h1 className="mb-2">Редагувати запис харчування</h1>
              <p className="lead" style={{ color: '#d4af37', fontFamily: 'var(--font-oswald)' }}>
                Змінити дані прийому їжі
              </p>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">{error}</div>
            )}

            <Form onSubmit={handleSubmit}>
              <Card className="card-hover-lift mb-4">
                <Card.Body>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold" style={{ color: '#ffffff', fontWeight: 600 }}>Дата</Form.Label>
                        <Form.Control
                          type="date"
                          value={nutritionData.date}
                          onChange={(e) => setNutritionData({ ...nutritionData, date: e.target.value })}
                          required
                          style={{ color: '#ffffff', fontWeight: 500 }}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold" style={{ color: '#ffffff', fontWeight: 600 }}>Тип прийому їжі</Form.Label>
                        <Form.Select
                          value={nutritionData.mealType}
                          onChange={(e) => setNutritionData({ ...nutritionData, mealType: e.target.value })}
                          required
                          style={{ color: '#ffffff', fontWeight: 500 }}
                          aria-label="Тип прийому їжі"
                          title="Тип прийому їжі"
                        >
                          <option value="" style={{ background: '#1a1a1a', color: '#ffffff' }}>Оберіть тип</option>
                          <option value="breakfast" style={{ background: '#1a1a1a', color: '#ffffff' }}>Сніданок</option>
                          <option value="lunch" style={{ background: '#1a1a1a', color: '#ffffff' }}>Обід</option>
                          <option value="dinner" style={{ background: '#1a1a1a', color: '#ffffff' }}>Вечеря</option>
                          <option value="snack" style={{ background: '#1a1a1a', color: '#ffffff' }}>Перекус</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card className="card-hover-lift mb-4">
                <Card.Body>
                  <h5 className="mb-4" style={{ color: '#ffffff', fontWeight: 700 }}>Продукти</h5>
                  <Form.Control
                    type="search"
                    placeholder="Пошук продуктів..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mb-3"
                    style={{ color: '#ffffff', fontWeight: 500 }}
                  />
                  <Form.Select
                    className="mb-4"
                    onChange={(e) => {
                      const food = foods.find(f => f.id === e.target.value);
                      if (food) addFood(food);
                    }}
                    style={{ color: '#ffffff', fontWeight: 500 }}
                    aria-label="Виберіть продукт"
                    title="Виберіть продукт"
                  >
                    <option value="" style={{ background: '#1a1a1a', color: '#ffffff' }}>+ Додати продукт</option>
                    {foods.map(food => (
                      <option key={food.id} value={food.id} style={{ background: '#1a1a1a', color: '#ffffff' }}>
                        {food.nameUk || food.name}
                      </option>
                    ))}
                  </Form.Select>

                  {selectedItems.length > 0 && (
                    <div className="space-y-3">
                      {selectedItems.map((item, idx) => (
                        <Card key={idx} className="mb-3">
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                              <h6 style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', fontSize: '1.1rem' }} className="mb-0">
                                {item.customName || item.nameUk || item.name}
                              </h6>
                              <Button variant="link" size="sm" className="text-danger" onClick={() => removeItem(idx)}>
                                <i className="bi bi-trash"></i>
                              </Button>
                            </div>
                            <Form.Control
                              type="text"
                              placeholder="Власна назва (необов'язково)"
                              value={item.customName ?? ''}
                              onChange={(e) => updateItem(idx, 'customName', e.target.value)}
                              className="mb-3"
                              style={{ color: '#ffffff', fontWeight: 500 }}
                            />
                            <Row className="g-2">
                              <Col md={item.food ? 6 : 12}>
                                <Form.Control
                                  type="number"
                                  placeholder="Вага (г)"
                                  value={item.amount}
                                  onChange={(e) => updateItem(idx, 'amount', parseFloat(e.target.value) || 0)}
                                  step="1"
                                  min="1"
                                  style={{ color: '#ffffff', fontWeight: 500 }}
                                />
                              </Col>
                              {item.food && (
                                <Col md={6}>
                                  <div className="small text-muted">
                                    <div>Кал: {item.calories} ккал</div>
                                    <div>Б: {item.protein}г | В: {item.carbs}г | Ж: {item.fat}г</div>
                                  </div>
                                </Col>
                              )}
                            </Row>
                            {item.customName && (
                              <Row className="g-2 mt-2">
                                <Col md={3}>
                                  <Form.Control
                                    type="number"
                                    placeholder="Калорії"
                                    value={item.calories}
                                    onChange={(e) => updateItem(idx, 'calories', parseFloat(e.target.value) || 0)}
                                    style={{ color: '#ffffff', fontWeight: 500 }}
                                  />
                                </Col>
                                <Col md={3}>
                                  <Form.Control
                                    type="number"
                                    placeholder="Білки"
                                    value={item.protein}
                                    onChange={(e) => updateItem(idx, 'protein', parseFloat(e.target.value) || 0)}
                                    style={{ color: '#ffffff', fontWeight: 500 }}
                                  />
                                </Col>
                                <Col md={3}>
                                  <Form.Control
                                    type="number"
                                    placeholder="Вуглеводи"
                                    value={item.carbs}
                                    onChange={(e) => updateItem(idx, 'carbs', parseFloat(e.target.value) || 0)}
                                    style={{ color: '#ffffff', fontWeight: 500 }}
                                  />
                                </Col>
                                <Col md={3}>
                                  <Form.Control
                                    type="number"
                                    placeholder="Жири"
                                    value={item.fat}
                                    onChange={(e) => updateItem(idx, 'fat', parseFloat(e.target.value) || 0)}
                                    style={{ color: '#ffffff', fontWeight: 500 }}
                                  />
                                </Col>
                              </Row>
                            )}
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>

              {selectedItems.length > 0 && (
                <Card className="card-hover-lift mb-4">
                  <Card.Body>
                    <h5 className="mb-3" style={{ color: '#ffffff', fontWeight: 700 }}>Всього</h5>
                    <Row className="g-3">
                      <Col md={3}><div className="text-center"><div style={{ color: '#d4af37', fontSize: '1.5rem', fontWeight: 'bold' }}>{totals.calories}</div><div style={{ color: '#f5f5f5', fontWeight: 600 }}>Калорій</div></div></Col>
                      <Col md={3}><div className="text-center"><div style={{ color: '#d4af37', fontSize: '1.5rem', fontWeight: 'bold' }}>{totals.protein}г</div><div style={{ color: '#f5f5f5', fontWeight: 600 }}>Білки</div></div></Col>
                      <Col md={3}><div className="text-center"><div style={{ color: '#d4af37', fontSize: '1.5rem', fontWeight: 'bold' }}>{totals.carbs}г</div><div style={{ color: '#f5f5f5', fontWeight: 600 }}>Вуглеводи</div></div></Col>
                      <Col md={3}><div className="text-center"><div style={{ color: '#d4af37', fontSize: '1.5rem', fontWeight: 'bold' }}>{totals.fat}г</div><div style={{ color: '#f5f5f5', fontWeight: 600 }}>Жири</div></div></Col>
                    </Row>
                  </Card.Body>
                </Card>
              )}

              <div className="d-flex gap-3">
                <Button type="submit" variant="primary" size="lg" disabled={saving}>
                  {saving ? <><Spinner animation="border" size="sm" className="me-2" />Збереження...</> : <><i className="bi bi-check-circle me-2"></i>Зберегти зміни</>}
                </Button>
                <Button variant="outline-secondary" size="lg" onClick={() => router.push('/nutrition')}>
                  <i className="bi bi-x-circle me-2"></i>Скасувати
                </Button>
              </div>
            </Form>
          </Container>
        </main>

        <footer className="flex-shrink-0 py-3" style={{ position: 'relative', zIndex: 100, borderTop: '2px solid rgba(212, 175, 55, 0.2)' }}>
          <Container>
            <div className="text-center" style={{ color: '#e0e0e0', fontFamily: 'var(--font-roboto-condensed)', fontSize: '0.85rem', fontWeight: 500 }}>
              © 2024 Кишеньковий тренер
            </div>
          </Container>
        </footer>
      </div>
    </>
  );
}
