import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'

const sendCodeSchema = z.object({
  sendMethod: z.string(),
  userId: z.number(),
  token: z.string(),
})

const checkCodeScheme = z.object({
  code: z.string().min(6, 'Kod en az 6 haneli olmalı').max(6, 'Kod en fazla 6 haneli olmalı'),
})

export const CheckCodePage = () => {
  const navigate = useNavigate()
  const [sendCodeApiError, setSendCodeApiError] = useState(null)
  const [checkCodeApiError, setCheckCodeApiError] = useState(null)

  const sendCodeForm = useForm({
    resolver: zodResolver(sendCodeSchema),
    defaultValues: {
      sendMethod: 'email',
      userId: parseInt(localStorage.getItem('id')) || 0,
      token: localStorage.getItem('token'),
    }
  })

  const checkCodeForm = useForm({
    resolver: zodResolver(checkCodeScheme),
    defaultValues: {
      userId: parseInt(localStorage.getItem('id')),
      token: localStorage.getItem('token'),
    }
  })

  const sendCodeMutation = useMutation({
    mutationFn: async (postData) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/send-code`, {
        method: 'POST',
        body: JSON.stringify(postData),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return await res.json()
    },
    onError: (error) => {
      console.log(error)
    },
    onSuccess: (data) => {
      if (data.errorCode) {
        setSendCodeApiError(data.errors)
        return
      }
      localStorage.setItem('token', data.token)
    }
  })

  const checkCodeMutation = useMutation({
    mutationFn: async (postData) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/check-code`, {
        method: 'POST',
        body: JSON.stringify(postData),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return await res.json()
    },
    onError: (error) => {
      console.log(error)
    },
    onSuccess: (data) => {
      if (data.errorCode) {
        setCheckCodeApiError(data.errors)
        return
      }
      navigate('/profile')
    }
  })

  const handleSendCode = (postData) => {
    sendCodeMutation.mutate(postData)
  }

  const handleCheckCode = (postData) => {
    const userId = parseInt(localStorage.getItem('id'))
    const token = localStorage.getItem('token')
    postData.userId = userId
    postData.token = token
    checkCodeMutation.mutate(postData)
  }
  return (
    <div className="h-screen flex justify-center items-center">
      <div className='text-left'>
        <form onSubmit={sendCodeForm.handleSubmit(handleSendCode)}>
          <div className='mb-2'>
            <h2 className='text-xl font-bold text-center'>Kod gönderim şekli</h2>
          </div>
          <div className='mb-2 text-center'>
            <div className='mb-2'>
              <label htmlFor="field-email"> 
                <input
                  {...sendCodeForm.register("sendMethod")}
                  type="radio"
                  value="email"
                  id="field-email"
                />
                Email
              </label>
            </div>
            <div>
            <label htmlFor="field-sms">
              <input
                {...sendCodeForm.register("sendMethod")}
                type="radio"
                value="sms"
                id="field-sms"
              />
              SMS
            </label>
            </div>
          </div>
          <div className='text-center mb-8'>
            <button type="submit" className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded'>Gönder</button>
          </div>
          <div>
            {sendCodeForm.formState.errors.sendMethod && <p className='text-red-500 text-xs pl-1'>{sendCodeForm.formState.errors.sendMethod.message}</p>}
          </div>
        </form>

        <form onSubmit={checkCodeForm.handleSubmit(handleCheckCode)}>
          <div className='mb-2'>
            <h2 className='pl-1'>Kod onayla</h2>
          </div>
          <div className='mb-2 h-16'>
            <input type="number" {...checkCodeForm.register('code')} />
            {checkCodeForm.formState.errors.code && <p className='text-red-500 text-xs pl-1'>{checkCodeForm.formState.errors.code.message}</p>}
          </div>
          <div className='text-center'>
            <button type="submit" className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded'>Onayla</button>
          </div>
        </form>
        <div>
          <div>
            {sendCodeApiError && <p className='text-red-500 text-xs pl-1'>{sendCodeApiError}</p>}
          </div>
          <div>
            {checkCodeApiError && <p className='text-red-500 text-xs pl-1'>{checkCodeApiError}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}