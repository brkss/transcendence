import { Avatar } from '@chakra-ui/react'
import React from 'react'

export interface IMessage {
    isSelfMessage?: boolean
    message: string;
    date: Date;
}

export default function Message(props: IMessage) {
  return  !props?.isSelfMessage ? 
    (
        <div className="flex flex-row-reverse gap-1 pl-2">
            <Avatar w={8} h={8} />
            <div>
            <p className="p-1 bg-slate-500 text-white px-2 rounded-md">
                {props.message}
            </p>
            <p className="text-[10px]">{props.date.toLocaleDateString()}</p>
            </div>
        </div>
    )
     : 
    (
        <div className="flex flex-row gap-1 pr-2 pl-2">
            <Avatar w={8} h={8} />
            <div>
                <p className="bg-black text-white p-1 px-2 rounded-md break-all relative">
                {props.message}
                </p>
                <p className="text-[10px]">{props.date.toLocaleDateString()}</p>
            </div>
        </div>
    )
}
