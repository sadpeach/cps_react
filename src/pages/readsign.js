import React, { useState, useEffect } from 'react';
import { Input, Button } from 'antd';
import { useParams } from "react-router-dom";
import HolisticSign from '../components/readsign/holisticsign';
import Facesign from '../components/readsign/facesign';
import PoseSign from '../components/readsign/posesign';
import ToSpeech from '../components/texttospeech/tospeech';
import * as tf from '@tensorflow/tfjs'

const { Search } = Input;


export default function Home() {

    const [model, setModel] = useState();

    //model
    const url = {
        model: 'https://cpsmodel.s3.amazonaws.com/model.json'
    }

    //load model
    async function loadModel(url) {
        console.log('checking url:',url);
        try {
            const model = await tf.loadLayersModel(url.model);
            setModel(model);
            console.log('model loaded successfully');
        }
        catch (err) {
            console.log('model loading failed:', err)
        }
    }

    useEffect(()=>{
        tf.ready().then(()=>{
            loadModel(url)
        });
    },[])

    return (
        <div class="container-fluid text-center">
            <h1 class="p-3"><b>The RSLI</b></h1>
            <button type="button" className="btn btn-default btn-lg w-100 p-3">
                <span id="audio" className="glyphicon glyphicon-volume-up" aria-hidden="true"> Audio On</span>
            </button>
            <div>
                {}
                <HolisticSign model={model}/>
            </div>
        </div>
    )
}
