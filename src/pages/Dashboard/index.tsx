import { useEffect, useState } from 'react'

import { Header } from '../../components/Header'
import api from '../../services/api'
import { Food, FoodType } from '../../components/Food'
import { ModalAddFood } from '../../components/ModalAddFood'
import { ModalEditFood } from '../../components/ModalEditFood'
import { FoodsContainer } from './styles'

export function Dashboard() {
  const [foods, setFoods] = useState<FoodType[]>([])
  const [editingFood, setEditingFood] = useState<FoodType>({} as FoodType)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      const response = await api.get('/foods')
      setFoods(response.data)
    }

    loadFoods()
  }, [])

  async function handleAddFood(food: FoodType) {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      })

      setFoods([...foods, response.data])
    } catch (err) {
      console.log(err)
    }
  }

  async function handleUpdateFood(food: FoodType) {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      )

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      )

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err)
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`)

    const foodsFiltered = foods.filter(food => food.id !== id)

    setFoods(foodsFiltered)
  }

  function handleEditFood(food: FoodType) {
    setEditingFood(food)
    setIsEditModalOpen(true)
  }

  function handleOpenModal() {
    setIsModalOpen(true)
  }

  function handleCloseModal() {
    setIsModalOpen(false)
  }
  function handleCloseEditModal() {
    setIsEditModalOpen(false)
  }

  return (
    <>
      <Header openModal={handleOpenModal} />
      <ModalAddFood
        isOpen={isModalOpen}
        setIsOpen={handleCloseModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={isEditModalOpen}
        setIsOpen={handleCloseEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  )
}
