import React , {createContext,useState,useEffect,useRef} from 'react'
import {io} from 'socket.io-client'

const SocketContext = createContext();
const socket = io('http://localhost:5000');

socket.on('image',(data) => {
    console.log('data',data);
})


