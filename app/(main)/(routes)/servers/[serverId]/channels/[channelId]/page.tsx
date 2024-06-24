import ChatHeader from '@/components/chat/chat-header';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'

interface ChannelIdPage {
  params : {
    serverId : string;
    channelId : string;
  }
}

async function ChannelIdPage({
  params
} : ChannelIdPage) {

  const profile = await currentProfile();

  if(!profile) {
    return auth().redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where : {
      id : params.channelId,
    },
  });

  const member = await db.member.findFirst({
    where : {
      serverId : params.serverId,
      profileId : profile.id,
    }
  });


  if (!channel || !member) {
    redirect("/");
  }

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type='channel'
      />
    </div>
  )
}

export default ChannelIdPage;