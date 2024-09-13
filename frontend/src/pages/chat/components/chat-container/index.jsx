import React from 'react'
import ChatHeader from './components/chat-header'
import MessageContainer from './components/message-container'
import MessageBar from './components/message-bar'

export default function ChatContainer() {
  return (
    <div className='fixed w-[100vw] h-[100vh] bg-[#1c1d25] flex-col flex md:static md:flex-1  '>
      <ChatHeader />
      <MessageContainer />
      <MessageBar />
    </div>
  )
}
