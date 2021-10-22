import React, {useState,useEffect} from 'react';
import { Input,Button } from 'antd';
import {useParams} from "react-router-dom";
import HolisticSign from '../components/readsign/holisticsign';
import Facesign from '../components/readsign/facesign';
import PoseSign from '../components/readsign/posesign';
import ToSpeech from '../components/texttospeech/tospeech';

const { Search } = Input;


export default function Home(){
    
    return(
        <div>
            <div>
            <HolisticSign/>
            </div>
        </div>
    )
}
