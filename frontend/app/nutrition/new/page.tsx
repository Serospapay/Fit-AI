'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner } from 'react-bootstrap';
import BootstrapClient from '../../components/BootstrapClient';
import GymPostersBackground from '../../components/GymPostersBackground';
import ModernNavbar from '../../components/ModernNavbar';
import { api } from '../../lib/api';

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

export default function NewNutritionPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [nutritionData, setNutritionData] = useState({
    date: new Date().toISOString().split('T')[0],
    mealType: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const data = await api.getFoods();
      setFoods(data.foods || []);
    } catch (error: unknown) {
      console.error('Error fetching foods:', error);
      setError((error as Error).message || 'Помилка завантаження продуктів');
    }
  };

  const addFood = (food: Food) => {
    const amount = 100;
    setSelectedItems([...selectedItems, {
      foodId: food.id,
      food: food,
      amount: amount,
      customName: '',
      calories: food.calories,
      protein: food.protein || 0,
      carbs: food.carbs || 0,
      fat: food.fat || 0
    }]);
  };

  const removeItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updated = [...selectedItems];
    const item = updated[index];
    
    if (field === 'amount' || field === 'customName' || field === 'calories' || field === 'protein' || field === 'carbs' || field === 'fat') {
      item[field] = value;
    } else if (field === 'foodId') {
      const food = foods.find(f => f.id === value);
      if (food) {
        item.foodId = food.id;
        item.food = food;
      }
    }

    // Recalculate macros if amount or food changed (only if using food from DB)
    if ((field === 'amount' || field === 'foodId') && item.food && !item.customName) {
      const multiplier = parseFloat(item.amount) / 100;
      item.calories = Math.round(item.food.calories * multiplier);
      item.protein = Math.round((item.food.protein || 0) * multiplier);
      item.carbs = Math.round((item.food.carbs || 0) * multiplier);
      item.fat = Math.round((item.food.fat || 0) * multiplier);
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
    setLoading(true);
    setError('');

    if (!nutritionData.mealType) {
      setError('Оберіть тип прийому їжі');
      setLoading(false);
      return;
    }

    if (selectedItems.length === 0) {
      setError('Додайте хоча б один продукт');
      setLoading(false);
      return;
    }

    try {
      const logData = {
        ...nutritionData,
        items: selectedItems.map((item) => ({
          name: item.customName || item.food.name,
          nameUk: item.food.nameUk || null,
          amount: parseFloat(item.amount),
          calories: item.calories || 0,
          protein: item.protein || 0,
          carbs: item.carbs || 0,
          fat: item.fat || 0,
          fiber: item.food.fiber || null
        }))
      };

      await api.createNutritionLog(logData);
      window.location.href = '/nutrition';
    } catch (err: any) {
      setError(err.message || 'Помилка збереження запису');
    } finally {
      setLoading(false);
    }
  };

  const totals = calculateTotals();

  return (
    <>
      <BootstrapClient />
      <div className="min-h-screen bg-dark d-flex flex-column">
        {/* Gym Posters Background */}
        <GymPostersBackground />
        
        {/* Modern Navigation */}
        <ModernNavbar />

        <main className="flex-grow-1" style={{ position: 'relative' }}>
        <Container className="py-5" style={{ position: 'relative', zIndex: 1 }}>
          <div className="mb-4">
            <h1 className="mb-2">Новий запис харчування</h1>
            <p className="lead" style={{ color: '#d4af37', fontFamily: 'var(--font-oswald)' }}>Записати новий прийом їжі</p>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
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

            {/* Foods Selection */}
            <Card className="card-hover-lift mb-4">
              <Card.Body>
                <h5 className="mb-4" style={{ color: '#ffffff', fontWeight: 700 }}>Продукти</h5>
                
                <Form.Select
                  className="mb-4"
                  onChange={(e) => {
                    const food = foods.find(f => f.id === e.target.value);
                    if (food) addFood(food);
                  }}
                  style={{ color: '#ffffff', fontWeight: 500 }}
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
                              {item.customName || (item.food.nameUk || item.food.name)}
                            </h6>
                            <Button
                              variant="link"
                              size="sm"
                              className="text-danger"
                              onClick={() => removeItem(idx)}
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          </div>
                          <Form.Control
                            type="text"
                            placeholder="Власна назва (необов'язково)"
                            value={item.customName}
                            onChange={(e) => updateItem(idx, 'customName', e.target.value)}
                            className="mb-3"
                            style={{ color: '#ffffff', fontWeight: 500 }}
                          />
                          <Row className="g-2">
                            <Col md={item.customName ? 12 : 6}>
                              <Form.Control
                                type="number"
                                placeholder="Вага (г)"
                                value={item.amount}
                                onChange={(e) => updateItem(idx, 'amount', parseFloat(e.target.value))}
                                step="1"
                                min="1"
                                style={{ color: '#ffffff', fontWeight: 500 }}
                              />
                            </Col>
                            {!item.customName && (
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
                                  onChange={(e) => updateItem(idx, 'calories', parseFloat(e.target.value))}
                                  style={{ color: '#ffffff', fontWeight: 500 }}
                                />
                              </Col>
                              <Col md={3}>
                                <Form.Control
                                  type="number"
                                  placeholder="Білки"
                                  value={item.protein}
                                  onChange={(e) => updateItem(idx, 'protein', parseFloat(e.target.value))}
                                  style={{ color: '#ffffff', fontWeight: 500 }}
                                />
                              </Col>
                              <Col md={3}>
                                <Form.Control
                                  type="number"
                                  placeholder="Вуглеводи"
                                  value={item.carbs}
                                  onChange={(e) => updateItem(idx, 'carbs', parseFloat(e.target.value))}
                                  style={{ color: '#ffffff', fontWeight: 500 }}
                                />
                              </Col>
                              <Col md={3}>
                                <Form.Control
                                  type="number"
                                  placeholder="Жири"
                                  value={item.fat}
                                  onChange={(e) => updateItem(idx, 'fat', parseFloat(e.target.value))}
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

            {/* Totals Summary */}
            {selectedItems.length > 0 && (
              <Card className="card-hover-lift mb-4">
                <Card.Body>
                  <h5 className="mb-3" style={{ color: '#ffffff', fontWeight: 700 }}>Всього</h5>
                  <Row className="g-3">
                    <Col md={3}>
                      <div className="text-center">
                        <div style={{ color: '#d4af37', fontFamily: 'var(--font-oswald)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                          {totals.calories}
                        </div>
                        <div style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>Калорій</div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="text-center">
                        <div style={{ color: '#d4af37', fontFamily: 'var(--font-oswald)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                          {totals.protein}г
                        </div>
                        <div style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>Білки</div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="text-center">
                        <div style={{ color: '#d4af37', fontFamily: 'var(--font-oswald)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                          {totals.carbs}г
                        </div>
                        <div style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>Вуглеводи</div>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="text-center">
                        <div style={{ color: '#d4af37', fontFamily: 'var(--font-oswald)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                          {totals.fat}г
                        </div>
                        <div style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>Жири</div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            )}

            <div className="d-flex gap-3">
              <Button type="submit" variant="primary" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Збереження...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Зберегти запис
                  </>
                )}
              </Button>
              <Button variant="outline-secondary" size="lg" href="/nutrition">
                <i className="bi bi-x-circle me-2"></i>
                Скасувати
              </Button>
            </div>
          </Form>
        </Container>
        </main>

        {/* Footer */}
        <footer className="flex-shrink-0 py-3" style={{ position: 'relative', zIndex: 100, borderTop: '2px solid rgba(212, 175, 55, 0.2)' }}>
          <Container>
            <div className="text-center" style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)', fontSize: '0.85rem' }}>
              © 2024 Кишеньковий тренер
            </div>
          </Container>
        </footer>
      </div>
    </>
  );
}

