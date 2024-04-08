import { FontAwesome6, MaterialIcons } from '@expo/vector-icons'
import axios from 'axios'
import { Link, router } from 'expo-router'
import { useState } from 'react'
import { Alert, Image, StatusBar, View } from 'react-native'

import { Button } from '@/components/button'
import { Input } from '@/components/input'

import { api } from '@/server/api'
import { useBadgeStore } from '@/store/badge-store'

import { colors } from '@/styles/colors'

const EVENT_ID = '9e9bd979-9d10-4915-b339-3786b1634f33'

export default function Home() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const badgeStore = useBadgeStore()

  async function handleRegister() {
    try {
      if (!name.trim() || !email.trim()) {
        return Alert.alert('Inscrição', 'Preencha todos os campos!')
      }
      setIsLoading(true)

      const registerResponse = await api.post(`/events/${EVENT_ID}/attendees`, {
        name,
        email,
      })

      if (registerResponse.data.attendeeId) {
        const badgeResponse = await api.get(
          `/attendees/${registerResponse.data.attendeeId}/badge`
        )
        badgeStore.save(badgeResponse.data.badge)
        Alert.alert('Inscrição', 'Inscrição realizada com sucesso!', [
          { text: 'OK', onPress: () => router.push('/ticket') },
        ])
      }
    } catch (e) {
      console.log(e)
      setIsLoading(false)

      if (axios.isAxiosError(e)) {
        if (String(e.response?.data.message).includes('already registered')) {
          return Alert.alert('Inscrição', 'Este e-mail já está cadastrado')
        }
      }

      Alert.alert('Inscrição', 'Não foi possível realizar a inscrição')
    }
  }
  return (
    <View className="flex-1 bg-green-500 items-center justify-center px-8">
      <StatusBar barStyle="light-content" />
      <Image
        source={require('@/assets/logo.png')}
        className="h-16"
        resizeMode="contain"
      />
      <View className="w-full mt-12 gap-3">
        <Input>
          <FontAwesome6
            name="user-circle"
            size={20}
            color={colors.green[200]}
          />
          <Input.Field placeholder="Nome completo" onChangeText={setName} />
        </Input>
        <Input>
          <MaterialIcons
            name="alternate-email"
            size={20}
            color={colors.green[200]}
          />
          <Input.Field
            placeholder="E-mail"
            keyboardType="email-address"
            onChangeText={setEmail}
          />
        </Input>
        <Button
          title="Realizar inscrição"
          onPress={handleRegister}
          isLoading={isLoading}
        />
        <Link
          href="/"
          className="text-gray-100 text-base font-bold text-center mt-8"
        >
          Já possui ingresso?
        </Link>
      </View>
    </View>
  )
}
